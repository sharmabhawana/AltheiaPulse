import os
import json
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.String(20), default='user') # 'user' or 'admin'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    predictions = db.relationship('Prediction', backref='user', lazy=True)
    logs = db.relationship('ActivityLog', backref='user', lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "full_name": self.full_name,
            "email": self.email,
            "role": self.role,
            "created_at": self.created_at.isoformat()
        }

class Prediction(db.Model):
    __tablename__ = 'predictions'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True) # nullable for guest predictions
    input_text = db.Column(db.Text, nullable=False)
    prediction = db.Column(db.String(20), nullable=False) # 'Real', 'Fake', 'Suspicious'
    confidence = db.Column(db.Float, nullable=False)
    risk_level = db.Column(db.String(20), nullable=False) # 'High', 'Medium', 'Low'
    detected_location = db.Column(db.String(100), nullable=True)
    explanation = db.Column(db.Text, nullable=True)
    keywords = db.Column(db.String(256), nullable=True) # comma-separated list of detected words
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "input_text": self.input_text,
            "prediction": self.prediction,
            "confidence": self.confidence,
            "risk_level": self.risk_level,
            "detected_location": self.detected_location,
            "explanation": self.explanation,
            "keywords": self.keywords.split(",") if self.keywords else [],
            "created_at": self.created_at.isoformat()
        }

class ActivityLog(db.Model):
    __tablename__ = 'activity_logs'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    action = db.Column(db.String(256), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "action": self.action,
            "timestamp": self.timestamp.isoformat()
        }

class ModelMetric(db.Model):
    __tablename__ = 'model_metrics'
    
    id = db.Column(db.Integer, primary_key=True)
    accuracy = db.Column(db.Float, nullable=False)
    precision_score = db.Column(db.Float, nullable=False)
    recall_score = db.Column(db.Float, nullable=False)
    f1_score = db.Column(db.Float, nullable=False)
    trained_on = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "accuracy": self.accuracy,
            "precision_score": self.precision_score,
            "recall_score": self.recall_score,
            "f1_score": self.f1_score,
            "trained_on": self.trained_on.isoformat()
        }

def init_db(app):
    # Check if DATABASE_URL is set in environment, else fallback to SQLite
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        db_url = "sqlite:///altheiapulse.db"
    
    # Fix Render/Heroku postgresql schema name if needed
    if db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql://", 1)
        
    app.config["SQLALCHEMY_DATABASE_URI"] = db_url
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    
    db.init_app(app)
    
    with app.app_context():
        db.create_all()
        # Seed default metrics if not present
        if not ModelMetric.query.first():
            metrics_path = os.path.join(os.path.dirname(__file__), "..", "model", "metrics.json")
            if os.path.exists(metrics_path):
                with open(metrics_path, "r") as f:
                    m = json.load(f)
                metric = ModelMetric(
                    accuracy=m["accuracy"],
                    precision_score=m["precision"],
                    recall_score=m["recall"],
                    f1_score=m["f1_score"]
                )
                db.session.add(metric)
                db.session.commit()
            else:
                metric = ModelMetric(
                    accuracy=88.7,
                    precision_score=87.9,
                    recall_score=89.4,
                    f1_score=88.6
                )
                db.session.add(metric)
                db.session.commit()
