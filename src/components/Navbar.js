import React, { useState } from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';
import './Navbar.css';
import ServiceDropdown from './ServiceDropdown';
import AdministrationDropdown from './AdministrationDropdown';
import { useLocation } from 'react-router-dom';

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}

function Navbar() {
  const [lang, setLang] = useState('fr');
  const location = typeof window !== 'undefined' ? window.location : { pathname: '/' };

  function handleNavClick(id) {
    if (location.pathname === '/') {
      scrollToSection(id);
    } else {
      window.location.href = '/?scroll=' + id;
    }
  }

  return (
    <nav className="navbar">
      <div className="topbar">
        <div className="topbar-left">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"><FaYoutube /></a>
        </div>
        <div className="topbar-right">
          <select
            style={{ background: 'transparent', color: '#fff', border: 'none', fontSize: '16px', cursor: 'pointer' }}
            value={lang}
            onChange={e => setLang(e.target.value)}
          >
            <option value="fr">Français</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>
      <div className="navbar-content">
        <div className="navbar-logo">
          <a href="#accueil" onClick={e => { e.preventDefault(); scrollToSection('accueil'); }}>
            <img src="/OIP.jpeg" alt="Logo" className="logo-icon" style={{height: '32px', verticalAlign: 'middle', marginRight: '8px'}} />
          </a>
        </div>
        <ul className="navbar-links">
          <li><a href="#accueil" onClick={e => { e.preventDefault(); handleNavClick('accueil'); }}>Accueil</a></li>
          <li><a href="#about" onClick={e => { e.preventDefault(); handleNavClick('about'); }}>À propos</a></li>
          <li><a href="#contact" onClick={e => { e.preventDefault(); handleNavClick('contact'); }}>Contact</a></li>
          <li><ServiceDropdown /></li>
          <li><AdministrationDropdown /></li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;