import React, { useState, useEffect } from 'react';
import { ClockCounterClockwise } from '@phosphor-icons/react';

const History = () => {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/papers')
      .then(res => res.json())
      .then(data => {
        setPapers(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch historical data.');
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: '3rem 4rem', maxWidth: '900px', margin: '0 auto' }} className="animate-in">
      <header style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
        <ClockCounterClockwise size={32} color="var(--primary)" />
        <h1 style={{ fontSize: '2rem' }}>Research History</h1>
      </header>

      {loading && <p className="text-muted">Loading archive...</p>}
      {error && <p style={{ color: 'var(--primary)' }}>{error}</p>}
      
      {!loading && !error && papers.length === 0 && (
        <div className="card-layer" style={{ textAlign: 'center' }}>
          <p className="text-muted">No past analyses found. Go to the dashboard to begin.</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {!loading && papers.map((paper, idx) => (
          <div key={paper._id || idx} className="card-layer" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem' }}>{paper.filename}</h3>
              <p className="text-muted">{new Date(paper.createdAt).toLocaleString()}</p>
            </div>
            <button className="btn-secondary" style={{ fontSize: '0.875rem' }}>
              View Record
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;
