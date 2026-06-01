from datetime import datetime, timezone

from bson import ObjectId
from flask import Blueprint, g, jsonify, request

from .db import orders_col
from .security import auth_required
from .serializers import order_out

orders_bp = Blueprint("orders", __name__, url_prefix="/api/orders")


@orders_bp.post("")
@auth_required
def create_order():
    data = request.get_json(silent=True) or {}
    items = data.get("items", [])
    totals = data.get("totals", {})
    shipping_address = data.get("shippingAddress", {})
    payment_method = str(data.get("paymentMethod", "cod")).strip()

    if not isinstance(items, list) or not items:
        return jsonify({"message": "Order items are required"}), 400
    if not isinstance(totals, dict) or "total" not in totals:
        return jsonify({"message": "Order totals are required"}), 400

    order = {
        "user_id": ObjectId(g.current_user["_id"]),
        "order_number": f"HM-{int(datetime.now().timestamp())}",
        "status": "processing",
        "items": items,
        "totals": totals,
        "shipping_address": shipping_address,
        "payment_method": payment_method,
        "created_at": datetime.now(tz=timezone.utc),
    }

    result = orders_col.insert_one(order)
    created = orders_col.find_one({"_id": result.inserted_id})
    return jsonify({"order": order_out(created)}), 201


@orders_bp.get("/my-orders")
@auth_required
def my_orders():
    cursor = (
        orders_col.find({"user_id": ObjectId(g.current_user["_id"])})
        .sort("created_at", -1)
    )
    orders = [order_out(doc) for doc in cursor]
    return jsonify({"orders": orders})
