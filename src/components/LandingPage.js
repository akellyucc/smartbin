import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/landingPageCSS/LandingPage.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Importing assets (images and video) from src/assets
//import logoVideo from '../assets/video/W5.mp4';  // Make sure the path is correct
import realTimeMonitoringImage from '../assets/images/real-time-monitoring.jpg';
import routeManagementImage from '../assets/images/route-management.jpeg';
import wasteSortingImage from '../assets/images/waste-sorting.jpg';
import seasonalDataImage from '../assets/images/seasonal-data.png';
import durabilityImage from '../assets/images/durability.jpg';

const LandingPage = () => {
  return (
    <div>
      {/* Header Section */}

      {/* Main Landing Section */}
      <section id="home" className="text-center py-5">
        <h2>Welcome to Our Waste Management Services</h2>
        <p>We offer top-notch waste management solutions for residential, commercial, and industrial needs.</p>
        <Link to="/login" className="btn btn-primary">Login</Link> {/* Call-to-action button */}
      </section>

      {/* About Section */}
      <section id="about" className="py-5">
        <div className="containers">
          <h2>About Us</h2>

          <p>At Waste Management Services, we are committed to revolutionizing waste collection and disposal by leveraging cutting-edge technology. Our goal is to provide efficient, environmentally friendly, and cost-effective waste management solutions for communities and businesses.</p>

          <h3>What We Do</h3>
          <p>We proudly introduce the <strong>Smart-Bin Management System (SMS)</strong>, a cutting-edge solution designed to optimize waste collection in urban and rural areas. Our system integrates smart technology into trash bins to monitor fill levels and streamline the waste collection process, ensuring no bin is left overflowing or unattended.</p>

          <h3>Smart-Bin Management System (SMS)</h3>
          <p>Our Smart-Bin Management System is the core of our service. This innovative technology provides real-time data on the status of waste bins in your community, allowing the <strong>National Solid Waste Management Authority (NSWMA)</strong> to efficiently manage trash collection.</p>

          <div className="key-features">
            <h4>Key Features of Our Smart Waste Management System</h4>
            <ul>
              <li>Real-time data monitoring for waste bins</li>
              <li>Automatic notifications when bins are full</li>
              <li>Optimized route planning for waste collection trucks</li>
              <li>Environmentally friendly waste management practices</li>
              <li>Cost-effective and efficient solutions</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Carousel Section to showcase features */}
      <section id="features" className="py-5">
        <div className="container">
          <h2 className="text-center">Key Features of Our Smart Waste Management System</h2>
          <div id="featureCarousel" className="carousel slide" data-ride="carousel">
            <div className="carousel-inner">
              {/* Real-Time Monitoring */}
              <div className="carousel-item active">
                <img src={realTimeMonitoringImage} className="d-block w-100" alt="Real-Time Monitoring" />
                <div className="carousel-caption">
                  <h3>Real-Time Monitoring</h3>
                  <p>Bins are equipped with sensors that notify our system when they are near full or full, enabling timely pickups.</p>
                </div>
              </div>

              {/* Efficient Route Management */}
              <div className="carousel-item">
                <img src={routeManagementImage} className="d-block w-100" alt="Efficient Route Management" />
                <div className="carousel-caption">
                  <h3>Efficient Route Management</h3>
                  <p>Our system calculates the most efficient routes based on bin status and location, minimizing trips and reducing fuel consumption.</p>
                </div>
              </div>

              {/* Recyclables vs Non-Recyclables */}
              <div className="carousel-item">
                <img src={wasteSortingImage} className="d-block w-100" alt="Recyclables vs Non-Recyclables" />
                <div className="carousel-caption">
                  <h3>Recyclables vs Non-Recyclables</h3>
                  <p>The system categorizes bins for recyclable and non-recyclable materials, ensuring proper waste sorting and processing.</p>
                </div>
              </div>

              {/* Seasonal Data */}
              <div className="carousel-item">
                <img src={seasonalDataImage} className="d-block w-100" alt="Seasonal Data" />
                <div className="carousel-caption">
                  <h3>Seasonal Data</h3>
                  <p>SMS analyzes pickup trends, identifying peak and non-peak months to forecast collection needs and prevent surges.</p>
                </div>
              </div>

              {/* Durability & Easy Maintenance */}
              <div className="carousel-item">
                <img src={durabilityImage} className="d-block w-100" alt="Durability & Easy Maintenance" />
                <div className="carousel-caption">
                  <h3>Durability & Easy Maintenance</h3>
                  <p>The system is housed in weather-resistant materials and designed for easy, affordable maintenance.</p>
                </div>
              </div>
            </div>

            {/* Carousel controls */}
            <a className="carousel-control-prev" href="#featureCarousel" role="button" data-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="sr-only">Previous</span>
            </a>
            <a className="carousel-control-next" href="#featureCarousel" role="button" data-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="sr-only">Next</span>
            </a>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="sms-benefits" className="benefits-section py-5">
        <div className="container">
          <h2 className="section-title text-center">Benefits of Using Smart Waste Management System (SMS)</h2>
          <ul className="benefits-list">
            <li><span className="benefit-icon">✔</span> Real-time waste level monitoring, ensuring timely pickups and no overflowing bins.</li>
            <li><span className="benefit-icon">✔</span> Reduced operational costs through optimized waste collection routes.</li>
            <li><span className="benefit-icon">✔</span> Increased efficiency by segregating recyclable and non-recyclable waste.</li>
            <li><span className="benefit-icon">✔</span> Better environmental impact by reducing unnecessary trips and fuel consumption.</li>
            <li><span className="benefit-icon">✔</span> Data-driven insights to predict waste collection needs based on seasonal trends.</li>
            <li><span className="benefit-icon">✔</span> Durable, low-maintenance system that withstands harsh weather conditions.</li>
          </ul>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="text-center py-4">
        <p>&copy; 2024 Waste Management Services. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
