import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import client from '../api/client';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import BalancesSummary from '../components/BalancesSummary';
import SettleUpModal from '../components/SettleUpModal';

export default function GroupDetail() {
  const { id } = useParams();
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState({});
  const [members, setMembers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showSettleModal, setShowSettleModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);

  const loadData = async () => {
    const expRes = await client.get(`/expenses/group/${id}`);
    const balRes = await client.get(`/balances/group/${id}`);
    setExpenses(expRes.data);
    setBalances(balRes.data);
    setMembers(balRes.data.members || []);
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleOpenAddMember = async () => {
    try {
      const res = await client.get('/auth/users');
      // Filter out users who are already in this group
      const existingIds = new Set(members.map((m) => m.user_id));
      const available = res.data.filter((u) => !existingIds.has(u.user_id));
      
      setAllUsers(available);
      if (available.length > 0) {
        setSelectedUserId(available[0].user_id);
      }
      setShowAddMemberModal(true);
    } catch (err) {
      alert('Failed to load registered users.');
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!selectedUserId) return;
    try {
      await client.post(`/groups/${id}/members`, { user_id: parseInt(selectedUserId) });
      alert('Member added successfully!');
      setShowAddMemberModal(false);
      loadData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to add member.');
    }
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>Group Management</h2>
        <div style={{ display: 'flex', gap: '0.8rem' }}>
          <button className="btn btn-secondary" onClick={handleOpenAddMember}>+ Add Member</button>
          <Link to={`/analytics/${id}`} className="btn btn-secondary">View Analytics</Link>
          <Link to={`/budget/${id}`} className="btn btn-secondary">Budget</Link>
          <button className="btn" onClick={() => setShowExpenseModal(true)}>+ New Expense</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <ExpenseList expenses={expenses} />
        <BalancesSummary balances={balances} members={members} onSettleClick={() => setShowSettleModal(true)} />
      </div>

      {showAddMemberModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h3>Add Member to Group</h3>
            <form onSubmit={handleAddMember}>
              <div className="form-group" style={{ marginTop: '1rem' }}>
                <label>Select User by Name</label>
                {allUsers.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)' }}>All registered users are already in this group.</p>
                ) : (
                  <select
                    className="form-control"
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                  >
                    {allUsers.map((user) => (
                      <option key={user.user_id} value={user.user_id}>
                        {user.name} ({user.email})
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                {allUsers.length > 0 && <button type="submit" className="btn">Add Member</button>}
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddMemberModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showExpenseModal && (
        <ExpenseForm
          groupId={id}
          members={members}
          onExpenseAdded={loadData}
          onClose={() => setShowExpenseModal(false)}
        />
      )}

      {showSettleModal && (
        <SettleUpModal
          groupId={id}
          members={members}
          onSettled={loadData}
          onClose={() => setShowSettleModal(false)}
        />
      )}
    </div>
  );
}