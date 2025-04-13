import { useState , useEffect} from "react";
import "../dashboard.css";

const ROOM_CONFIGURATIONS = {
  Standard: { types: ["Single", "Double"] },
  Deluxe: { types: ["King", "Queen"] },
  Suite: { types: ["Junior", "Executive"] },
  Presidential: { types: ["Penthouse"] },
};

const HotelAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("bookings");
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [newRoom, setNewRoom] = useState({
    category: "",
    type: "",
    total: 0,
  });
  const [analyticsData, setAnalyticsData] = useState({
    roomOccupancy: [],
    revenueByRoomType: [],
  });
  const [guests, setGuests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredGuests, setFilteredGuests] = useState([]);
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [guestBookings, setGuestBookings] = useState([]);


  useEffect(() => {
    const fetchGuests = async () => {
      try {
        const response = await fetch("http://localhost:5000/guests");
        if (!response.ok) throw new Error("Failed to load guests");
        const data = await response.json();
        setGuests(data);
        setFilteredGuests(data);
      } catch (error) {
        console.error("Error fetching guests:", error);
      }
    };

    fetchGuests();
  }, []);

  // Add this function to handle search functionality
  const handleGuestSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (term.trim() === "") {
      setFilteredGuests(guests);
    } else {
      const filtered = guests.filter(
        (guest) =>
          guest.name.toLowerCase().includes(term) ||
          guest.email.toLowerCase().includes(term) ||
          guest.bookingIds.some((id) => id.toString().includes(term))
      );
      setFilteredGuests(filtered);
    }
  };

  // Add this function to handle viewing guest details
  const handleViewGuestDetails = async (guestId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/guests/${guestId}/bookings`
      );
      if (!response.ok) throw new Error("Failed to load guest bookings");
      const data = await response.json();

      const guest = guests.find((g) => g.id === guestId);
      setSelectedGuest(guest);
      setGuestBookings(data);
    } catch (error) {
      console.error("Error fetching guest bookings:", error);
      alert("Error loading guest details");
    }
  };



const handleCheckIn = async (bookingId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to perform this action");
      return;
    }

    const response = await fetch(
      `http://localhost:5000/bookings/${bookingId}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "Checked In" }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to update booking status");
    }

    // Update local state if API call succeeds
    setBookings((prevBookings) =>
      prevBookings.map((booking) =>
        booking.id === bookingId
          ? { ...booking, status: "Checked In" }
          : booking
      )
    );
  } catch (error) {
    console.error("Error updating booking status:", error);
    alert("Error updating booking status: " + error.message);
  }
};

