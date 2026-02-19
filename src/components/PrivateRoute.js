import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const location = useLocation();

  // Si aucun token → redirection vers la page login
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si le rôle de l'utilisateur n'est pas autorisé
  if (allowedRoles && !allowedRoles.includes(role)) {
    return (
      <div style={{
        color: '#e6501e',
        fontWeight: 700,
        fontSize: 22,
        textAlign: 'center',
        marginTop: 80,
        background: '#fffbe6',
        border: '2px solid #ffe58f',
        borderRadius: 12,
        padding: '32px 24px',
        maxWidth: 500,
        marginLeft: 'auto',
        marginRight: 'auto'
      }}>
        🚫 Accès refusé<br />
        <span style={{ fontWeight: 500, fontSize: 18, color: '#222' }}>
          Vous n'avez pas les autorisations nécessaires pour accéder à cette page.
        </span>
      </div>
    );
  }

  return children;
};

export default PrivateRoute;
