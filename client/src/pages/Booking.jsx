import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import BookingSuccessModal from "../components/BookingModal";

const BookingPage = () => {
  const [rooms, setRooms] = useState([]);
  const [showModal, setShowModal] = useState(false)
  const [bookingDetails, setBookingDetails] = useState({
    checkIn: "",
    checkOut: "",
    adults: 1,
    children: 0,
    promoCode: "",
  });
  const location = useLocation();
  const selectedRoom = location.state?.room || null;
  const navigate = useNavigate()

  useEffect(() => {
    if (selectedRoom) {
      setRooms([{ ...selectedRoom, quantity: 1 }]); // Set default quantity to 1
    }
  }, [selectedRoom]);

  const updateRoomQuantity = (id, change) => {
    setRooms((prevRooms) =>
      prevRooms.map((room) =>
        room.id === id
          ? { ...room, quantity: Math.max(0, room.quantity + change) }
          : room
      )
    );
  };

  const calculateSubtotal = () => {
    return rooms.reduce((total, room) => total + room.price * room.quantity, 0);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Function to refresh the token

const handleSubmit = async (e) => {
  e.preventDefault();

  const checkInDate = new Date(bookingDetails.checkIn);
  const checkOutDate = new Date(bookingDetails.checkOut);
  const today = new Date();

  if (checkInDate < today) {
    alert("Check-in date must be in the future.");
    return;
  }

  if (checkOutDate <= checkInDate) {
    alert("Check-out date must be after the check-in date.");
    return;
  }

  // Only include rooms with quantity > 0
  const selectedRooms = rooms.filter((room) => room.quantity > 0);

  if (selectedRooms.length === 0) {
    alert("Please select at least one room.");
    return;
  }

  // Create the booking data exactly as the backend expects it
  const bookingData = {
    check_in: bookingDetails.checkIn,
    check_out: bookingDetails.checkOut,
    adults: parseInt(bookingDetails.adults),
    children: parseInt(bookingDetails.children),
    promoCode: bookingDetails.promoCode || null,
    rooms: selectedRooms.map((room) => ({
      id: room.id,
      quantity: room.quantity,
      price: room.price,
      name: room.name || "",
      category: room.category || "",
      type: room.type || "",
    })),
  };

  console.log("Sending booking data:", bookingData);

  // Get the token from localStorage
  let authToken = localStorage.getItem("token");

  if (!authToken) {
    alert("You must be logged in to make a booking.");
    navigate("/login");
    return;
  }

  try {
    // Add some debugging for the token
    console.log("Using auth token:", authToken);

    const response = await fetch("http://localhost:5000/booking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(bookingData),
    });

    console.log("Response status:", response.status);

    // Handle different error statuses
    if (response.status === 401) {
      alert("Your session has expired. Please log in again.");
      navigate("/login");
      return;
    }

    if (response.status === 422) {
      const errorData = await response.json();
      console.error("Validation error:", errorData);
      alert(
        `Validation error: ${
          errorData.error || "Please check your booking details"
        }`
      );
      return;
    }

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Server error response:", errorData);
      throw new Error(
        errorData.error || "An error occurred while processing your booking"
      );
    }

    const data = await response.json();
    setShowModal(true);
    console.log("Booking submitted:", data);
  } catch (error) {
    console.error("Error submitting booking:", error);
    alert(`Failed to submit booking: ${error.message}`);
  }
};

  return (
    <div className="booking-page">
      <div className="booking-header">
        <h1>Book Your Stay</h1>
        <p>Find the perfect room for your dream vacation</p>
      </div>

      <div className="booking-container">
        <form className="booking-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Check-In Date</label>
              <input
                type="date"
                name="checkIn"
                value={bookingDetails.checkIn}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Check-Out Date</label>
              <input
                type="date"
                name="checkOut"
                value={bookingDetails.checkOut}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Adults</label>
              <select
                name="adults"
                value={bookingDetails.adults}
                onChange={handleInputChange}
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Children</label>
              <select
                name="children"
                value={bookingDetails.children}
                onChange={handleInputChange}
              >
                {[0, 1, 2, 3, 4].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="room-selection">
            <h3>Select Rooms</h3>
            {rooms.map((room) => (
              <div key={room.id} className="room-type">
                <div className="room-details">
                  <img src={room.image} alt={room.name} />
                  <div>
                    <h4>{room.name}</h4>
                    <p>${room.price.toFixed(2)} per night</p>
                  </div>
                </div>
                <div className="room-quantity">
                  <button
                    type="button"
                    className="quantity-btn"
                    onClick={() => updateRoomQuantity(room.id, -1)}
                  >
                    -
                  </button>
                  <span>{room.quantity}</span>
                  <button
                    type="button"
                    className="quantity-btn"
                    onClick={() => updateRoomQuantity(room.id, 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="promo-code">
            <input
              type="text"
              placeholder="Promo Code"
              name="promoCode"
              value={bookingDetails.promoCode}
              onChange={handleInputChange}
            />
            <button type="button">Apply</button>
          </div>

          <button type="submit" className="submit-button">
            Book Now
          </button>
        </form>

        <div className="booking-sidebar">
          <h3>Booking Summary</h3>
          {rooms
            .filter((room) => room.quantity > 0)
            .map((room) => (
              <div key={room.id} className="booking-sidebar-item">
                <span>
                  {room.name} x {room.quantity}
                </span>
                <span>${(room.price * room.quantity).toFixed(2)}</span>
              </div>
            ))}
          <hr />
          <div className="booking-sidebar-item">
            <span>Subtotal</span>
            <span className="total-price">
              ${calculateSubtotal().toFixed(2)}
            </span>
          </div>
        </div>
      </div>
      {showModal && (
        <BookingSuccessModal
          onClose={() => {
            setShowModal(false);
            navigate("/");
          }}
        />
      )}
    </div>
  );
};

export default BookingPage;