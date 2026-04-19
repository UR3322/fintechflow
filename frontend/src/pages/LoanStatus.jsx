import React, { useState, useEffect } from 'react';
import { useToast } from '../context/AppContext';
import { formatPKR, formatDate, API_BASE } from '../utils/helpers';
import { useCountUp } from '../hooks/useCountUp';
import { SkeletonCard } from '../components/Skeleton';

function StatusCount({ label, count, color }) {
  const animated = useCountUp(count);
  return (
    <div className="status-count-item" style={{ '--accent': color }}>
      <span className="status-count-num">{animated}</span>
      <span className="status-count-label">{label}</span>
    </div>
  );
}

export default function LoanStatus() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('default');
  const { addToast } = useToast();

  useEffect(() => {
    fetchLoans();
  }, []);

  async function fetchLoans() {
    try {
      const res = await fetch(`${API_BASE}/api/loans`);
      const data = await res.json();
      setLoans(Array.isArray(data) ? data : []);
    } catch {
      addToast('Failed to load loans', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id, status) {
    try {
      const res = await fetch(`${API_BASE}/api/loans/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (!res.ok) { addToast(data.error, 'error'); return; }
      setLoans(prev => prev.map(l => l.id === id ? data.loan : l));
      addToast(`Loan ${id} ${status}`, 'success');
    } catch {
      addToast('Network error', 'error');
    }
  }

  const pending = loans.filter(l => l.status === 'pending').length;
  const approved = loans.filter(l => l.status === 'approved').length;
  const rejected = loans.filter(l => l.status === 'rejected').length;

  const sorted = [...loans].sort((a, b) => {
    if (sortBy === 'amount-high') return b.amount - a.amount;
    if (sortBy === 'amount-low') return a.amount - b.amount;
    if (sortBy === 'status') return a.status.localeCompare(b.status);
    return 0;
  });

  return (
    <div className="page-container fade-in">
      <h1 className="page-title">Loan Status</h1>

      <div className="status-summary-bar">
        <StatusCount label="Pending" count={pending} color="var(--warning)" />
        <StatusCount label="Approved" count={approved} color="var(--success)" />
        <StatusCount label="Rejected" count={rejected} color="var(--danger)" />
      </div>

      <div className="sort-bar">
        <label>Sort by:</label>
        <select className="form-input sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="default">Default</option>
          <option value="amount-high">Amount (High → Low)</option>
          <option value="amount-low">Amount (Low → High)</option>
          <option value="status">Status</option>
        </select>
      </div>

      <div className="loans-grid">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} height={200} />)
          : sorted.map(loan => (
            <LoanCard key={loan.id} loan={loan} onUpdate={updateStatus} />
          ))
        }
      </div>
    </div>
  );
}

function LoanCard({ loan, onUpdate }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="flip-card"
      onMouseEnter={() => loan.status === 'pending' && setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
    >
      <div className={`flip-inner ${flipped ? 'flipped' : ''}`}>
        {/* Front */}
        <div className="flip-front">
          <div className="loan-card-header">
            <span className="loan-id">{loan.id}</span>
            <span className={`status-badge status-${loan.status}`}>{loan.status}</span>
          </div>
          <p className="loan-applicant">{loan.applicant}</p>
          <p className="loan-amount">{formatPKR(loan.amount)}</p>
          <div className="loan-meta">
            <span>{loan.purpose}</span>
            <span>{loan.tenure} months</span>
          </div>
          <p className="loan-date">Applied: {formatDate(loan.appliedAt)}</p>
          {loan.status === 'pending' && <p className="flip-hint">Hover to manage →</p>}
        </div>

        {/* Back */}
        <div className="flip-back">
          <p className="flip-back-title">Manage Loan</p>
          <p className="flip-back-id">{loan.id}</p>
          <p className="flip-back-amt">{formatPKR(loan.amount)}</p>
          <div className="flip-actions">
            <button className="btn btn-approve" onClick={() => onUpdate(loan.id, 'approved')}>✓ Approve</button>
            <button className="btn btn-reject" onClick={() => onUpdate(loan.id, 'rejected')}>✕ Reject</button>
          </div>
        </div>
      </div>
    </div>
  );
}
