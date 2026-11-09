import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">⚡ SplitWise Campus</Link>
      <div className="nav-links">
        {user ? (
          <>
            <span>Welcome, {user.name}</span>
            <Link to="/">Dashboard</Link>
            <button className="btn btn-secondary" onClick={() => { logout(); navigate('/login'); }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}