import os
import json
from datetime import datetime, timedelta
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Load env variables
load_dotenv()

from database import db, init_db, User, Prediction, ActivityLog, ModelMetric
from auth import hash_password, verify_password, generate_token, token_required, admin_required
from ml_model import analyze_text

app = Flask(__name__)
# Enable CORS for all routes (important for React frontend integration)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Initialize database
init_db(app)

# Helper to log activities
def log_activity(user_id, action):
    try:
        log = ActivityLog(user_id=user_id, action=action)
        db.session.add(log)
        db.session.commit()
    except Exception as e:
        print(f"Error logging activity: {e}")
        db.session.rollback()

# Seed default accounts if DB is empty
with app.app_context():
    try:
        if not User.query.filter_by(email="admin@altheiapulse.com").first():
            admin = User(
                full_name="Administrator",
                email="admin@altheiapulse.com",
                password_hash=hash_password("adminpassword"),
                role="admin"
            )
            db.session.add(admin)
            
            # Create a regular user
            user = User(
                full_name="John Doe",
                email="user@altheiapulse.com",
                password_hash=hash_password("userpassword"),
                role="user"
            )
            db.session.add(user)
            db.session.commit()
            print("Successfully seeded default accounts (admin@altheiapulse.com / user@altheiapulse.com)")
    except Exception as e:
        print(f"Failed to seed default accounts: {e}")
        db.session.rollback()

@app.route("/", methods=["GET"])
def health_check():
    return jsonify({
        "status": "healthy",
        "service": "AltheiaPulse REST API",
        "timestamp": datetime.utcnow().isoformat()
    })

@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json()
    if not data:
        return jsonify({"message": "Invalid request body!"}), 400
        
    full_name = data.get("full_name")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role", "user") # default to regular user
    
    if not full_name or not email or not password:
        return jsonify({"message": "Full Name, Email, and Password are required!"}), 400
        
    # Check if user already exists
    if User.query.filter_by(email=email).first():
        return jsonify({"message": "User with this email already exists!"}), 409
        
    try:
        new_user = User(
            full_name=full_name,
            email=email,
            password_hash=hash_password(password),
            role=role
        )
        db.session.add(new_user)
        db.session.commit()
        
        # Log registration
        log_activity(new_user.id, "Registered new account")
        
        return jsonify({
            "message": "User registered successfully!",
            "user": new_user.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Registration failed: {str(e)}"}), 500

@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    if not data:
        return jsonify({"message": "Invalid credentials!"}), 400
        
    email = data.get("email")
    password = data.get("password")
    
    if not email or not password:
        return jsonify({"message": "Email and Password are required!"}), 400
        
    user = User.query.filter_by(email=email).first()
    if not user or not verify_password(password, user.password_hash):
        return jsonify({"message": "Incorrect email or password!"}), 401
        
    try:
        token = generate_token(user)
        log_activity(user.id, "Logged into system")
        
        return jsonify({
            "message": "Login successful!",
            "token": token,
            "user": user.to_dict()
        }), 200
    except Exception as e:
        return jsonify({"message": f"Login failed: {str(e)}"}), 500

@app.route("/api/predict", methods=["POST"])
def predict():
    data = request.get_json()
    if not data or not data.get("text"):
        return jsonify({"message": "Text parameter is required for analysis!"}), 400
        
    text = data.get("text")
    
    # Check for authentication (Optional: guests can predict, but logged in users get history saved)
    token = None
    user_id = None
    if "Authorization" in request.headers:
        auth_header = request.headers["Authorization"]
        if auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
            
    if token:
        from auth import decode_token
        decoded_data = decode_token(token)
        if "user_id" in decoded_data:
            user_id = decoded_data["user_id"]
            
    try:
        # Run ML inference
        analysis_result = analyze_text(text)
        
        # Save to database
        new_prediction = Prediction(
            user_id=user_id,
            input_text=text,
            prediction=analysis_result["prediction"],
            confidence=analysis_result["confidence"],
            risk_level=analysis_result["risk_level"],
            detected_location=analysis_result["detected_location"],
            explanation=analysis_result["explanation"],
            keywords=analysis_result["keywords"]
        )
        db.session.add(new_prediction)
        db.session.commit()
        
        if user_id:
            log_activity(user_id, f"Verified text prediction: {analysis_result['prediction']}")
            
        return jsonify(new_prediction.to_dict()), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"ML Inference / Saving prediction failed: {str(e)}"}), 500

