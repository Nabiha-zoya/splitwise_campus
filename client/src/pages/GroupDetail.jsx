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
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showSettleModal, setShowSettleModal] = useState(false);

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

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>Group Management</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to={`/analytics/${id}`} className="btn btn-secondary">View Analytics</Link>
          <Link to={`/budget/${id}`} className="btn btn-secondary">Budget</Link>
          <button className="btn" onClick={() => setShowExpenseModal(true)}>+ New Expense</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <ExpenseList expenses={expenses} />
        <BalancesSummary balances={balances} members={members} onSettleClick={() => setShowSettleModal(true)} />
      </div>

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