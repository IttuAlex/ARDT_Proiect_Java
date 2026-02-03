import os, jwt, datetime
from flask import Flask, jsonify, request
from pymongo import MongoClient, ASCENDING
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from bson import ObjectId
from functools import wraps
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import requests
import random

SMTP_EMAIL = "tudorlepirda@gmail.com"
SMTP_PASSWORD = "vnsy ncdg sopf tkqn"

app = Flask(__name__)

app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "admin")
GOOGLE_CLIENT_ID = "667973662276-clgm0u6d33an3eo94fs1r3dtm14mofmj.apps.googleusercontent.com"
SMTP_EMAIL = "tudorlepirda@gmail.com"
SMTP_PASSWORD = "vnsy ncdg sopf tkqn"

CORS(app, resources={r"/*": {"origins": "*"}})

client = MongoClient(os.environ.get("MONGODB_URI", "mongodb://localhost:27017"))
db = client[os.environ.get("MONGO_DB", "testdb")]
users = db.users
users.create_index([("email", ASCENDING)], unique=True)

orders = db.orders

def access_token(sub: str, email: str, roles: str):
    payload = {
        "sub": sub,
        "email": email,
        "roles": roles,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=30),
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
            return jsonify({"error": "Lipseste token-ul de autorizare"}), 401

        try:
            parts = token_header.split()
            if parts[0].lower() != 'bearer' or len(parts) != 2:
                raise jwt.InvalidTokenError("Format invalid")
            
            token = parts[1]
            payload = decode_token(token)
            
            if payload.get("type") != "access":
                    return jsonify({"error": "Tip de token invalid"}), 401

            kwargs['current_user'] = payload 

        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token expirat"}), 401
        except (jwt.InvalidTokenError, Exception) as e:
            return jsonify({"error": "Token invalid", "details": str(e)}), 401
        
        return f(*args, **kwargs)
    
    return decorated_function

def send_reset_email(to_email, token):
    try:
        msg = MIMEMultipart()
        msg['From'] = SMTP_EMAIL
        msg['To'] = to_email
        msg['Subject'] = "Resetare Parola"

        link = f"http://localhost:5173/login?token={token}"
        
        body = f"Salut,\n\nAm primit o cerere de resetare a parolei pentru contul tau.\n\nDa click pe link-ul de mai jos pentru a seta o parola noua:\n{link}\n\nDaca nu ai cerut acest lucru, ignora mesajul."
        
        msg.attach(MIMEText(body, 'plain'))

        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(SMTP_EMAIL, SMTP_PASSWORD)
        text = msg.as_string()
        server.sendmail(SMTP_EMAIL, to_email, text)
        server.quit()
        return True
    except Exception as e:
        print(e)
        return False

@app.post("/auth/register")
def register():
    data = request.get_json(silent=True) or {}
    email = data.get("email") or ""
    password = data.get("password") or ""

    if not email or not password:
        return jsonify({"error": "Date incomplete"}), 400
    
    try:
        new_user = {
            "email": email,
            "password": generate_password_hash(password),
            "roles": ["user"],
            "register_time": datetime.datetime.utcnow()
        }
        result = users.insert_one(new_user)
        
        user = users.find_one({"_id": result.inserted_id})
        token = access_token(str(user["_id"]), user["email"], user.get("roles", []))
        
        return jsonify({
            "message": "Inregistrare reusita",
            "token": token,
            "user": {
                "email": user["email"],
                "roles": user.get("roles", [])
            }
        }), 201

    except Exception as e:
        if "duplicate key error" in str(e):
             return jsonify({"error": "Email deja existent"}), 409
        return jsonify({"error": str(e)}), 500

@app.post("/auth/login")
def login():
    data = request.get_json(silent=True) or {}
    email = data.get("email") or ""
    password = data.get("password") or ""

    user = users.find_one({"email": email})

    if not user:
        return jsonify({"error": "Date incorecte"}), 401
        
    if user["password"].startswith("google_auth_user"):
         return jsonify({"error": "Acest cont foloseste Google Login"}), 401

    if not check_password_hash(user["password"], password):
        return jsonify({"error": "Date incorecte"}), 401
    
    token = access_token(str(user["_id"]), user["email"], user.get("roles", []))
    
    return jsonify({
        "token": token, 
        "user": {
            "email": user["email"], 
            "roles": user.get("roles", [])
        }
    })

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

@app.post("/auth/forgot-password")
def forgot_password():
    data = request.get_json(silent=True) or {}
    email = data.get("email")

    user = users.find_one({"email": email})
    
    if user:
        reset_token = jwt.encode({
            "sub": str(user["_id"]),
            "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=15),
            "type": "reset"
        }, app.config["SECRET_KEY"], algorithm="HS256")

        send_reset_email(email, reset_token)

    return jsonify({"message": "Email trimis daca exista contul"}), 200

@app.post("/auth/reset-password")
def reset_password():
    data = request.get_json(silent=True) or {}
    token = data.get("token")
    new_password = data.get("password")

    if not token or not new_password:
        return jsonify({"error": "Date incomplete"}), 400

    try:
        payload = jwt.decode(token, app.config["SECRET_KEY"], algorithms=["HS256"])
        
        if payload.get("type") != "reset":
            return jsonify({"error": "Token invalid"}), 400

        user_id = payload.get("sub")
        
        hashed_password = generate_password_hash(new_password)
        users.update_one(
            {"_id": ObjectId(user_id)}, 
            {"$set": {"password": hashed_password}}
        )

        return jsonify({"message": "Parola schimbata"}), 200

    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Link expirat"}), 400
    except Exception:
        return jsonify({"error": "Token invalid"}), 400

