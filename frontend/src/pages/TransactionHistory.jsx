import React, { useState, useEffect, useMemo } from 'react';
import { SkeletonRow } from '../components/Skeleton';
import { formatPKR, formatDate, API_BASE } from '../utils/helpers';
import { useToast } from '../context/AppContext';

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const { addToast } = useToast();

  useEffect(() => {
    async function fetchTx() {
      try {
        const res = await fetch(`${API_BASE}/api/transactions`);
        const data = await res.json();
        setTransactions(Array.isArray(data) ? data : []);
      } catch {
        addToast('Failed to load transactions', 'error');
      } finally {
        setLoading(false);
      }
    }
    fetchTx();
  }, []);

  const filtered = useMemo(() => {
    return transactions.filter(tx => {
      const matchType = typeFilter === 'all' || tx.type === typeFilter;
      const matchSearch = tx.description.toLowerCase().includes(search.toLowerCase());
      return matchType && matchSearch;
    });
  }, [transactions, typeFilter, search]);

  const totalCredits = useMemo(() => filtered.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0), [filtered]);
  const totalDebits = useMemo(() => filtered.filter(t => t.type === 'debit').reduce((s, t) => s + t.amount, 0), [filtered]);

  return (
    <div className="page-container fade-in">
      <h1 className="page-title">Transaction History</h1>

      <div className="summary-bar">
        <div className="summary-item credit">
          <span className="summary-label">Total Credits</span>
          <span className="summary-value">{formatPKR(totalCredits)}</span>
        </div>
        <div className="summary-item debit">
          <span className="summary-label">Total Debits</span>
          <span className="summary-value">{formatPKR(totalDebits)}</span>
        </div>
        <div className="summary-item net">
          <span className="summary-label">Net Balance</span>
          <span className={`summary-value ${totalCredits - totalDebits >= 0 ? 'positive' : 'negative'}`}>
            {formatPKR(totalCredits - totalDebits)}
          </span>
        </div>
      </div>

      <div className="filter-bar">
        <input
          className="search-input"
          type="text"
          placeholder="Search transactions…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="type-filters">
          {['all', 'credit', 'debit'].map(f => (
            <button
              key={f}
              className={`filter-btn ${typeFilter === f ? 'active' : ''}`}
              onClick={() => setTypeFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="tx-list">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
          : filtered.length === 0
            ? <p className="empty-state">No transactions found.</p>
            : filtered.map((tx, i) => (
              <div
                key={tx.id}
                className={`tx-card slide-in`}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <span className={`tx-icon ${tx.type}`}>
                  {tx.type === 'credit' ? '↑' : '↓'}
                </span>
                <div className="tx-info">
                  <p className="tx-desc">{tx.description}</p>
                  <p className="tx-date">{formatDate(tx.timestamp)}</p>
                </div>
                <div className="tx-right">
                  <span className={`tx-amount ${tx.type}`}>
                    {tx.type === 'credit' ? '+' : '-'}{formatPKR(tx.amount)}
                  </span>
                  <span className={`tx-badge ${tx.type}`}>{tx.type}</span>
                </div>
              </div>
            ))
        }
      </div>
    </div>
  );
}
