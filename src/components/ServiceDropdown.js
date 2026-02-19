import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';

function ServiceDropdown() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();
  const buttonRef = useRef();
  const [menuStyle, setMenuStyle] = useState({});
  const navigate = useNavigate();
  const userRole = localStorage.getItem('role');

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuStyle({
        position: 'fixed',
        top: rect.bottom + 4,
        left: rect.left,
        minWidth: rect.width,
        zIndex: 4000,
      });
    }
  }, [open]);

  const handleItemClick = (path) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => setOpen(!open)}
        style={{
          background: 'none',
          color: '#e6501e',
          border: 'none',
          borderRadius: 20,
          padding: '8px 18px 8px 14px',
          fontWeight: 600,
          fontSize: 16,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          position: 'relative',
        }}
      >
        Service
        <span style={{
          display: 'inline-block',
          transition: 'transform 0.2s',
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          fontSize: 14,
          marginLeft: 2
        }}>▼</span>
      </button>
      {open && createPortal(
        <div
          ref={dropdownRef}
          style={{
            ...menuStyle,
            background: 'rgba(255,255,255,0.98)',
            boxShadow: '0 8px 32px rgba(0,33,71,0.18)',
            borderRadius: 10,
            padding: '8px 0',
            border: '1px solid #eee',
          }}
        >
          <button
            style={menuBtnStyle}
            onClick={() => handleItemClick('/login')}
          >
            Demande d’achat
          </button>
        </div>,
        document.body
      )}
    </>
  );
}

const menuBtnStyle = {
  background: 'none',
  border: 'none',
  color: '#e6501e',
  fontWeight: 600,
  padding: '10px 20px',
  width: '100%',
  textAlign: 'left',
  cursor: 'pointer',
  fontSize: 15
};

export default ServiceDropdown; 
