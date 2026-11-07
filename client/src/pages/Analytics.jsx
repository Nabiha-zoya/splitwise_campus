import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import client from '../api/client';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Analytics() {
  const { id } = useParams();
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    client.get(`/analytics/group/${id}`).then((res) => setAnalytics(res.data));
  }, [id]);

  if (!analytics) return <div className="container">Loading...</div>;

  const data = {
    labels: analytics.categoryBreakdown.map((c) => c.category_name),
    datasets: [
      {
        data: analytics.categoryBreakdown.map((c) => c.total_spent),
        backgroundColor: ['#7c3aed', '#10b981', '#ef4444', '#f59e0b', '#3b82f6', '#ec4899']
      }
    ]
  };

  return (
    <div className="container" style={{ maxWidth: '600px' }}>
      <div className="card">
        <h2>Spending Analytics</h2>
        <h3 style={{ margin: '1rem 0', color: 'var(--primary)' }}>
          Total Spend: ₹{parseFloat(analytics.totalSpent).toFixed(2)}
        </h3>
        {analytics.categoryBreakdown.length > 0 ? (
          <Pie data={data} />
        ) : (
          <p style={{ color: 'var(--text-muted)' }}>No expense data to display chart.</p>
        )}
      </div>
    </div>
  );
}