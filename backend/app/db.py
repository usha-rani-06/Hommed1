from pymongo import MongoClient
from .config import Config

client = MongoClient(Config.MONGODB_URI)
db = client[Config.DB_NAME]

users_col = db["users"]
orders_col = db["orders"]
