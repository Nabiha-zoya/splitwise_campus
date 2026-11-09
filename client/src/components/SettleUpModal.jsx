import React, { useState } from 'react';
import client from '../api/client';

export default function SettleUpModal({ groupId, members, onSettled, onClose }) {
  const [paidBy, setPaidBy] = useState(members[0]?.user_id || '');
  const [receivedBy, setReceivedBy] = useState(members[1]?.user_id || '');
  const [amount, setAmount] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await client.post('/settlements', {
        group_id: groupId,
        paid_by: paidBy,
        received_by: receivedBy,
        amount: parseFloat(amount)
      });
      onSettled();
      onClose();
    } catch (err) {
      alert('Failed to record settlement');
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h3>Record Settlement</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Payer (Who Paid)</label>
            <select className="form-control" value={paidBy} onChange={(e) => setPaidBy(e.target.value)}>
              {members.map((m) => (
                <option key={m.user_id} value={m.user_id}>{m.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Recipient (Who Received)</label>
            <select className="form-control" value={receivedBy} onChange={(e) => setReceivedBy(e.target.value)}>
              {members.map((m) => (
                <option key={m.user_id} value={m.user_id}>{m.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Amount (₹)</label>
            <input type="number" step="0.01" className="form-control" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="submit" className="btn">Save Payment</button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}