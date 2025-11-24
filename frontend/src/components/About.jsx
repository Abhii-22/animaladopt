import React from "react";
import "./About.css";

const About = () => {
  return (
    <section className="about-section">
      <div className="about-container">
        {/* Left - Image */}
        <div className="about-image reveal-left">
          <img src="/images/indian-cow-2579534_1280.jpg" alt="About us" />
        </div>

        {/* Right - Content */}
        <div className="about-content reveal-right">
          <h2>About Us</h2>
          <p>
            We are a passionate team dedicated to building innovative digital
            solutions that make an impact. Our mission is to combine creativity
            and technology to deliver meaningful user experiences.
          </p>
          <p>
            With years of expertise in design, development, and strategy, we
            empower businesses and individuals to thrive in the digital era.
          </p>
          <button className="about-btn">Learn More</button>
        </div>
      </div>

      {/* Extra Info Section */}
      <div className="about-extra">
        <div className="extra-card reveal-up">
          <h3>🌟 Our Mission</h3>
          <p>
            To create cutting-edge solutions that simplify lives and empower
            communities through technology and innovation.
          </p>
        </div>
        <div className="extra-card reveal-up">
          <h3>🚀 Our Vision</h3>
          <p>
            To be a global leader in digital transformation, driving innovation
            while keeping user experience at the core.
          </p>
        </div>
        <div className="extra-card reveal-up">
          <h3>💡 Our Values</h3>
          <p>
            Integrity, creativity, and collaboration are the pillars that define
            who we are and how we work.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
