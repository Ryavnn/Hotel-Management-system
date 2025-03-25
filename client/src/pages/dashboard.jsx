import { useState } from "react";
import "../dashboard.css"
// Sample initial data
const initialRooms = [
  { id: 1, type: "Single", status: "available", currentGuest: null },
  { id: 2, type: "Double", status: "occupied", currentGuest: "John Doe" },
  { id: 3, type: "Suite", status: "available", currentGuest: null },
  { id: 4, type: "Single", status: "cleaning", currentGuest: null },
];

const initialBookings = [
  {
    id: 1,
    guestName: "Sarah Smith",
    roomType: "Suite",
    checkIn: "2024-03-25",
    checkOut: "2024-03-28",
  },
  {
    id: 2,
    guestName: "Mike Johnson",
    roomType: "Double",
    checkIn: "2024-03-26",
    checkOut: "2024-03-30",
  },
];

const HotelManagementDashboard = () => {
  const [rooms, setRooms] = useState(initialRooms);
  const [bookings, setBookings] = useState(initialBookings);
  const [activeTab, setActiveTab] = useState("dashboard");

  // Styles object
  const styles = {
    hotelDashboard: {
      display: "flex",
      height: "100vh",
      fontFamily: "Arial, sans-serif",
    },
    sidebar: {
      width: "200px",
      backgroundColor: "#2c3e50",
      display: "flex",
      flexDirection: "column",
      padding: "20px 0",
    },
    sidebarButton: {
      backgroundColor: "transparent",
      color: "white",
      border: "none",
      padding: "15px",
      textAlign: "left",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
    },
    sidebarButtonHover: {
      backgroundColor: "#34495e",
    },
    activeButton: {
      backgroundColor: "#3498db",
    },
    mainContent: {
      flexGrow: 1,
      padding: "20px",
      overflowY: "auto",
      backgroundColor: "#ecf0f1",
    },
    roomStats: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: "15px",
      marginBottom: "20px",
    },
    statCard: {
      backgroundColor: "white",
      borderRadius: "5px",
      padding: "15px",
      textAlign: "center",
      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    },
    roomStatusGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
      gap: "15px",
    },
    roomCard: {
      backgroundColor: "white",
      borderRadius: "5px",
      padding: "15px",
      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
      position: "relative",
    },
    checkoutBtn: {
      backgroundColor: "#e74c3c",
      color: "white",
      border: "none",
      padding: "8px 15px",
      borderRadius: "4px",
      cursor: "pointer",
    },
    bookingCard: {
      backgroundColor: "white",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "15px",
      marginBottom: "15px",
      borderRadius: "5px",
      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    },
    checkInBtn: {
      backgroundColor: "#2ecc71",
      color: "white",
      border: "none",
      padding: "8px 15px",
      borderRadius: "4px",
      cursor: "pointer",
    },
  };

  // Room Availability Calculation
  const roomStats = {
    total: rooms.length,
    available: rooms.filter((room) => room.status === "available").length,
    occupied: rooms.filter((room) => room.status === "occupied").length,
    cleaning: rooms.filter((room) => room.status === "cleaning").length,
  };

  // Check-in Function
  const handleCheckIn = (booking) => {
    const updatedRooms = rooms.map((room) =>
      room.type === booking.roomType && room.status === "available"
        ? { ...room, status: "occupied", currentGuest: booking.guestName }
        : room
    );
    setRooms(updatedRooms);
    setBookings(bookings.filter((b) => b.id !== booking.id));
  };

  // Check-out Function
  const handleCheckOut = (room) => {
    const updatedRooms = rooms.map((r) =>
      r.id === room.id ? { ...r, status: "cleaning", currentGuest: null } : r
    );
    setRooms(updatedRooms);
  };

  // Render Room Status Component
  const RoomStatusCard = ({ room }) => {
    const getStatusStyle = () => {
      switch (room.status) {
        case "available":
          return { borderLeft: "4px solid #2ecc71" };
        case "occupied":
          return { borderLeft: "4px solid #e74c3c" };
        case "cleaning":
          return { borderLeft: "4px solid #f39c12" };
        default:
          return {};
      }
    };

    return (
      <div style={{ ...styles.roomCard, ...getStatusStyle() }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <h3>
            Room {room.id} - {room.type}
          </h3>
          <p style={{ textTransform: "capitalize", fontWeight: "bold" }}>
            {room.status}
          </p>
        </div>
        {room.currentGuest && (
          <p style={{ fontSize: "0.8em", marginBottom: "10px" }}>
            Guest: {room.currentGuest}
          </p>
        )}
        {room.status === "occupied" && (
          <button
            onClick={() => handleCheckOut(room)}
            style={styles.checkoutBtn}
          >
            Check Out
          </button>
        )}
      </div>
    );
  };

  return (
    <div style={styles.hotelDashboard}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <button
          style={{
            ...styles.sidebarButton,
            ...(activeTab === "dashboard" ? styles.activeButton : {}),
          }}
          onClick={() => setActiveTab("dashboard")}
        >
          Dashboard
        </button>
        <button
          style={{
            ...styles.sidebarButton,
            ...(activeTab === "bookings" ? styles.activeButton : {}),
          }}
          onClick={() => setActiveTab("bookings")}
        >
          Bookings
        </button>
        <button
          style={{
            ...styles.sidebarButton,
            ...(activeTab === "analytics" ? styles.activeButton : {}),
          }}
          onClick={() => setActiveTab("analytics")}
        >
          Analytics
        </button>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {activeTab === "dashboard" && (
          <div>
            <h1 style={{ color: "#2c3e50", marginBottom: "20px" }}>
              Hotel Dashboard
            </h1>

            {/* Room Statistics */}
            <div style={styles.roomStats}>
              <div style={styles.statCard}>
                <h3 style={{ margin: 0, color: "#7f8c8d" }}>Total Rooms</h3>
                <p
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    color: "#2c3e50",
                  }}
                >
                  {roomStats.total}
                </p>
              </div>
              <div style={styles.statCard}>
                <h3 style={{ margin: 0, color: "#7f8c8d" }}>Available Rooms</h3>
                <p
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    color: "#2c3e50",
                  }}
                >
                  {roomStats.available}
                </p>
              </div>
              <div style={styles.statCard}>
                <h3 style={{ margin: 0, color: "#7f8c8d" }}>Occupied Rooms</h3>
                <p
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    color: "#2c3e50",
                  }}
                >
                  {roomStats.occupied}
                </p>
              </div>
              <div style={styles.statCard}>
                <h3 style={{ margin: 0, color: "#7f8c8d" }}>
                  Rooms in Cleaning
                </h3>
                <p
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    color: "#2c3e50",
                  }}
                >
                  {roomStats.cleaning}
                </p>
              </div>
            </div>

            {/* Room Status */}
            <div>
              <h2 style={{ color: "#2c3e50", marginBottom: "15px" }}>
                Room Status
              </h2>
              <div style={styles.roomStatusGrid}>
                {rooms.map((room) => (
                  <RoomStatusCard key={room.id} room={room} />
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "bookings" && (
          <div>
            <h1 style={{ color: "#2c3e50", marginBottom: "20px" }}>
              Upcoming Bookings
            </h1>
            {bookings.map((booking) => (
              <div key={booking.id} style={styles.bookingCard}>
                <div>
                  <h3 style={{ margin: 0 }}>{booking.guestName}</h3>
                  <p style={{ margin: "5px 0" }}>{booking.roomType} Room</p>
                  <p style={{ margin: 0, fontSize: "0.8em" }}>
                    {booking.checkIn} to {booking.checkOut}
                  </p>
                </div>
                <button
                  onClick={() => handleCheckIn(booking)}
                  style={styles.checkInBtn}
                >
                  Check In
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === "analytics" && (
          <div>
            <h1 style={{ color: "#2c3e50", marginBottom: "20px" }}>
              Hotel Analytics
            </h1>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
              }}
            >
              <div style={{ ...styles.statCard, padding: "20px" }}>
                <h3 style={{ margin: 0, marginBottom: "10px" }}>
                  Occupancy Rate
                </h3>
                <div
                  style={{
                    height: "20px",
                    backgroundColor: "#ecf0f1",
                    borderRadius: "10px",
                    overflow: "hidden",
                    marginBottom: "10px",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      backgroundColor: "#3498db",
                      width: `${(roomStats.occupied / roomStats.total) * 100}%`,
                    }}
                  ></div>
                </div>
                <p>
                  {((roomStats.occupied / roomStats.total) * 100).toFixed(1)}%
                  Occupied
                </p>
              </div>
              <div style={{ ...styles.statCard, padding: "20px" }}>
                <h3 style={{ margin: 0, marginBottom: "10px" }}>
                  Room Type Distribution
                </h3>
                <div>
                  {["Single", "Double", "Suite"].map((type) => (
                    <div
                      key={type}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "10px",
                      }}
                    >
                      <div
                        style={{
                          width: "10px",
                          height: "10px",
                          borderRadius: "50%",
                          marginRight: "10px",
                          backgroundColor: "#3498db",
                        }}
                      ></div>
                      <span>{type} Rooms</span>
                      <span style={{ marginLeft: "auto", fontWeight: "bold" }}>
                        {rooms.filter((room) => room.type === type).length}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelManagementDashboard;
