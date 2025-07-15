from flask import Flask, request, jsonify  
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt  
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity,get_jwt 
from flask_cors import CORS, cross_origin  
from datetime import datetime, timedelta


# Initialize Flask app
app = Flask(__name__)

# Configure Database (SQLite for simplicity)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:admin@localhost:5433/hotel_management'

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'your_secret_key'
app.config['JWT_SECRET_KEY'] = 'your_jwt_secret_key'

# Initialize Extensions
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)

# User Model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(10), default='user')  # 'user' or 'admin'

# Booking Model
class Booking(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    check_in = db.Column(db.Date, nullable=False)
    check_out = db.Column(db.Date, nullable=False)
    adults = db.Column(db.Integer, nullable=False)
    children = db.Column(db.Integer, nullable=False)
    rooms = db.Column(db.JSON, nullable=False)  # Ensure rooms is not nullable
    promo_code = db.Column(db.String(50), nullable=True)
    total_price = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), default='pending')  # 'pending', 'approved', 'rejected'
    created_at = db.Column(db.DateTime, default=lambda: datetime.now())

class Room(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    category = db.Column(db.String(50), nullable=False)  # e.g., Deluxe, Standard
    type = db.Column(db.String(50), nullable=False)  # e.g., Single, Double
    total = db.Column(db.Integer, nullable=False)  # Total available rooms
    price = db.Column(db.Float, nullable=False)
    amenities = db.Column(db.JSON, nullable=False) 
    def to_dict(self):
        return {
            "id": self.id,
            "category": self.category,
            "type": self.type,
            "total": self.total,
            "price": self.price,
            "amenities": self.amenities,
        }

class BookingRoom(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    booking_id = db.Column(db.Integer, db.ForeignKey('booking.id'), nullable=False)
    room_id = db.Column(db.Integer, db.ForeignKey('room.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Float, nullable=False)

def create_admin():
    admin_email = "admin@booking.com"
    admin_username = "admin"
    admin_password = "admin123"  # Change this in production!
    
    existing_admin = User.query.filter_by(role='admin').first()
    if not existing_admin:
        hashed_password = bcrypt.generate_password_hash(admin_password).decode('utf-8')
        admin_user = User(username=admin_username, email=admin_email, password=hashed_password, role="admin")
        db.session.add(admin_user)
        db.session.commit()
        print("Admin user created successfully!")

# Create database tables
with app.app_context():
    db.create_all()
    create_admin()

# Register User
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"error": "Email already exists"}), 400
    
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    new_user = User(username=data['username'], email=data['email'], password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User registered successfully"}), 201

# Login User
@app.route('/login', methods=['POST'])
@cross_origin(origins="http://localhost:5173")
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    if user and bcrypt.check_password_hash(user.password, data['password']):
        # Convert user.id to string to comply with JWT standards
        access_token = create_access_token(
            identity=str(user.id),  # Convert to string
            additional_claims={"role": user.role},
            expires_delta=timedelta(hours=1)
        )
        return jsonify({"token": access_token}), 200

    return jsonify({"error": "Invalid credentials"}), 401


# Get Dashboard Metrics
@app.route('/dashboard', methods=['GET'])
@jwt_required()
def dashboard():
    user = get_jwt_identity()
    user = get_jwt_identity()
    if user.get('role') != 'admin':  # Use .get() to safely access the role
    
        total_users = User.query.count()
        total_bookings = Booking.query.count()
        total_revenue = db.session.query(db.func.sum(Booking.total_price)).scalar() or 0
        active_users = User.query.count()  # Placeholder, refine based on activity
    
    return jsonify({
        "totalUsers": total_users,
        "totalBookings": total_bookings,
        "totalRevenue": total_revenue,
        "activeUsers": active_users
    }), 200

@app.route('/rooms', methods=['POST'])
@jwt_required()
def add_room():

    user_role = get_jwt()["role"]  # Get role from claims
    
    if user_role != 'admin':
        return jsonify({"error": "Unauthorized"}), 403

    data = request.get_json()
    print("Received data:", data)  # Debugging line

    # Validate input
    if not isinstance(data.get('category'), str) or len(data['category']) == 0:
        return jsonify({"error": "Category must be a non-empty string"}), 400
    if not isinstance(data.get('type'), str) or len(data['type']) == 0:
        return jsonify({"error": "Type must be a non-empty string"}), 400
    if not isinstance(data.get('total'), int) or data['total'] <= 0:
        return jsonify({"error": "Total must be a positive integer"}), 400
    if not isinstance(data.get('price', 100), (int, float)) or data['price'] <= 0:
        return jsonify({"error": "Price must be a positive number"}), 400
    if not isinstance(data.get('amenities', []), list):
        return jsonify({"error": "Amenities must be a list"}), 400

    # Create new room
    new_room = Room(
        category=data['category'],
        type=data['type'],
        total=data['total'],
        price=data.get('price'),
        amenities=data.get('amenities')
    )

    try:
        db.session.add(new_room)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to add room", "details": str(e)}), 500

    return jsonify({
        "message": "Room added successfully",
        "room": new_room.to_dict()
    }), 201

rooms = [
    # Standard Rooms
    {"category": "Standard", "type": "Single", "total": 15, "price": 100.0, "amenities": ["WiFi"]},
    {"category": "Standard", "type": "Double", "total": 12, "price": 130.0, "amenities": ["WiFi", "TV"]},
    {"category": "Standard", "type": "Triple", "total": 8, "price": 160.0, "amenities": ["WiFi", "TV", "Air Conditioning"]},
    {"category": "Standard", "type": "Family", "total": 5, "price": 200.0, "amenities": ["WiFi", "TV", "Air Conditioning", "Mini Fridge"]},

    # Deluxe Rooms
    {"category": "Deluxe", "type": "Single", "total": 10, "price": 150.0, "amenities": ["WiFi", "TV"]},
    {"category": "Deluxe", "type": "Double", "total": 8, "price": 200.0, "amenities": ["WiFi", "TV", "Mini Bar"]},
    {"category": "Deluxe", "type": "Triple", "total": 6, "price": 250.0, "amenities": ["WiFi", "TV", "Mini Bar", "Balcony"]},
    {"category": "Deluxe", "type": "Family", "total": 4, "price": 300.0, "amenities": ["WiFi", "TV", "Mini Bar", "Balcony", "Coffee Maker"]},

    # Suite Rooms
    {"category": "Suite", "type": "Single", "total": 5, "price": 300.0, "amenities": ["WiFi", "TV", "Mini Bar", "Balcony"]},
    {"category": "Suite", "type": "Double", "total": 4, "price": 450.0, "amenities": ["WiFi", "TV", "Mini Bar", "Balcony", "Kitchen"]},
    {"category": "Suite", "type": "Executive", "total": 3, "price": 600.0, "amenities": ["WiFi", "TV", "Mini Bar", "Balcony", "Kitchen", "Office Desk"]},
    {"category": "Suite", "type": "Penthouse", "total": 2, "price": 750.0, "amenities": ["WiFi", "TV", "Mini Bar", "Balcony", "Kitchen", "Office Desk", "Jacuzzi"]},

    # Presidential Suites
    {"category": "Presidential", "type": "Single", "total": 2, "price": 800.0, "amenities": ["WiFi", "TV", "Mini Bar", "Balcony", "Jacuzzi", "Private Pool"]},
    {"category": "Presidential", "type": "Double", "total": 2, "price": 1200.0, "amenities": ["WiFi", "TV", "Mini Bar", "Balcony", "Jacuzzi", "Private Pool", "Personal Butler"]},
    {"category": "Presidential", "type": "Royal", "total": 1, "price": 1800.0, "amenities": ["WiFi", "TV", "Mini Bar", "Balcony", "Jacuzzi", "Private Pool", "Personal Butler", "Private Chef"]},
    {"category": "Presidential", "type": "Penthouse", "total": 1, "price": 2500.0, "amenities": ["WiFi", "TV", "Mini Bar", "Balcony", "Jacuzzi", "Private Pool", "Personal Butler", "Private Chef", "Home Theater"]},
]


@app.route('/rooms', methods=['GET'])
def get_rooms():
    rooms = Room.query.all()
    rooms_list = [room.to_dict() for room in rooms]  # Convert Room objects to dictionaries
    return jsonify(rooms_list), 200


with app.app_context():
    for room in rooms:
        existing_room = Room.query.filter_by(category=room["category"], type=room["type"]).first()
        if not existing_room:
            new_room = Room(**room)
            db.session.add(new_room)
    db.session.commit()
    print("Rooms added successfully!")


#Add booking
# Fix booking creation to include user ID
@app.route('/booking', methods=['POST'])
@jwt_required()
def create_booking():
    user_id = int(get_jwt_identity())
    # Extract user_id correctly depending on token structure

    
    data = request.json

    check_in_date = datetime.strptime(data['check_in'], "%Y-%m-%d").date()
    check_out_date = datetime.strptime(data['check_out'], "%Y-%m-%d").date()
    if check_in_date >= check_out_date:
        return jsonify({"error": "Check-out date must be after check-in date"}), 400

    if not data.get('rooms'):
        return jsonify({"error": "No rooms selected"}), 400

    total_price = sum(room["price"] * room["quantity"] for room in data["rooms"])

    new_booking = Booking(
        user_id=user_id,
        check_in=check_in_date,
        check_out=check_out_date,
        adults=data['adults'],
        children=data['children'],
        rooms=data['rooms'],
        promo_code=data.get('promoCode'),
        total_price=total_price
    )

    db.session.add(new_booking)
    db.session.commit()

    for room in data["rooms"]:
        db.session.add(BookingRoom(booking_id=new_booking.id, room_id=room["id"], quantity=room["quantity"], price=room["price"]))

    db.session.commit()
    return jsonify({"message": "Booking successful!", "booking_id": new_booking.id}), 201

@app.route('/bookings', methods=['GET'])
def get_bookings():
    """Retrieve all bookings"""

    bookings = Booking.query.all()  # Admin can see all bookings
    bookings_data = []
    
    for booking in bookings:
        # Get user info
        user = User.query.get(booking.user_id)
        guest_name = user.username if user else "Unknown"
        
        bookings_data.append({
            "id": booking.id,
            "user_id": booking.user_id,
            "guest": guest_name,
            "check_in": booking.check_in.strftime("%Y-%m-%d"),
            "check_out": booking.check_out.strftime("%Y-%m-%d"),
            "status": booking.status,
            "total_price": booking.total_price,
            "rooms": [
                {
                    "room_id": room["id"],
                    "room_number": room.get("number", "N/A"),
                    "room_type": room.get("type", "N/A"),
                    "price_per_night": room.get("price", 0.0)
                }
                for room in booking.rooms
            ]
        })

    return jsonify(bookings_data), 200



# Approve/Reject Booking
@app.route('/bookings/<int:booking_id>/status', methods=['PUT'])
@jwt_required()
def update_booking_status(booking_id):
    # Fix how we get the role from JWT claims
    claims = get_jwt()
    user_role = claims.get('role')
    
    if user_role != 'admin':
        return jsonify({"error": "Unauthorized"}), 403
    
    data = request.get_json()
    booking = Booking.query.get(booking_id)
    if not booking:
        return jsonify({"error": "Booking not found"}), 404
    
    booking.status = data['status']
    db.session.commit()
    return jsonify({"message": "Booking updated successfully"}), 200

# Get all guests
@app.route('/guests', methods=['GET'])
def get_guests():
    """Retrieve all guests with booking summary data"""
    
    # Get all users who have bookings (excluding admin users)
    users_with_bookings = db.session.query(User).join(
        Booking, User.id == Booking.user_id
    ).filter(User.role != 'admin').distinct().all()
    
    guest_data = []
    
    for user in users_with_bookings:
        # Get all bookings for this user
        user_bookings = Booking.query.filter_by(user_id=user.id).all()
        
        # Calculate booking count
        booking_count = len(user_bookings)
        
        # Get most recent stay date
        last_stay = max([booking.check_out for booking in user_bookings]) if user_bookings else None
        
        # Format the date
        last_stay_formatted = last_stay.strftime("%B %Y") if last_stay else "N/A"
        
        # Get all booking IDs
        booking_ids = [booking.id for booking in user_bookings]
        
        guest_data.append({
            "id": user.id,
            "name": user.username,
            "email": user.email,
            "bookingCount": booking_count,
            "lastStay": last_stay_formatted,
            "bookingIds": booking_ids
        })
    
    return jsonify(guest_data), 200

# Get guest bookings by guest ID
@app.route('/guests/<int:guest_id>/bookings', methods=['GET'])
def get_guest_bookings(guest_id):
    """Retrieve all bookings for a specific guest"""
    
    # Check if user exists
    user = db.session.get(User, guest_id)
    if not user:
        return jsonify({"error": "Guest not found"}), 404
    
    # Get all bookings for this user
    user_bookings = Booking.query.filter_by(user_id=guest_id).all()
    
    bookings_data = []
    for booking in user_bookings:
        bookings_data.append({
            "id": booking.id,
            "check_in": booking.check_in.strftime("%Y-%m-%d"),
            "check_out": booking.check_out.strftime("%Y-%m-%d"),
            "status": booking.status,
            "total_price": booking.total_price,
            "rooms": booking.rooms
        })
    
    return jsonify(bookings_data), 200

# Add this route to app.py

@app.route('/analytics', methods=['GET'])
def get_analytics():
    """Retrieve analytics data for the dashboard"""
    
    # Calculate room occupancy
    room_occupancy = []
    room_categories = db.session.query(Room.category).distinct().all()
    
    for category in room_categories:
        category_name = category[0]
        
        # Get total rooms for this category
        total_rooms = db.session.query(db.func.sum(Room.total)).filter(Room.category == category_name).scalar() or 0
        
        # Get active bookings for this category
        active_bookings = 0
        current_date = datetime.now().date()
        
        # Count rooms in active bookings (where current date is between check-in and check-out)
        bookings = Booking.query.filter(
            Booking.check_in <= current_date,
            Booking.check_out >= current_date
        ).all()
        
        for booking in bookings:
            for room in booking.rooms:
                if room.get('category') == category_name:
                    active_bookings += room.get('quantity', 0)
        
        # Calculate occupancy percentage
        occupancy_percentage = (active_bookings / total_rooms * 100) if total_rooms > 0 else 0
        
        room_occupancy.append({
            "name": category_name,
            "value": round(occupancy_percentage, 1)
        })
    
    # Calculate revenue by room type for the last 6 months
    revenue_by_room_type = []
    
    # Get last 6 months
    end_date = datetime.now().date()
    start_date = end_date - timedelta(days=180)
    
    # Generate month labels
    months = []
    current_date = start_date
    while current_date <= end_date:
        months.append(current_date.strftime("%b %Y"))
        # Move to next month
        if current_date.month == 12:
            current_date = current_date.replace(year=current_date.year + 1, month=1)
        else:
            current_date = current_date.replace(month=current_date.month + 1)
    
    # Get monthly revenue by category
    for month in months:
        month_obj = datetime.strptime(month, "%b %Y")
        month_start = month_obj.replace(day=1)
        # Calculate month end
        if month_obj.month == 12:
            month_end = month_obj.replace(year=month_obj.year + 1, month=1, day=1) - timedelta(days=1)
        else:
            month_end = month_obj.replace(month=month_obj.month + 1, day=1) - timedelta(days=1)
        
        # Create monthly revenue object
        monthly_revenue = {
            "name": month,
            "Standard": 0,
            "Deluxe": 0,
            "Suite": 0,
            "Presidential": 0
        }
        
        # Get bookings for this month
        bookings = Booking.query.filter(
            Booking.check_in <= month_end,
            Booking.check_out >= month_start
        ).all()
        
        for booking in bookings:
            # Calculate the number of nights in this month
            stay_start = max(booking.check_in, month_start.date())
            stay_end = min(booking.check_out, month_end.date())
            nights_in_month = (stay_end - stay_start).days + 1
            
            # Distribute revenue across room categories
            for room in booking.rooms:
                category = room.get('category', 'Standard')  # Default to Standard if not specified
                if category in monthly_revenue:
                    # Calculate prorated revenue for this month
                    room_price = room.get('price', 0)
                    room_quantity = room.get('quantity', 0)
                    daily_revenue = room_price * room_quantity
                    category_revenue = daily_revenue * nights_in_month
                    monthly_revenue[category] += category_revenue
        
        # Round revenue values
        for category in ["Standard", "Deluxe", "Suite", "Presidential"]:
            monthly_revenue[category] = round(monthly_revenue[category], 2)
            
        revenue_by_room_type.append(monthly_revenue)
    
    return jsonify({
        "roomOccupancy": room_occupancy,
        "revenueByRoomType": revenue_by_room_type
    }), 200

if __name__ == '__main__':
    app.run(debug=True)
