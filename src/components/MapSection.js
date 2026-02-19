import React, { useState } from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';
import './MapSection.css';

const campuses = [
  { name: "Benguerir", lat: 32.2271, lng: -7.9464 },
  { name: "Rabat", lat: 34.020882, lng: -6.841650 },
  { name: "Laâyoune", lat: 27.1536, lng: -13.2033 },
  { name: "Marrakech", lat: 31.6295, lng: -7.9811 },
  { name: "El Jadida", lat: 33.2473, lng: -8.4960 },
  { name: "Casablanca", lat: 33.5731, lng: -7.5898 },
];

function MapSection() {
  const [selected, setSelected] = useState(campuses[0]);
  const mapSrc = `https://www.google.com/maps?q=${selected.lat},${selected.lng}&z=12&output=embed`;

  return (
    <div className="map-section">
      <div className="campus-list">
        {campuses.map((campus) => (
          <button
            key={campus.name}
            className={`campus-btn${selected.name === campus.name ? ' active' : ''}`}
            onClick={() => setSelected(campus)}
            style={{ margin: 10, background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, display: 'flex', alignItems: 'center' }}
          >
            <FaMapMarkerAlt style={{ color: '#e6501e', marginRight: 8 }} />
            {campus.name}
          </button>
        ))}
      </div>
      <iframe
        title="map"
        src={mapSrc}
        width="100%"
        height="350"
        style={{ border: 0, marginTop: 20 }}
        allowFullScreen=""
        loading="lazy"
      ></iframe>
    </div>
  );
}

export default MapSection;