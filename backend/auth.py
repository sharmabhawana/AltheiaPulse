import os
import datetime
from functools import wraps
import jwt
from flask import request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from database import User

JWT_SECRET = os.getenv("JWT_SECRET", "altheiapulse-super-secret-key-change-in-production")

def hash_password(password):
    return generate_password_hash(password)

def verify_password(password, hashed_password):
    return check_password_hash(hashed_password, password)

def generate_token(user):
    payload = {
        "user_id": user.id,
        "email": user.email,
        "role": user.role,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")

def decode_token(token):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        return {"error": "Token has expired."}
    except jwt.InvalidTokenError:
        return {"error": "Invalid token."}

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if "Authorization" in request.headers:
            auth_header = request.headers["Authorization"]
            if auth_header.startswith("Bearer "):
                token = auth_header.split(" ")[1]
        
        if not token:
            return jsonify({"message": "Authentication token is missing!"}), 401
            
        decoded_data = decode_token(token)
        if "error" in decoded_data:
            return jsonify({"message": decoded_data["error"]}), 401
            
        current_user = User.query.get(decoded_data["user_id"])
        if not current_user:
            return jsonify({"message": "User not found!"}), 401
            
        return f(current_user, *args, **kwargs)
    return decorated

def admin_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if "Authorization" in request.headers:
            auth_header = request.headers["Authorization"]
            if auth_header.startswith("Bearer "):
                token = auth_header.split(" ")[1]
        
        if not token:
            return jsonify({"message": "Authentication token is missing!"}), 401
            
        decoded_data = decode_token(token)
        if "error" in decoded_data:
            return jsonify({"message": decoded_data["error"]}), 401
            
        if decoded_data.get("role") != "admin":
            return jsonify({"message": "Admin privileges required!"}), 403
            
        current_user = User.query.get(decoded_data["user_id"])
        if not current_user:
            return jsonify({"message": "User not found!"}), 401
            
        return f(current_user, *args, **kwargs)
    return decorated
