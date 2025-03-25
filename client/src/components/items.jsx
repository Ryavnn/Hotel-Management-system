import coffee from "../assets/coffee-table.jpg"
function Items() {
  return (
    <section className="products">
      <div className="product">
        <img src={coffee} alt="" />
        <h4>Syltherine</h4>
        <p>Stylish cafe chair</p>
        <span className="price">$ 150</span>
        <button className="add-cart">Book now</button>
      </div>
      <div className="product">
        <img src={coffee} alt="" />
        <h4>Syltherine</h4>
        <p>Stylish cafe chair</p>
        <span className="price">$ 150</span>
        <button className="add-cart">Book now</button>
      </div>
      <div className="product">
        <img src={coffee} alt=" " />
        <h4>Syltherine</h4>
        <p>Stylish cafe chair</p>
        <span className="price">$ 150</span>
        <button className="add-cart">Book now</button>
      </div>
      <div className="product">
        <img src={coffee} alt="" />
        <h4>Syltherine</h4>
        <p>Stylish cafe chair</p>
        <span className="price">$ 150</span>
        <button className="add-cart">Book now</button>
      </div>
    </section>
  );
}
export default Items;
