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
users.create_index([("email", ASCENDING)], unique=True)

def access_token(sub: str, email: str, roles: str, minutes=60):
    payload={
        "sub": sub,
        "email": email,
        "roles": roles,
        "exp": datetime.datetime.utcnow()+datetime.timedelta(minutes=minutes),
        "type": "access"
    }
    return jwt.encode(payload, app.config["SECRET_KEY"], algorithm="HS256")


def decode_token(token: str):
    return jwt.decode(token, app.config["SECRET_KEY"], algorithms=["HS256"])


@app.post("/auth/register")
def register():
    data = request.get_json(silent=True) or {}
    email = data.get("email") or ""
    password = data.get("password") or ""

    if not email or not password:
        return jsonify({"error": "email and password are required"}), 400
    
    try:
        users.insert_one({
            "email": email,
            "password": generate_password_hash(password),
            "roles": ["user"],
            "register_time": datetime.datetime.utcnow()

        })
    except Exception:
        return jsonify({"error": "email already used"}), 409
    return jsonify({"message": "register done"}), 201


@app.post("/auth/login")
def login():
    data = request.get_json(silent=True) or {}
    email = data.get("email") or ""
    password = data.get("password") or ""

    email_check = users.find_one({"email": email})

    if not email_check or not check_password_hash(email_check["password"], password):
        return jsonify({"error": "invalid email or password"}), 401
    
    token = access_token(str(email_check["_id"]), email_check["email"], email_check.get("roles", []))
    return jsonify({"token": token, "user": {"email": email_check["email"], "roles": email_check.get("roles", [])}})

@app.get("/api/me")
def get_me(current_user):
    try:
        user_id = current_user.get("sub")
        
        if not user_id:
            return jsonify({"error": "Payload invalid"}), 400
        
        user = users.find_one({"_id": ObjectId(user_id)})

        if not user:
            return jsonify({"error": "Userul din token nu a fost gasit"}), 404
        
        return jsonify({
            "id": str(user["_id"]),
            "email": user["email"],
            "roles": user.get("roles", [])


        }), 200

    except Exception as e:
        app.logger.error(f"Eroare la /api/me: {e}")
        return jsonify({"error": "Eroare la preluarea datelor userului"}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)