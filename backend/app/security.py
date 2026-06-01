from datetime import datetime, timedelta, timezone
from functools import wraps

import jwt
from bson import ObjectId
from flask import g, jsonify, request

from .config import Config
from .db import users_col


def make_token(user):
    payload = {
        "sub": str(user["_id"]),
        "email": user["email"],
        "exp": datetime.now(tz=timezone.utc) + timedelta(days=7),
    }
    return jwt.encode(payload, Config.JWT_SECRET, algorithm="HS256")


def make_admin_token(email):
    payload = {
        "sub": "admin",
        "email": email,
        "role": "admin",
        "exp": datetime.now(tz=timezone.utc) + timedelta(days=1),
    }
    return jwt.encode(payload, Config.JWT_SECRET, algorithm="HS256")


def auth_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            return jsonify({"message": "Unauthorized"}), 401

        token = auth_header.split(" ", 1)[1].strip()
        try:
            payload = jwt.decode(token, Config.JWT_SECRET, algorithms=["HS256"])
            user_id = payload.get("sub")
            if not user_id or not ObjectId.is_valid(user_id):
                return jsonify({"message": "Invalid token"}), 401

            user = users_col.find_one({"_id": ObjectId(user_id)})
            if not user:
                return jsonify({"message": "User not found"}), 401

            g.current_user = user
            return fn(*args, **kwargs)
        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token expired"}), 401
        except jwt.PyJWTError:
            return jsonify({"message": "Invalid token"}), 401

    return wrapper


def admin_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            return jsonify({"message": "Unauthorized"}), 401

        token = auth_header.split(" ", 1)[1].strip()
        try:
            payload = jwt.decode(token, Config.JWT_SECRET, algorithms=["HS256"])
            if payload.get("role") != "admin":
                return jsonify({"message": "Forbidden"}), 403

            g.admin = {"email": payload.get("email", "")}
            return fn(*args, **kwargs)
        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token expired"}), 401
        except jwt.PyJWTError:
            return jsonify({"message": "Invalid token"}), 401

    return wrapper
