import React, { useState } from 'react';
import client from '../api/client';

export default function ExpenseForm({ groupId, members, onExpenseAdded, onClose }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState(members[0]?.user_id || '');
  const [categoryId, setCategoryId] = useState('1');
  const [splitType, setSplitType] = useState('equal');
  const [customSplits, setCustomSplits] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const selectedParticipants = members.map((m) => m.user_id);
      let payloadCustom = [];

      if (splitType === 'exact') {
        payloadCustom = members.map((m) => ({
          user_id: m.user_id,
          amount: parseFloat(customSplits[m.user_id] || 0)
        }));
      } else if (splitType === 'percentage') {
        payloadCustom = members.map((m) => ({
          user_id: m.user_id,
          percentage: parseFloat(customSplits[m.user_id] || 0)
        }));
      }

      await client.post('/expenses', {
        group_id: groupId,
        paid_by: paidBy,
        category_id: categoryId,
        description,
        amount: parseFloat(amount),
        expense_date: new Date().toISOString().split('T')[0],
        split_type: splitType,
        participants: selectedParticipants,
        custom_splits: payloadCustom
      });

      onExpenseAdded();
      onClose();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to add expense');
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h3>Create New Expense</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Description</label>
            <input className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Amount (₹)</label>
            <input type="number" step="0.01" className="form-control" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Paid By</label>
            <select className="form-control" value={paidBy} onChange={(e) => setPaidBy(e.target.value)}>
              {members.map((m) => (
                <option key={m.user_id} value={m.user_id}>{m.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Category</label>
            <select className="form-control" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
              <option value="1">Food & Drinks</option>
              <option value="2">Transport</option>
              <option value="3">Accommodation</option>
              <option value="4">Shopping</option>
              <option value="5">Utilities</option>
              <option value="6">Entertainment</option>
            </select>
          </div>
          <div className="form-group">
            <label>Split Method</label>
            <select className="form-control" value={splitType} onChange={(e) => setSplitType(e.target.value)}>
              <option value="equal">Equal Split</option>
              <option value="exact">Exact Amount</option>
              <option value="percentage">Percentage Split</option>
            </select>
          </div>

          {splitType !== 'equal' && (
            <div className="form-group">
              <label>Specify Breakdown ({splitType === 'exact' ? '₹' : '%'})</label>
              {members.map((m) => (
                <div key={m.user_id} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{ width: '100px' }}>{m.name}:</span>
                  <input
                    type="number"
                    className="form-control"
                    placeholder={splitType === 'exact' ? 'Amount' : 'Percentage'}
                    onChange={(e) => setCustomSplits({ ...customSplits, [m.user_id]: e.target.value })}
                  />
                </div>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="submit" className="btn">Add Expense</button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}