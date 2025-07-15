import { Linkedin, Facebook, Instagram } from "lucide-react";
import Navbar from "../components/Navbar";

const AboutUsPage = () => {
  return (
    <div className="about-page">
      <Navbar />
      {/* Hero Section */}
      <div className="hero-section">
        <h1>About Our Hotel</h1>
        <p>
          Discover our passion for hospitality and commitment to creating
          unforgettable experiences for our guests.
        </p>
      </div>

      {/* Our Story Section */}
      <div className="story-section">
        <div className="story-content">
          <h2>Our Story</h2>
          <p>
            Founded in 2025, our hotel has been a beacon of hospitality and
            comfort for travelers from around the world. What started as a small
            family-owned establishment has grown into a premier destination for
            both leisure and business travelers.
          </p>
          <p>
            Our commitment to exceptional service, comfort, and attention to
            detail sets us apart in the hospitality industry.
          </p>
        </div>
        <div className="story-image">
          <img
            src="https://media.istockphoto.com/id/104731717/photo/luxury-resort.jpg?s=612x612&w=0&k=20&c=cODMSPbYyrn1FHake1xYz9M8r15iOfGz9Aosy9Db7mI="
            alt="Hotel Exterior"
          />
        </div>
      </div>

      {/* Our Team Section */}
      <div className="team-section">
        <h2>Our Leadership Team</h2>
        <div className="team-grid">
          {[
            {
              name: "Victory Mburu",
              role: "General Manager",
              image: "/api/placeholder/300/300",
            },
            {
              name: "Ryan Njoroge",
              role: "Chief Operations Officer",
              image: "/api/placeholder/300/300",
            },
            {
              name: "Sarah Karanja",
              role: "Guest Experience Director",
              image: "/api/placeholder/300/300",
            },
          ].map((member) => (
            <div key={member.name} className="team-member">
              <img src={member.image} alt={member.name} />
              <h3>{member.name}</h3>
              <p>{member.role}</p>
              <div className="social-icons">
                <Linkedin />
                <Facebook />
                <Instagram />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Values Section */}
      <div className="values-section">
        <h2>Our Core Values</h2>
        <div className="values-grid">
          {[
            {
              title: "Hospitality",
              description:
                "We believe in creating warm, welcoming experiences that make our guests feel at home.",
            },
            {
              title: "Excellence",
              description:
                "We strive for the highest standards in service, comfort, and guest satisfaction.",
            },
            {
              title: "Sustainability",
              description:
                "We are committed to environmentally responsible practices in our operations.",
            },
          ].map((value) => (
            <div key={value.title} className="value-card">
              <h3>{value.title}</h3>
              <p>{value.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact CTA */}
      <div className="cta-section">
        <h2>Ready to Experience Our Hospitality?</h2>
        <p>
          Contact us today to book your stay or learn more about our exceptional
          services.
        </p>
        <button className="cta-button">Contact Us</button>
      </div>
    </div>
  );
};

export default AboutUsPage;
