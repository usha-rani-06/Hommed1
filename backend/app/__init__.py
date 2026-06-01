from flask import Flask, jsonify
from flask_cors import CORS

from .admin import admin_bp
from .auth import auth_bp
from .config import Config
from .orders import orders_bp
from .users import users_bp


def create_app():
    Config.validate()

    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(
        app,
        resources={r"/api/*": {"origins": app.config["CLIENT_ORIGIN"]}},
        supports_credentials=True,
    )

    @app.get("/api/health")
    def health():
        return jsonify({"status": "ok", "service": "hommed-python-backend"})

    app.register_blueprint(auth_bp)
    app.register_blueprint(users_bp)
    app.register_blueprint(orders_bp)
    app.register_blueprint(admin_bp)

    @app.errorhandler(404)
    def not_found(_err):
        return jsonify({"message": "Route not found"}), 404

    @app.errorhandler(Exception)
    def handle_error(err):
        return jsonify({"message": str(err)}), 500

    return app
