import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import client from '../api/client';

export default function Budget() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [month, setMonth] = useState('2026-11-01');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await client.post('/budgets', {
        group_id: id,
        amount: parseFloat(amount),
        budget_month: month
      });
      alert('Group budget set successfully');
      navigate(`/group/${id}`);
    } catch (err) {
      alert('Failed to set budget');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '400px' }}>
      <div className="card">
        <h2>Set Monthly Budget</h2>
        <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
          <div className="form-group">
            <label>Budget Amount (₹)</label>
            <input
              type="number"
              className="form-control"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Month</label>
            <input
              type="date"
              className="form-control"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn" style={{ width: '100%', marginTop: '1rem' }}>
            Save Budget
          </button>
        </form>
      </div>
    </div>
  );
}