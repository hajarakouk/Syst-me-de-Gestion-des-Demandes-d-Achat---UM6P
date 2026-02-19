import React from 'react';
import './HomePage.css';

function HomePage() {
  return (
    <div className="homepage homepage-simple">
      <section className="banner">
        <div className="banner-overlay">
          <img src="/OIP.jpeg" alt="UM6P Logo" className="um6p-logo" />
          <div className="banner-content">
            <h1>Bienvenue à l’UM6P</h1>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;