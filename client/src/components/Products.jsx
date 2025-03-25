import bedroom from "../assets/bedroom.jpg";
function Products() {
  return (
    <section className="options">
      <div className="heading">
        <h3>Browse The Range</h3>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
      </div>
      <div className="types">
        <div className="type">
          <img src={bedroom} alt="" />
          <h4>Standard Room</h4>
        </div>
        <div className="type">
          <img src={bedroom} alt="" />
          <h4>Deluxe Room</h4>
        </div>
        <div className="type">
          <img src={bedroom} alt="" />
          <h4>Suite</h4>
        </div>
        <div className="type">
          <img src={bedroom} alt="" />
          <h4>Presidential Suite</h4>
        </div>
      </div>
    </section>
  );
}
export default Products;
