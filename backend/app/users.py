from flask import Blueprint, g, jsonify, request
from pymongo import ReturnDocument

from .db import users_col
from .security import auth_required
from .serializers import user_out

users_bp = Blueprint("users", __name__, url_prefix="/api/users")


@users_bp.get("/me")
@auth_required
def get_profile():
    return jsonify({"user": user_out(g.current_user)})


@users_bp.patch("/me")
@auth_required
def update_profile():
    data = request.get_json(silent=True) or {}
    updates = {}

    for key in ("name", "phone"):
        if key in data:
            updates[key] = str(data[key]).strip()

    if not updates:
        return jsonify({"message": "No valid fields to update"}), 400

    updated = users_col.find_one_and_update(
        {"_id": g.current_user["_id"]},
        {"$set": updates},
        return_document=ReturnDocument.AFTER,
    )
    return jsonify({"user": user_out(updated)})


@users_bp.get("/addresses")
@auth_required
def get_addresses():
    return jsonify({"addresses": g.current_user.get("addresses", [])})


@users_bp.post("/addresses")
@auth_required
def add_address():
    data = request.get_json(silent=True) or {}
    required = ["fullName", "line1", "city", "state", "pincode", "country"]
    if any(not str(data.get(k, "")).strip() for k in required):
        return jsonify({"message": "Missing address fields"}), 400

    addresses = list(g.current_user.get("addresses", []))
    is_default = bool(data.get("isDefault", not addresses))
    if is_default:
        for addr in addresses:
            addr["isDefault"] = False

    addresses.append(
        {
            "fullName": str(data["fullName"]).strip(),
            "line1": str(data["line1"]).strip(),
            "line2": str(data.get("line2", "")).strip(),
            "city": str(data["city"]).strip(),
            "state": str(data["state"]).strip(),
            "pincode": str(data["pincode"]).strip(),
            "country": str(data["country"]).strip(),
            "phone": str(data.get("phone", "")).strip(),
            "isDefault": is_default,
        }
    )

    updated = users_col.find_one_and_update(
        {"_id": g.current_user["_id"]},
        {"$set": {"addresses": addresses}},
        return_document=ReturnDocument.AFTER,
    )
    return jsonify({"addresses": updated.get("addresses", [])}), 201
