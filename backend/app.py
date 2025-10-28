import os, jwt, datetime
from flask import Flask, jsonify, request, session
from pymongo import MongoClient, ASCENDING
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from bson import ObjectId

app=Flask(__name__)

app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "admin")
CORS(app, resources={r"/*": {"origins": "*"}})

client = MongoClient(os.environ.get("MONGODB_URI", "mongodb://localhost:27017"))
db = client[os.environ.get("MONGO_DB", "testdb")]
users = db.users
users.create_index([("username", ASCENDING)], unique=True)

#de aici punem functiile pentru backend, tudor nu modifici ce e mai sus si mai jos de acest comentariu, mai poti adauga librarii
#acesta este un comentariu de test



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)