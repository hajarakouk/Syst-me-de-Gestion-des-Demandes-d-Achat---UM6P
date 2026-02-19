import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaUser, FaLock, FaFacebookF, FaGoogle, FaTwitter } from 'react-icons/fa';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [accessDenied, setAccessDenied] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setAccessDenied(false);

    try {
      const response = await fetch('http://localhost:5001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success && data.user) {
        // Stockage des informations utilisateur
        localStorage.setItem('token', 'fake-jwt-token-for-' + data.user.id);
        localStorage.setItem('role', data.user.role);
        localStorage.setItem('email', data.user.email);
        if (data.user.name) {
          localStorage.setItem('name', data.user.name);
      }

        // Redirection intelligente après login
        const params = new URLSearchParams(location.search);
        const redirect = params.get('redirect');

        if (redirect === 'users' && data.user.role === 'admin') {
          navigate('/users');
        } else if (redirect === 'users' && data.user.role !== 'admin') {
          setAccessDenied(true);
        } else if (redirect === 'processus-achat') {
          navigate('/processus-achat');
        } else {
          // Redirection par défaut vers le formulaire de demande d'achat
          navigate('/demande-achat');
        }
      } else {
        throw new Error(data.error || 'La structure de la réponse du serveur est incorrecte.');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="login-bg">
      <div className="login-card">
        <h2 className="login-title">Login<span className="dot">.</span></h2>
        <p className="login-sub">Don't have an account? <span className="signup-link">Sign up</span></p>
        {accessDenied && (
          <div style={{ color: '#e6501e', fontWeight: 700, fontSize: 18, textAlign: 'center', background: '#fffbe6', border: '2px solid #ffe58f', borderRadius: 10, padding: '18px 12px', marginBottom: 18 }}>
            🚫 Accès refusé<br />
            <span style={{ fontWeight: 500, fontSize: 16, color: '#222' }}>
              Cette page est réservée aux administrateurs.<br />
              Veuillez vous connecter avec un compte admin pour accéder à la gestion des accès.
            </span>
          </div>
        )}
        <form className="login-form" onSubmit={handleSubmit} autoComplete="off">
          <div className="input-group">
            <span className="input-icon"><FaUser /></span>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="off"
            />
          </div>
          <div className="input-group">
            <span className="input-icon"><FaLock /></span>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="off"
            />
            <span className="show-btn" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? 'Hide' : 'Show'}
            </span>
          </div>
          <div className="login-options">
            <label className="remember-me">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              Remember me.
            </label>
            <span className="forgot-link">Forgot Password</span>
          </div>
          {error && <div style={{color:'#ff6600', marginBottom:8, fontWeight:500}}>{error}</div>}
          <button className="login-btn" type="submit">Login</button>
        </form>
        <div className="login-or">Or login with.</div>
        <div className="login-socials">
          <span className="social-icon"><FaFacebookF /></span>
          <span className="social-icon"><FaGoogle /></span>
          <span className="social-icon"><FaTwitter /></span>
        </div>
      </div>
    </div>
  );
};

export default Login; 


