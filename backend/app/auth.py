from datetime import datetime, timezone

import bcrypt
from flask import Blueprint, g, jsonify, request

from .db import users_col
from .security import auth_required, make_token
from .serializers import user_out

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


@auth_bp.post("/register")
def register():
    data = request.get_json(silent=True) or {}
    name = str(data.get("name", "")).strip()
    email = str(data.get("email", "")).strip().lower()
    password = str(data.get("password", "")).strip()
    phone = str(data.get("phone", "")).strip()

    if not name or not email or not password:
        return jsonify({"message": "name, email, password are required"}), 400
    if len(password) < 6:
        return jsonify({"message": "Password must be at least 6 characters"}), 400

    existing = users_col.find_one({"email": email})
    if existing:
        return jsonify({"message": "Email already registered"}), 409

    password_hash = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())

    user = {
        "name": name,
        "email": email,
        "password_hash": password_hash.decode("utf-8"),
        "phone": phone,
        "addresses": [],
        "wishlist": [],
        "created_at": datetime.now(tz=timezone.utc),
    }
    result = users_col.insert_one(user)
    created = users_col.find_one({"_id": result.inserted_id})
    token = make_token(created)
    return jsonify({"token": token, "user": user_out(created)}), 201


@auth_bp.post("/login")
def login():
    data = request.get_json(silent=True) or {}
    email = str(data.get("email", "")).strip().lower()
    password = str(data.get("password", "")).strip()
    if not email or not password:
        return jsonify({"message": "email and password are required"}), 400

    user = users_col.find_one({"email": email})
    if not user:
        return jsonify({"message": "Invalid credentials"}), 401

    if not bcrypt.checkpw(
        password.encode("utf-8"), user["password_hash"].encode("utf-8")
    ):
        return jsonify({"message": "Invalid credentials"}), 401

    token = make_token(user)
    return jsonify({"token": token, "user": user_out(user)})


@auth_bp.get("/me")
@auth_required
def me():
    return jsonify({"user": user_out(g.current_user)})
