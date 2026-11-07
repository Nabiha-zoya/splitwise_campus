import React from 'react';

export default function ExpenseList({ expenses }) {
  return (
    <div className="card">
      <h3>Expense History</h3>
      {expenses.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>No expenses added yet.</p>
      ) : (
        <table style={{ width: '100%', marginTop: '1rem', textIndent: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
              <th style={{ padding: '8px' }}>Date</th>
              <th>Description</th>
              <th>Category</th>
              <th>Paid By</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((exp) => (
              <tr key={exp.expense_id} style={{ borderBottom: '1px solid #1e293b' }}>
                <td style={{ padding: '8px' }}>{exp.expense_date?.substring(0, 10)}</td>
                <td>{exp.description}</td>
                <td>{exp.category_name}</td>
                <td>{exp.paid_by_name}</td>
                <td style={{ fontWeight: 'bold' }}>₹{parseFloat(exp.amount).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}