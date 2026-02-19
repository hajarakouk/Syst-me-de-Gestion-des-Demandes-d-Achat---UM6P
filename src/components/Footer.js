import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedin, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      {/* Newsletter */}
      <div className="footer-newsletter">
        <div className="newsletter-text">
          <h2>Newsletter</h2>
          <p>Sign up our newsletter to get update news and article about company.</p>
        </div>
        <form className="newsletter-form">
          <input type="email" placeholder="Enter your email" />
          <button type="submit">SIGN UP</button>
        </form>
      </div>
      {/* Colonnes principales */}
      <div className="footer-cols">
        <div>
          <h4>Company</h4>
          <a href="/">About Us</a>
          <a href="/">Investors</a>
          <a href="/">Careers</a>
          <a href="/">News & Update</a>
          <a href="/">Business Ethics</a>
        </div>
        <div>
          <h4>Services</h4>
          <a href="/">Demande d'achat</a>
         
        </div>
        <div>
          <h4>Support</h4>
          <a href="/">Help Center</a>
          <a href="/">Ticket System</a>
          <a href="/">Forum</a>
          <a href="/">FAQ</a>
        </div>
        <div className="footer-contact-col">
          <div className="footer-logo">
            <img src="/OIP.jpeg" alt="Logo" className="logo-icon" style={{height: '32px', verticalAlign: 'middle', marginRight: '8px'}} />
          </div>
          <p className="footer-company-desc">
           I have read and accept the general terms and  conditions of use, in particular the statement concerning the protection of personal data. In accordance with law 09-08, you have the right to access, rectify and oppose the processing of your personal data. This processing has been authorized by the CNDP under the n° D-469/2024
          </p>
          <div className="footer-contact-info">
            <div><FaMapMarkerAlt /> Lot 660, Hay Moulay Rachid Ben Guerir, 43150, Morocco</div>
            <div><FaPhoneAlt /> +212 525 073 100</div>
            <div><FaEnvelope /> contact@um6p.ma</div>
          </div>
        </div>
      </div>
      {/* Bas de page */}
      <div className="footer-bottom-row">
        <div className="footer-socials">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
        </div>
      </div>
      <div className="footer-copyright">
        © 
      </div>
    </footer>
  );
}

export default Footer;