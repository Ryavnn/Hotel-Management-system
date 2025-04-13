import { useNavigate } from "react-router";
import coffee from "../assets/coffee-table.jpg"
import { useEffect, useState } from "react";
function Items() {
  const navigate = useNavigate()

  const handleBookNow = (room) => {
    navigate("/booking", { state: { room } });
  }

  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/rooms") // Ensure this matches your Flask backend URL
      .then((response) => response.json())
      .then((data) => setRooms(data))
      .catch((error) => console.error("Error fetching rooms:", error));
  }, []);

  return (
    <section className="products">
      {rooms.map((room) => (
        <div className="product" key={room.id}>
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7X0QNtEVS7I3lVqaQBSs2uRMlgHcZknBIFco9Sj2IZyTAP3Hd9p92mGPFhKROD6md5yA&usqp=CAU"
            alt=""
          />
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
  );
}
export default Items;
