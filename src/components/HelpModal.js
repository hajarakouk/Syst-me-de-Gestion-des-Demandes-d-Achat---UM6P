import React from 'react';

const HelpModal = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={onClose}>Fermer</button>
        {children}
      </div>
    </div>
  );
};

export default HelpModal; 