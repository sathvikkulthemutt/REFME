# refme_app.py
from flask import Flask, request, jsonify, render_template, redirect, url_for, make_response
from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, verify_jwt_in_request, set_access_cookies
from flask_mail import Mail, Message
from datetime import datetime, timedelta
import secrets, uuid
from pymongo.errors import PyMongoError
from flask_cors import CORS
from functools import wraps

app = Flask(__name__)
CORS(app, supports_credentials=True)

# Configurations
app.config['SECRET_KEY'] = 'supersecretkey'
app.config['MONGO_URI'] = 'mongodb://localhost:27017/linksaver'
app.config['JWT_SECRET_KEY'] = 'jwtsecretkey'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=7)
app.config['JWT_TOKEN_LOCATION'] = ['headers', 'cookies']
app.config['JWT_COOKIE_SECURE'] = False  # Set to True in production with HTTPS
app.config['JWT_COOKIE_CSRF_PROTECT'] = False  # Set to True in production
app.config['JWT_COOKIE_SAMESITE'] = 'Lax'

# Mail Config
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = None
app.config['MAIL_PASSWORD'] = None
app.config['MAIL_DEFAULT_SENDER'] = None

try:
    mongo = PyMongo(app)
    mongo.db.command('ping')
    print("MongoDB connection successful!")
except Exception as e:
    print(f"MongoDB connection failed: {str(e)}")

bcrypt = Bcrypt(app)
jwt = JWTManager(app)
mail = Mail(app)

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            verify_jwt_in_request()
            return f(*args, **kwargs)
        except Exception as e:
            print(f"Authentication error: {str(e)}")
            return redirect(url_for('home'))
    return decorated_function

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/dashboard')
@login_required
def dashboard():
    try:
        username = get_jwt_identity()
        if username:
            return render_template('dashboard.html', username=username)
        return redirect(url_for('home'))
    except Exception as e:
        print(f"Dashboard error: {str(e)}")
        return redirect(url_for('home'))

@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        if not data or 'username' not in data or 'password' not in data:
            return jsonify({'msg': 'Missing username or password'}), 400

        if mongo.db.users.find_one({'username': data['username']}):
            return jsonify({'msg': 'User already exists'}), 409

        hashed_pw = bcrypt.generate_password_hash(data['password']).decode('utf-8')
        mongo.db.users.insert_one({
            'username': data['username'],
            'password': hashed_pw,
            'created_at': datetime.utcnow()
        })
        return jsonify({'msg': 'User registered successfully'}), 201
    except Exception as e:
        print(f"Registration error: {str(e)}")
        return jsonify({'msg': 'Registration failed'}), 500

@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        if not data or 'username' not in data or 'password' not in data:
            return jsonify({'msg': 'Missing username or password'}), 400

        user = mongo.db.users.find_one({'username': data['username']})
        if not user:
            return jsonify({'msg': 'Invalid credentials'}), 401

        if bcrypt.check_password_hash(user['password'], data['password']):
            access_token = create_access_token(identity=data['username'])
            response = jsonify({
                'msg': 'Login successful',
                'username': user['username']
            })
            set_access_cookies(response, access_token)
            return response
        return jsonify({'msg': 'Invalid credentials'}), 401
    except Exception as e:
        print(f"Login error: {str(e)}")
        return jsonify({'msg': 'Login failed'}), 500

@app.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    user = mongo.db.users.find_one({'username': data['username']})
    if not user:
        return jsonify({'msg': 'User not found'}), 404
    token = secrets.token_urlsafe(32)
    mongo.db.password_reset.insert_one({
        'username': data['username'],
        'token': token,
        'expires_at': datetime.utcnow() + timedelta(hours=1)
    })
    reset_link = f"http://localhost:5000/reset-password/{token}"
    msg = Message('Password Reset', recipients=[data['username']])
    msg.body = f'Click the link to reset your password: {reset_link}'
    mail.send(msg)
    return jsonify({'msg': 'Reset email sent'})

@app.route('/reset-password/<token>', methods=['POST'])
def reset_password(token):
    data = request.get_json()
    record = mongo.db.password_reset.find_one({'token': token})
    if not record or datetime.utcnow() > record['expires_at']:
        return jsonify({'msg': 'Invalid or expired token'}), 400
    hashed_pw = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    mongo.db.users.update_one({'username': record['username']}, {'$set': {'password': hashed_pw}})
    mongo.db.password_reset.delete_one({'token': token})
    return jsonify({'msg': 'Password reset successful'})

@app.route('/save_link', methods=['POST'])
@jwt_required()
def save_link():
    try:
        username = get_jwt_identity()
        data = request.get_json()
        if not data or not all(k in data for k in ['title', 'url', 'category', 'privacy']):
            return jsonify({'msg': 'Missing required fields'}), 400

        link = {
            'username': username,
            'title': data['title'],
            'url': data['url'],
            'category': data['category'],
            'privacy': data['privacy'],
            'created_at': datetime.utcnow()
        }
        mongo.db.links.insert_one(link)
        return jsonify({'msg': 'Link saved successfully'}), 201
    except Exception as e:
        print(f"Save link error: {str(e)}")
        return jsonify({'msg': 'Failed to save link'}), 500

@app.route('/get_links', methods=['GET'])
@jwt_required()
def get_links():
    try:
        username = get_jwt_identity()
        links = list(mongo.db.links.find({'username': username}))
        for link in links:
            link['_id'] = str(link['_id'])
        return jsonify(links)
    except Exception as e:
        print(f"Get links error: {str(e)}")
        return jsonify({'msg': 'Failed to fetch links'}), 500

if __name__ == '__main__':
    app.run(debug=True)
