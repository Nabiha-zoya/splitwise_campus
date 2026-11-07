import React from 'react';

export default function BalancesSummary({ balances, members, onSettleClick }) {
  const memberMap = {};
  members.forEach((m) => (memberMap[m.user_id] = m.name));

  return (
    <div className="card">
      <h3>Group Balances</h3>
      <div style={{ margin: '1rem 0' }}>
        {Object.entries(balances.netBalances || {}).map(([userId, net]) => {
          const val = parseFloat(net);
          return (
            <div key={userId} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0' }}>
              <span>{memberMap[userId]}</span>
              <span className={val >= 0 ? 'badge-positive' : 'badge-negative'}>
                {val >= 0 ? `+₹${val.toFixed(2)}` : `-₹${Math.abs(val).toFixed(2)}`}
              </span>
            </div>
          );
        })}
      </div>

      <h4 style={{ marginTop: '1.5rem' }}>Suggested Settlements</h4>
      {balances.simplifiedSettlements?.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>All settled up!</p>
      ) : (
        <ul style={{ listStyle: 'none', marginTop: '0.5rem' }}>
          {balances.simplifiedSettlements?.map((tx, idx) => (
            <li key={idx} style={{ padding: '0.4rem 0' }}>
              <strong>{memberMap[tx.from]}</strong> owes <strong>{memberMap[tx.to]}</strong>: ₹{tx.amount.toFixed(2)}
            </li>
          ))}
        </ul>
      )}
      <button className="btn" style={{ marginTop: '1rem' }} onClick={onSettleClick}>
        Record Settlement
      </button>
    </div>
  );
}