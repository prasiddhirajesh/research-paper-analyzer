import React, { useState, useEffect } from 'react';
import { ClockCounterClockwise, CaretDown, CaretUp } from '@phosphor-icons/react';

function formatMarkdown(text) {
  if (!text) return "No content available.";
  return text
    .split('\n')
    .map(line => {
      line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      if (line.startsWith('* ') || line.startsWith('- ')) return `<li>${line.substring(2)}</li>`;
      return line ? `<p style="margin-bottom: 0.75rem;">${line}</p>` : '';
    })
    .join('')
    .replace(/(<li>.*<\/li>)/s, '<ul style="list-style-type: disc; margin-left: 1.5rem; margin-bottom: 1rem;">$1</ul>');
}

const History = () => {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

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

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div style={{ padding: '3rem 4rem', maxWidth: '900px', margin: '0 auto' }} className="animate-in">
      <header style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
        <ClockCounterClockwise size={32} color="var(--primary)" />
        <h1 style={{ fontSize: '2rem', color: 'var(--on_surface)' }}>Research History</h1>
      </header>

      {loading && <p className="text-muted">Loading archive...</p>}
      {error && <p style={{ color: 'var(--primary)' }}>{error}</p>}
      
      {!loading && !error && papers.length === 0 && (
        <div className="card-layer" style={{ textAlign: 'center', padding: '2rem' }}>
          <p className="text-muted">No past analyses found. Go to the dashboard to begin.</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {!loading && papers.map((paper, idx) => (
          <div key={paper._id || idx} className="card-layer" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem', color: 'var(--on_surface)' }}>{paper.filename}</h3>
                <p className="text-muted" style={{ fontSize: '0.875rem' }}>{new Date(paper.createdAt).toLocaleString()}</p>
              </div>
              <button 
                onClick={() => toggleExpand(paper._id)} 
                className="btn-secondary" 
                style={{ fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
              >
                {expandedId === paper._id ? 'Close Record' : 'View Record'} 
                {expandedId === paper._id ? <CaretUp weight="bold" /> : <CaretDown weight="bold" />}
              </button>
            </div>
            
            {/* Expanded Content Area */}
            {expandedId === paper._id && (
              <div style={{ padding: '1.5rem', borderTop: '1px solid var(--outline_variant)', backgroundColor: 'var(--surface_container_lowest)' }}>
                <h4 style={{ marginBottom: '1rem', color: 'var(--on_surface)', fontSize: '1.1rem' }}>Executive Summary</h4>
                <div 
                  dangerouslySetInnerHTML={{ __html: formatMarkdown(paper.summary) }} 
                  style={{ color: 'var(--on_surface_variant)', lineHeight: '1.6', fontSize: '1rem' }} 
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;
