import os, jwt, datetime, requests
from flask import Flask, jsonify, request
from pymongo import MongoClient, ASCENDING
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from bson import ObjectId
from functools import wraps

app = Flask(__name__)

app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "admin")
GOOGLE_CLIENT_ID = "667973662276-clgm0u6d33an3eo94fs1r3dtm14mofmj.apps.googleusercontent.com"

CORS(app, resources={r"/*": {"origins": "*"}})

client = MongoClient(os.environ.get("MONGODB_URI", "mongodb://localhost:27017"))
db = client[os.environ.get("MONGO_DB", "testdb")]
users = db.users
users.create_index([("email", ASCENDING)], unique=True)

orders = db.orders

def access_token(sub: str, email: str, roles: str, minutes=60):
    payload = {
        "sub": sub,
        "email": email,
        "roles": roles,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=minutes),
        "type": "access"
    }
    return jwt.encode(payload, app.config["SECRET_KEY"], algorithm="HS256")

def decode_token(token: str):
    return jwt.decode(token, app.config["SECRET_KEY"], algorithms=["HS256"])

def token_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token_header = request.headers.get('Authorization')
        
        if not token_header:
            return jsonify({"error": "Token-ul de autorizare lipsește"}), 401

        try:
            parts = token_header.split()
            if parts[0].lower() != 'bearer' or len(parts) != 2:
                raise jwt.InvalidTokenError("Formatul token-ului este invalid.")
            
            token = parts[1]
            payload = decode_token(token)
            
            if payload.get("type") != "access":
                    return jsonify({"error": "Tip de token invalid"}), 401

            kwargs['current_user'] = payload 

        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token-ul a expirat"}), 401
        except (jwt.InvalidTokenError, Exception) as e:
            return jsonify({"error": "Token invalid", "details": str(e)}), 401
        
        return f(*args, **kwargs)
    
    return decorated_function

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

@app.post("/auth/google")
def google_auth():
    data = request.get_json(silent=True) or {}
    token = data.get("token")

    if not token:
        return jsonify({"error": "Token lipsa"}), 400

    try:
        response = requests.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            headers={"Authorization": f"Bearer {token}"}
        )

        if response.status_code != 200:
            return jsonify({"error": "Token Google invalid"}), 400

        user_info = response.json()
        email = user_info.get("email")
        
        user = users.find_one({"email": email})

        if not user:
            result = users.insert_one({
                "email": email,
                "password": "google_auth_user",
                "roles": ["user"],
                "register_time": datetime.datetime.utcnow()
            })
            user = users.find_one({"_id": result.inserted_id})

        token = access_token(str(user["_id"]), user["email"], user.get("roles", []))
        
        return jsonify({
            "token": token, 
            "user": {
                "email": user["email"], 
                "roles": user.get("roles", [])
            }
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.get("/api/me")
@token_required
def get_me(current_user):
    try:
        user_id = current_user.get("sub")
        
        if not user_id:
            return jsonify({"error": "Payload invalid"}), 400
        
        user = users.find_one({"_id": ObjectId(user_id)})

        if not user:
            return jsonify({"error": "Userul nu a fost gasit"}), 404
        
        return jsonify({
            "id": str(user["_id"]),
            "email": user["email"],
            "roles": user.get("roles", [])
        }), 200

    except Exception as e:
        app.logger.error(f"Eroare la /api/me: {e}")
        return jsonify({"error": "Eroare server"}), 500

@app.post("/api/orders")
@token_required
def create_order(current_user):
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "JSON missing"}), 400

        items = data.get("items")
        total_price = data.get("total_price")

        if not items or not total_price:
            return jsonify({"error": "items si total_price required"}), 400
        
        if not isinstance(items, list):
            return jsonify({"error": "items trebuie sa fie lista"}), 400
        
        user_id = current_user.get("sub")

        new_order = {
            "user_id": ObjectId(user_id),
            "items": items,
            "total_price": total_price,
            "status": "received",
            "created_at": datetime.datetime.utcnow()
        }

        result = orders.insert_one(new_order)

        return jsonify({
            "message": "Comanda creata",
            "order_id": str(result.inserted_id)
        }), 201
    except Exception as e:
        app.logger.error(f"Eroare la /api/orders: {e}")
        return jsonify({"error": "Eroare la crearea comenzii"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)