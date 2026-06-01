from datetime import datetime


def _dt(value):
    if isinstance(value, datetime):
        return value.isoformat()
    return None


def user_out(user):
    return {
        "id": str(user["_id"]),
        "name": user.get("name", ""),
        "email": user.get("email", ""),
        "phone": user.get("phone", ""),
        "addresses": user.get("addresses", []),
        "isLoggedIn": True,
        "createdAt": _dt(user.get("created_at")),
    }


def order_out(order):
    return {
        "id": str(order["_id"]),
        "orderNumber": order.get("order_number"),
        "status": order.get("status", "processing"),
        "items": order.get("items", []),
        "totals": order.get("totals", {}),
        "shippingAddress": order.get("shipping_address", {}),
        "paymentMethod": order.get("payment_method", ""),
        "createdAt": _dt(order.get("created_at")),
    }
