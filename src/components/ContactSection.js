import React from 'react';
import './ContactSection.css';

export default function ContactSection() {
  return (
    <section id="contact" className="contact-modern-section" style={{ scrollMarginTop: 100 }}>
      <div className="contact-modern-container">
        {/* Colonne gauche : infos contact */}
        <div className="contact-modern-info">
          <div className="contact-modern-label">CONTACT</div>
          <h2 className="contact-modern-title">Pour toute information merci de nous contacter via ce formulaire.</h2>
          <p className="contact-modern-desc">
            Connect with us for any inquiries or support. We're here to help and look forward to hearing from you.
          </p>
          <div className="contact-modern-list">
            <div className="contact-modern-item">
              <span className="contact-modern-icon"><i className="fa-solid fa-phone"></i></span>
              <div>
                <div className="contact-modern-item-label">Contact</div>
                <div className="contact-modern-item-value">Fixe : +212 525 073 100
                  
                </div>
                 <div className="contact-modern-item-value">Fax : +212 525 073 134
                  
                </div>
              </div>
            </div>
            <div className="contact-modern-item">
              <span className="contact-modern-icon"><i className="fa-solid fa-envelope"></i></span>
              <div>
                <div className="contact-modern-item-label">Email</div>
                <div className="contact-modern-item-value">contact@um6p.ma</div>
              </div>
            </div>
            <div className="contact-modern-item">
              <span className="contact-modern-icon"><i className="fa-solid fa-location-dot"></i></span>
              <div>
                <div className="contact-modern-item-label">Our Address</div>
                <div className="contact-modern-item-value">Mohammed VI Polytechnic University
Lot 660, Hay Moulay Rachid Ben Guerir, 43150, Morocco

</div>
              </div>
            </div>
          </div>
        </div>
        {/* Colonne droite : formulaire */}
        <form className="contact-modern-form">
          <h3 className="contact-modern-form-title">HAVE ANY QUESTIONS</h3>
          <p className="contact-modern-form-desc">Fill out the form to connect with us today.</p>
          <div className="contact-modern-form-row">
            <input type="text" placeholder="First Name" required />
            <input type="text" placeholder="Last Name" required />
          </div>
          <div className="contact-modern-form-row">
            <input type="email" placeholder="Email Address" required />
            <input type="text" placeholder="Phone No" />
          </div>
          <textarea placeholder="Message" rows={4} required></textarea>
          <button type="submit" className="contact-modern-btn">Submit Message</button>
        </form>
      </div>
    </section>
  );
}