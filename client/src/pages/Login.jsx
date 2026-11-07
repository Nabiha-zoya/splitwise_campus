import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      alert('Invalid login credentials');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '400px' }}>
      <div className="card">
        <h2>Sign In</h2>
        <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
          <div className="form-group">
            <label>Email</label>
            <input className="form-control" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input className="form-control" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn" style={{ width: '100%', marginTop: '1rem' }}>Login</button>
        </form>
        <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>
          New user? <Link to="/register" style={{ color: 'var(--primary)' }}>Create account</Link>
        </p>
      </div>
    </div>
  );
}