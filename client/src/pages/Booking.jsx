import { useState } from "react";


const BookingPage = () => {
  const [rooms, setRooms] = useState([
    {
      id: 1,
      name: "Standard Room",
      price: 129.99,
      quantity: 0,
      image: "/api/placeholder/200/150",
    },
    {
      id: 2,
      name: "Deluxe Room",
      price: 199.99,
      quantity: 0,
      image: "/api/placeholder/200/150",
    },
    {
      id: 3,
      name: "Suite",
      price: 299.99,
      quantity: 0,
      image: "/api/placeholder/200/150",
    },
  ]);

  const [bookingDetails, setBookingDetails] = useState({
    checkIn: "",
    checkOut: "",
    adults: 1,
    children: 0,
    promoCode: "",
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const bookingData = {
      ...bookingDetails,
      rooms: rooms.filter((room) => room.quantity > 0),
    };
    console.log("Booking Submitted:", bookingData);
    alert("Booking processed! (Check console for details)");
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
    </div>
  );
};

export default BookingPage;
