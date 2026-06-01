from bson import ObjectId
from flask import Blueprint, jsonify, request

from .config import Config
from .db import orders_col, users_col
from .security import admin_required, make_admin_token
from .serializers import order_out

admin_bp = Blueprint("admin", __name__, url_prefix="/api/admin")


@admin_bp.post("/login")
def admin_login():
    data = request.get_json(silent=True) or {}
    email = str(data.get("email", "")).strip().lower()
    password = str(data.get("password", "")).strip()

    if not email or not password:
        return jsonify({"message": "email and password are required"}), 400

    if email != Config.ADMIN_EMAIL or password != Config.ADMIN_PASSWORD:
        return jsonify({"message": "Invalid admin credentials"}), 401

    token = make_admin_token(email)
    return jsonify({"token": token, "admin": {"email": email}})


@admin_bp.get("/orders")
@admin_required
def get_all_orders():
    cursor = orders_col.find({}).sort("created_at", -1)

    orders = []
    for doc in cursor:
        order = order_out(doc)
        user = users_col.find_one({"_id": ObjectId(doc["user_id"])})
        order["user"] = {
            "id": str(user["_id"]) if user else "",
            "name": user.get("name", "") if user else "",
            "email": user.get("email", "") if user else "",
            "phone": user.get("phone", "") if user else "",
        }
        orders.append(order)

    return jsonify({"orders": orders})
