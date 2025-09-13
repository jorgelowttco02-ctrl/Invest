import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

const Navigation = ({ user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    setIsMenuOpen(false);
    onLogout();
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <Link to="/" className="brand-link">
            <span className="brand-text">PeerBR</span>
          </Link>
        </div>

        <div className="nav-menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <div className="nav-links">
            <Link 
              to="/" 
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Investimentos
            </Link>
            <Link 
              to="/account" 
              className={`nav-link ${isActive('/account') ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Minha Conta
            </Link>
          </div>

          <div className="nav-user">
            <div className="user-info">
              <span className="user-name">{user?.nome}</span>
              <span className="user-email">{user?.email}</span>
            </div>
            <button className="logout-button" onClick={handleLogout}>
              Sair
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