const handleCheckOut = async (bookingId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to perform this action");
      return;
    }

    const response = await fetch(
      `http://localhost:5000/bookings/${bookingId}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "Checked Out" }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to update booking status");
    }

    // Update local state if API call succeeds
    setBookings((prevBookings) =>
      prevBookings.map((booking) =>
        booking.id === bookingId
          ? { ...booking, status: "Checked Out" }
          : booking
      )
    );
  } catch (error) {
    console.error("Error updating booking status:", error);
    alert("Error updating booking status: " + error.message);
  }
};

  const handleAddRoom = async () => {
    if (!newRoom.category || !newRoom.type || newRoom.total <= 0) {
      alert("Please fill all fields correctly!");
      return;
    }
    const roomData = {
      category: newRoom.category,
      type: newRoom.type,
      total: newRoom.total,
      price: newRoom.price,
      amenities: newRoom.amenities,
    };

    // Add fields for price and amenities



    const token = localStorage.getItem("token"); // Ensure token is stored after login

    if (!token) {
      alert("Unauthorized! Please log in.");
      window.location.href = "/login";
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(roomData),
      });
      if (!response.ok) {
        const errorDetails = await response.json();
        alert(errorDetails.error || "Failed to add room");
        return;
      }

      const savedRoom = await response.json();
      setRooms((prevRooms) => [...prevRooms, savedRoom]);

      setNewRoom({ category: "", type: "", total: 0, price: 100 });
      console.log("Payload sent to /rooms:", roomData);
      alert("Room added successfully!");
    } catch (error) {
      console.error("Error adding room :", error);
      alert("Error adding room please try again");
    }
  };


useEffect(() => {
  const fetchRooms = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/rooms");
      if (!response.ok) throw new Error("Failed to load rooms");
      const data = await response.json();
      setRooms(data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  fetchRooms();
}, []);
  
useEffect(() => {
  const fetchBookings = async () => {
    try {
      const response = await fetch("http://localhost:5000/bookings");
      if (!response.ok) throw new Error("Failed to load bookings");
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  fetchBookings();
}, []);
  
  
useEffect(() => {
  const fetchAnalyticsData = async () => {
    try {
      const response = await fetch("http://localhost:5000/analytics");
      if (!response.ok) throw new Error("Failed to load analytics data");
      const data = await response.json();
      setAnalyticsData(data);
    } catch (error) {
      console.error("Error fetching analytics data:", error);
      // Set default data in case of error
      setAnalyticsData({
        roomOccupancy: [
          { name: "Standard", value: 0 },
          { name: "Deluxe", value: 0 },
          { name: "Suite", value: 0 },
          { name: "Presidential", value: 0 },
        ],
        revenueByRoomType: [],
      });
    }
  };

  if (activeTab === "analytics") {
    fetchAnalyticsData();
  }
}, [activeTab]);




  const renderBookingsTab = () => (
    <div className="card">
      <div className="card-header">
        <h2>Current Bookings</h2>
      </div>
      <div className="card-content">
        <table>
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Guest</th>
              <th>Room Type</th>

              <th>Check-In</th>
              <th>Check-Out</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.id}</td>
                <td>{booking.guest}</td>
                <td>
                  {booking.rooms && booking.rooms.length > 0
                    ? booking.rooms[0].room_type
                    : "N/A"}
                </td>
                <td>{booking.check_in}</td>
                <td>{booking.check_out}</td>
                <td>{booking.status}</td>
                <td>
                  {booking.status === "Checked Out" ? (
                    <button className="btn btn-gray" disabled>
                      Completed
                    </button>
                  ) : booking.status !== "Checked In" ? (
                    <button
                      onClick={() => handleCheckIn(booking.id)}
                      className="btn btn-green"
                    >
                      Check In
                    </button>
                  ) : (
                    <button
                      onClick={() => handleCheckOut(booking.id)}
                      className="btn btn-red"
                    >
                      Check Out
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderRoomsTab = () => (
    <div className="rooms-management">
      <div className="room-creation-section">
        <h2>Create New Room Type</h2>
        <div className="room-creation-form">
          <select
            value={newRoom.category}
            onChange={(e) => {
              setNewRoom({
                category: e.target.value,
                type: "",
                total: 0,
              });
            }}
          >
            <option value="">Select Room Category</option>
            {Object.keys(ROOM_CONFIGURATIONS).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          {newRoom.category && (
            <select
              value={newRoom.type}
              onChange={(e) =>
                setNewRoom({
                  ...newRoom,
                  type: e.target.value,
                })
              }
            >
              <option value="">Select Room Type</option>
              {ROOM_CONFIGURATIONS[newRoom.category].types.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          )}

          <input
            type="number"
            placeholder="Number of Rooms"
            value={newRoom.total}
            onChange={(e) =>
              setNewRoom({
                ...newRoom,
                total: parseInt(e.target.value),
              })
            }
          />
          <input
            type="number"
            placeholder="Price per Night"
            value={newRoom.price}
            onChange={(e) =>
              setNewRoom({
                ...newRoom,
                price: parseFloat(e.target.value),
              })
            }
          />

          <input
            type="text"
            placeholder="Add Amenities (comma-separated)"
            value={newRoom.amenities}
            onChange={(e) =>
              setNewRoom({
                ...newRoom,
                amenities: e.target.value
                  .split(",")
                  .map((amenity) => amenity.trim()),
              })
            }
          />

          <button onClick={handleAddRoom}>Add Room Type</button>
        </div>
      </div>

      <div className="rooms-list">
        <h2>Current Room Types</h2>
        {rooms.length === 0 ? (
          <p>No room types added yet.</p>
        ) : (
          <div className="rooms-grid">
            {rooms.map((room, index) => (
              <div key={index} className="room-card">
                <div className="room-details">
                  <h4>
                    {room.category} - {room.type}
                  </h4>
                  <p>Total Rooms: {room.total}</p>
                  <p>Price per Night: ${room.price}</p>
                  <div className="amenities">
                    <h5>Amenities:</h5>
                    <ul>
                      {room.amenities ? (
                        room.amenities.map((amenity, index) => (
                          <li key={index}>{amenity}</li>
                        ))
                      ) : (
                        <li>No amenities listed</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

const renderAnalyticsTab = () => (
  <div className="card">
    <div className="card-header">
      <h2>Hotel Analytics</h2>
    </div>
    <div className="card-content analytics">
      <div className="analytics-section">
        <h3>Room Occupancy</h3>
        <div className="chart-placeholder">
          <p>Room Occupancy Breakdown:</p>
          {analyticsData.roomOccupancy.length === 0 ? (
            <p>Loading occupancy data...</p>
          ) : (
            analyticsData.roomOccupancy.map((data, index) => (
              <div key={index} className="occupancy-item">
                <span>{data.name}</span>
                <div className="occupancy-bar">
                  <div
                    className="occupancy-fill"
                    style={{ width: `${data.value}%` }}
                  >
                    {data.value}%
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="analytics-section">
        <h3>Revenue by Room Type</h3>
        <div className="chart-placeholder">
          {analyticsData.revenueByRoomType.length === 0 ? (
            <p>Loading revenue data...</p>
          ) : (
            <table className="revenue-table">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Standard</th>
                  <th>Deluxe</th>
                  <th>Suite</th>
                  <th>Presidential</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.revenueByRoomType.map((data, index) => (
                  <tr key={index}>
                    <td>{data.name}</td>
                    <td>${data.Standard.toLocaleString()}</td>
                    <td>${data.Deluxe.toLocaleString()}</td>
                    <td>${data.Suite.toLocaleString()}</td>
                    <td>${data.Presidential.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  </div>
);
const renderGuestsTab = () => (
  <div className="card">
    <div className="card-header">
      <h2>Guest Management</h2>
    </div>
    <div className="card-content">
      <div className="guest-search">
        <input
          type="text"
          placeholder="Search guests by name, email, or booking ID"
          value={searchTerm}
          onChange={handleGuestSearch}
        />
      </div>

      {selectedGuest ? (
        <div className="guest-details">
          <div className="guest-details-header">
            <h3>Guest Profile: {selectedGuest.name}</h3>
            <button
              className="btn btn-blue"
              onClick={() => setSelectedGuest(null)}
            >
              Back to Guest List
            </button>
          </div>

          <div className="guest-info">
            <p>
              <strong>Name:</strong> {selectedGuest.name}
            </p>
            <p>
              <strong>Email:</strong> {selectedGuest.email}
            </p>
            <p>
              <strong>Phone:</strong> {selectedGuest.phone || "Not provided"}
            </p>
            <p>
              <strong>Total Bookings:</strong> {selectedGuest.bookingCount}
            </p>
            <p>
              <strong>Last Stay:</strong> {selectedGuest.lastStay}
            </p>
          </div>

          <div className="guest-bookings">
            <h4>Booking History</h4>
            {guestBookings.length === 0 ? (
              <p>No booking history available</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                    <th>Room Type</th>
                    <th>Status</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {guestBookings.map((booking) => (
                    <tr key={booking.id}>
                      <td>{booking.id}</td>
                      <td>{booking.check_in}</td>
                      <td>{booking.check_out}</td>
                      <td>
                        {booking.rooms.map((room, idx) => (
                          <span key={idx}>
                            {room.room_type}
                            {idx < booking.rooms.length - 1 ? ", " : ""}
                          </span>
                        ))}
                      </td>
                      <td>{booking.status}</td>
                      <td>${booking.total_price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      ) : (
        <table className="guests-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Contact</th>
              <th>Bookings</th>
              <th>Last Stay</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredGuests.length === 0 ? (
              <tr>
                <td colSpan="5" className="no-data">
                  {searchTerm
                    ? "No guests match your search"
                    : "No guests data available"}
                </td>
              </tr>
            ) : (
              filteredGuests.map((guest) => (
                <tr key={guest.id}>
                  <td>{guest.name}</td>
                  <td>{guest.email}</td>
                  <td>{guest.bookingCount}</td>
                  <td>{guest.lastStay}</td>
                  <td>
                    <button
                      className="btn btn-blue"
                      onClick={() => handleViewGuestDetails(guest.id)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  </div>
);

  return (
    <div className="hotel-admin-dashboard">
      <header>
        <h1>Hotel Management Dashboard</h1>
      </header>

      <nav className="dashboard-tabs">
        <button
          className={activeTab === "bookings" ? "active" : ""}
          onClick={() => setActiveTab("bookings")}
        >
          Bookings
        </button>
        <button
          className={activeTab === "rooms" ? "active" : ""}
          onClick={() => setActiveTab("rooms")}
        >
          Rooms
        </button>
        <button
          className={activeTab === "analytics" ? "active" : ""}
          onClick={() => setActiveTab("analytics")}
        >
          Analytics
        </button>
        <button
          className={activeTab === "guests" ? "active" : ""}
          onClick={() => setActiveTab("guests")}
        >
          Guests
        </button>
      </nav>

      <main>
        {activeTab === "bookings" && renderBookingsTab()}
        {activeTab === "rooms" && renderRoomsTab()}
        {activeTab === "analytics" && renderAnalyticsTab()}
        {activeTab === "guests" && renderGuestsTab()}
      </main>
    </div>
  );
};

export default HotelAdminDashboard;