@app.get("/api/me")
@token_required
def get_me(current_user):
    try:
        user_id = current_user.get("sub")
        
        if not user_id:
            return jsonify({"error": "Payload invalid"}), 400
        
        user = users.find_one({"_id": ObjectId(user_id)})

        if not user:
            return jsonify({"error": "User inexistent"}), 404
        
        return jsonify({
            "id": str(user["_id"]),
            "email": user["email"],
            "roles": user.get("roles", []),
            "loyalty_points": user.get("loyalty_points", 0)
        }), 200

    except Exception as e:
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
            return jsonify({"error": "Date incomplete"}), 400
        
        if not isinstance(items, list):
            return jsonify({"error": "Items trebuie sa fie lista"}), 400
        
        user_id = current_user.get("sub")
        
        puncte_noi = random.randint(1, 3) # Generează 1, 2 sau 3 puncte
        users.update_one(
            {"_id": ObjectId(user_id)},
            {"$inc": {"loyalty_points": puncte_noi}} # Crește punctele în DB
        )

        new_order = {
            "user_id": ObjectId(user_id),
            "items": items,
            "total_price": total_price,
            "status": "received",
            "loyalty_points_earned": puncte_noi,
            "created_at": datetime.datetime.utcnow()
        }

        result = orders.insert_one(new_order)

        return jsonify({
            "message": "Comanda creata",
            "order_id": str(result.inserted_id)
        }), 201
    except Exception as e:
        return jsonify({"error": "Eroare comanda"}), 500

@app.get("/api/admin/stats")
@token_required
def get_admin_stats(current_user):
    try:
        # --- 1. Calculăm Venituri și Nr. Comenzi ---
        pipeline_sum = [
            {"$group": {"_id": None, "rev": {"$sum": "$total_price"}, "count": {"$sum": 1}}}
        ]
        sum_res = list(orders.aggregate(pipeline_sum))
        summary = sum_res[0] if sum_res else {"rev": 0, "count": 0}

        # --- 2. Numărăm Userii Noi (ultimele 30 zile) ---
        thirty_days = datetime.datetime.utcnow() - datetime.timedelta(days=30)
        new_u = users.count_documents({"register_time": {"$gte": thirty_days}})

        # --- 3. Top 5 Produse ---
        pipeline_p = [
            {"$unwind": "$items"},
            {"$group": {"_id": "$items.name", "val": {"$sum": 1}}},
            {"$sort": {"val": -1}}, 
            {"$limit": 5}
        ]
        top_p = [{"name": p["_id"], "value": p["val"]} for p in orders.aggregate(pipeline_p)]

        # --- 4. Trend Vânzări (ultimele 7 zile) ---
        seven_days = datetime.datetime.utcnow() - datetime.timedelta(days=7)
        pipeline_t = [
            {"$match": {"created_at": {"$gte": seven_days}}},
            {"$group": {
                "_id": {"$dateToString": {"format": "%Y-%m-%d", "date": "$created_at"}}, 
                "total": {"$sum": "$total_price"}
            }},
            {"$sort": {"_id": 1}}
        ]
        trend = [{"date": t["_id"], "revenue": round(t["total"], 2)} for t in orders.aggregate(pipeline_t)]

        return jsonify({
            "summary": {
                "totalRevenue": round(summary.get("rev", 0), 2), 
                "totalOrders": summary.get("count", 0), 
                "newUsers": new_u
            },
            "topProducts": top_p,
            "salesTrend": trend
        }), 200

    except Exception as e:
        print(f"Eroare Stats: {str(e)}")
        return jsonify({"error": str(e)}), 500
    
@app.get("/api/admin/all-orders")
@token_required
def get_all_orders(current_user):
    try:
        all_orders = list(orders.find().sort("created_at", -1))
        for order in all_orders:
            order["_id"] = str(order["_id"])
            order["user_id"] = str(order.get("user_id", ""))
        return jsonify(all_orders), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# 2. Rută pentru a finaliza o comandă
@app.patch("/api/admin/orders/<order_id>/finalize")
@token_required
def finalize_order(current_user, order_id):
    try:
        result = orders.update_one(
            {"_id": ObjectId(order_id)},
            {"$set": {"status": "finalized"}}
        )
        if result.modified_count:
            return jsonify({"message": "Comanda a fost finalizata!"}), 200
        return jsonify({"error": "Comanda nu a fost gasita"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    


@app.get("/api/orders/my-orders")
@token_required
def get_my_orders(current_user):
    try:
        user_id = current_user.get("sub")
        # Căutăm în baza de date doar comenzile acestui user
        my_orders = list(orders.find({"user_id": ObjectId(user_id)}).sort("created_at", -1))
        
        for order in my_orders:
            order["_id"] = str(order["_id"])
            order["user_id"] = str(order["user_id"])
            
        return jsonify(my_orders), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500  


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)