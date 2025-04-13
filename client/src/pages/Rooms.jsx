import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import coffee from "../assets/coffee-table.jpg";
import Navbar from "../components/Navbar";
function HotelRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleBookNow = (room) => {
    navigate("/booking", { state: { room } });
  };

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/rooms", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setRooms(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  if (loading) return <p>Loading rooms...</p>;
  if (error) return <p>Error fetching rooms: {error}</p>;

  return (
      <>
          <Navbar />
      <section className="products">
        {rooms.map((room) => (
          <div className="product" key={room.id}>
            <img src={coffee} alt="" />
            <h4>
              {room.category} - {room.type}
            </h4>
            <p>{room.amenities.join(", ")}</p>
            <span className="price">$ {room.price}</span>
            <button className="add-cart" onClick={() => handleBookNow(room)}>
              Book now
            </button>
          </div>
        ))}
      </section>
      <footer />
    </>
  );
}

export default HotelRooms;
