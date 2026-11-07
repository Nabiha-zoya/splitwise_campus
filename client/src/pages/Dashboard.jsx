import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';

export default function Dashboard() {
  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState('');

  const fetchGroups = async () => {
    const res = await client.get('/groups');
    setGroups(res.data);
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!groupName) return;
    await client.post('/groups', { group_name: groupName });
    setGroupName('');
    fetchGroups();
  };

  return (
    <div className="container">
      <h2>My Groups</h2>
      <div className="card" style={{ marginTop: '1rem' }}>
        <h3>Create New Group</h3>
        <form onSubmit={handleCreateGroup} style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
          <input
            className="form-control"
            placeholder="e.g. Hostel Room 204 or Goa Trip"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
          <button type="submit" className="btn">Create</button>
        </form>
      </div>

      <div className="grid">
        {groups.map((g) => (
          <div key={g.group_id} className="card">
            <h3>{g.group_name}</h3>
            <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0' }}>Created by {g.created_by_name}</p>
            <Link to={`/group/${g.group_id}`} className="btn" style={{ display: 'inline-block', marginTop: '0.5rem' }}>
              View Group
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}