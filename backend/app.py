from flask import Flask, request, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from datetime import datetime, timedelta
import os
import jwt

app = Flask(__name__)

# Configuration
app.config['SECRET_KEY'] = 'your_secret_key_here'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///hotel.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize extensions
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
login_manager = LoginManager(app)

# Models
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    bookings = db.relationship('Booking', backref='user', lazy=True)

class Room(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    room_number = db.Column(db.String(10), unique=True, nullable=False)
    room_type = db.Column(db.String(50), nullable=False)
    price = db.Column(db.Float, nullable=False)
    capacity = db.Column(db.Integer, nullable=False)
    is_available = db.Column(db.Boolean, default=True)
    bookings = db.relationship('Booking', backref='room', lazy=True)

class Booking(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    room_id = db.Column(db.Integer, db.ForeignKey('room.id'), nullable=False)
    check_in = db.Column(db.DateTime, nullable=False)
    check_out = db.Column(db.DateTime, nullable=False)
    total_price = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), default='Pending')

# User Loader for Flask-Login
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Authentication Routes
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    
    new_user = User(
        username=data['username'], 
        email=data['email'], 
        password=hashed_password
    )
    
    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'User registered successfully'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(username=data['username']).first()
    
    if user and bcrypt.check_password_hash(user.password, data['password']):
        login_user(user)
        token = jwt.encode({
            'user_id': user.id, 
            'exp': datetime.utcnow() + timedelta(hours=24)
        }, app.config['SECRET_KEY'])
        
        return jsonify({
            'message': 'Login successful', 
            'token': token,
            'user_id': user.id,
            'is_admin': user.is_admin
        }), 200
    
    return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Logged out successfully'}), 200

# Room Management Routes
@app.route('/rooms', methods=['POST'])
@login_required
def create_room():
    if not current_user.is_admin:
        return jsonify({'error': 'Admin access required'}), 403
    
    data = request.json
    new_room = Room(
        room_number=data['room_number'],
        room_type=data['room_type'],
        price=data['price'],
        capacity=data['capacity']
    )
    
    try:
        db.session.add(new_room)
        db.session.commit()
        return jsonify({'message': 'Room created successfully'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@app.route('/rooms/available', methods=['GET'])
def get_available_rooms():
    check_in = datetime.strptime(request.args.get('check_in'), '%Y-%m-%d')
    check_out = datetime.strptime(request.args.get('check_out'), '%Y-%m-%d')
    
    # Find rooms not booked in the specified date range
    booked_room_ids = db.session.query(Booking.room_id).filter(
        (Booking.check_in < check_out) & (Booking.check_out > check_in)
    ).all()
    
    available_rooms = Room.query.filter(
        Room.id.notin_([room_id for (room_id,) in booked_room_ids])
    ).all()
    
    return jsonify([{
        'id': room.id,
        'room_number': room.room_number,
        'room_type': room.room_type,
        'price': room.price,
        'capacity': room.capacity
    } for room in available_rooms]), 200

# Booking Routes
@app.route('/bookings', methods=['POST'])
@login_required
def create_booking():
    data = request.json
    
    # Check room availability
    conflicting_bookings = Booking.query.filter(
        Booking.room_id == data['room_id'],
        (Booking.check_in < datetime.strptime(data['check_out'], '%Y-%m-%d')) & 
        (Booking.check_out > datetime.strptime(data['check_in'], '%Y-%m-%d'))
    ).all()
    
    if conflicting_bookings:
        return jsonify({'error': 'Room not available for selected dates'}), 400
    
    room = Room.query.get(data['room_id'])
    
    # Calculate total price
    check_in = datetime.strptime(data['check_in'], '%Y-%m-%d')
    check_out = datetime.strptime(data['check_out'], '%Y-%m-%d')
    nights = (check_out - check_in).days
    total_price = room.price * nights
    
    new_booking = Booking(
        user_id=current_user.id,
        room_id=data['room_id'],
        check_in=check_in,
        check_out=check_out,
        total_price=total_price
    )
    
    try:
        db.session.add(new_booking)
        db.session.commit()
        return jsonify({
            'message': 'Booking created successfully', 
            'booking_id': new_booking.id,
            'total_price': total_price
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@app.route('/bookings/checkin/<int:booking_id>', methods=['POST'])
@login_required
def check_in_booking(booking_id):
    if not current_user.is_admin:
        return jsonify({'error': 'Admin access required'}), 403
    
    booking = Booking.query.get_or_404(booking_id)
    booking.status = 'Checked In'
    
    try:
        db.session.commit()
        return jsonify({'message': 'Checked in successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@app.route('/bookings/checkout/<int:booking_id>', methods=['POST'])
@login_required
def check_out_booking(booking_id):
    if not current_user.is_admin:
        return jsonify({'error': 'Admin access required'}), 403
    
    booking = Booking.query.get_or_404(booking_id)
    booking.status = 'Checked Out'
    booking.room.is_available = True
    
    try:
        db.session.commit()
        return jsonify({'message': 'Checked out successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

# Analytics Routes
@app.route('/analytics/revenue', methods=['GET'])
@login_required
def get_revenue_analytics():
    if not current_user.is_admin:
        return jsonify({'error': 'Admin access required'}), 403
    
    # Total revenue
    total_revenue = db.session.query(
        db.func.sum(Booking.total_price)
    ).scalar() or 0
    
    # Bookings by status
    bookings_by_status = db.session.query(
        Booking.status, 
        db.func.count(Booking.id)
    ).group_by(Booking.status).all()
    
    # Revenue by room type
    revenue_by_room_type = db.session.query(
        Room.room_type, 
        db.func.sum(Booking.total_price)
    ).join(Booking).group_by(Room.room_type).all()
    
    return jsonify({
        'total_revenue': total_revenue,
        'bookings_by_status': dict(bookings_by_status),
        'revenue_by_room_type': dict(revenue_by_room_type)
    }), 200

# Initialize Database
with app.app_context():
    db.create_all()


# Main Block
if __name__ == '__main__':
    # Create admin user if not exists
    with app.app_context():
        admin_username = 'admin'
        existing_admin = User.query.filter_by(username=admin_username).first()
        
        if not existing_admin:
            hashed_password = bcrypt.generate_password_hash('admin_password').decode('utf-8')
            admin_user = User(
                username=admin_username, 
                email='admin@hotel.com', 
                password=hashed_password,
                is_admin=True
            )
            db.session.add(admin_user)
            db.session.commit()
            print("Admin user created successfully")
    
    app.run(debug=True)