@app.route("/api/history", methods=["GET"])
@token_required
def get_history(current_user):
    search = request.args.get("search", "")
    filter_pred = request.args.get("prediction", "")
    
    try:
        # Admins can view all history, standard users can view only their own
        if current_user.role == "admin":
            query = Prediction.query
        else:
            query = Prediction.query.filter_by(user_id=current_user.id)
            
        if search:
            query = query.filter(Prediction.input_text.ilike(f"%{search}%") | Prediction.detected_location.ilike(f"%{search}%"))
            
        if filter_pred:
            query = query.filter_by(prediction=filter_pred)
            
        predictions = query.order_by(Prediction.created_at.desc()).all()
        return jsonify([p.to_dict() for p in predictions]), 200
    except Exception as e:
        return jsonify({"message": f"Error retrieving prediction history: {str(e)}"}), 500

@app.route("/api/stats", methods=["GET"])
def get_stats():
    # Public route to get landing/dashboard stats
    try:
        # Basic prediction counts
        total_predictions = Prediction.query.count()
        real_count = Prediction.query.filter_by(prediction="Real").count()
        fake_count = Prediction.query.filter_by(prediction="Fake").count()
        suspicious_count = Prediction.query.filter_by(prediction="Suspicious").count()
        
        high_risk_count = Prediction.query.filter_by(risk_level="High").count()
        medium_risk_count = Prediction.query.filter_by(risk_level="Medium").count()
        
        # ML metrics
        metrics = ModelMetric.query.order_by(ModelMetric.trained_on.desc()).first()
        metrics_dict = {
            "accuracy": metrics.accuracy if metrics else 88.7,
            "precision": metrics.precision_score if metrics else 87.9,
            "recall": metrics.recall_score if metrics else 89.4,
            "f1_score": metrics.f1_score if metrics else 88.6
        }
        
        # Grouped daily counts for charts (last 7 days)
        weekly_data = []
        today = datetime.utcnow().date()
        for i in range(6, -1, -1):
            date_day = today - timedelta(days=i)
            # Query for the count on this day
            start_time = datetime.combine(date_day, datetime.min.time())
            end_time = datetime.combine(date_day, datetime.max.time())
            
            day_total = Prediction.query.filter(Prediction.created_at >= start_time, Prediction.created_at <= end_time).count()
            day_real = Prediction.query.filter(Prediction.created_at >= start_time, Prediction.created_at <= end_time, Prediction.prediction == "Real").count()
            day_fake = Prediction.query.filter(Prediction.created_at >= start_time, Prediction.created_at <= end_time, Prediction.prediction == "Fake").count()
            
            weekly_data.append({
                "day": date_day.strftime("%a"),
                "total": day_total,
                "real": day_real,
                "fake": day_fake
            })
            
        # Latest alerts/predictions table (top 5)
        latest_predictions = Prediction.query.order_by(Prediction.created_at.desc()).limit(5).all()
        
        return jsonify({
            "total_predictions": total_predictions,
            "distribution": {
                "real": real_count,
                "fake": fake_count,
                "suspicious": suspicious_count
            },
            "risk_levels": {
                "high": high_risk_count,
                "medium": medium_risk_count
            },
            "ml_metrics": metrics_dict,
            "weekly_activity": weekly_data,
            "latest_predictions": [p.to_dict() for p in latest_predictions]
        }), 200
        
    except Exception as e:
        return jsonify({"message": f"Error retrieving stats: {str(e)}"}), 500

@app.route("/api/admin/reports", methods=["GET"])
@admin_required
def admin_reports(current_user):
    try:
        users = User.query.order_by(User.created_at.desc()).all()
        logs = ActivityLog.query.order_by(ActivityLog.timestamp.desc()).limit(100).all()
        
        # Include joined usernames in logs for display
        logs_list = []
        for log in logs:
            user = User.query.get(log.user_id) if log.user_id else None
            logs_list.append({
                "id": log.id,
                "user_name": user.full_name if user else "System/Guest",
                "user_email": user.email if user else "N/A",
                "action": log.action,
                "timestamp": log.timestamp.isoformat()
            })
            
        return jsonify({
            "users": [u.to_dict() for u in users],
            "activity_logs": logs_list
        }), 200
    except Exception as e:
        return jsonify({"message": f"Error loading admin report: {str(e)}"}), 500

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    debug = os.getenv("FLASK_ENV", "production") != "production"
    app.run(host="0.0.0.0", port=port, debug=debug)
