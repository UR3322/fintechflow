import React, { useState } from 'react';
import { useCountUp } from '../hooks/useCountUp';
import { useToast } from '../context/AppContext';
import { formatPKR, API_BASE } from '../utils/helpers';

function StatCard({ label, value }) {
  const animated = useCountUp(Math.round(value));
  return (
    <div className="stat-card fade-in">
      <p className="stat-label">{label}</p>
      <p className="stat-value">{formatPKR(animated)}</p>
    </div>
  );
}

export default function EMICalculator() {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [months, setMonths] = useState('');
  const [result, setResult] = useState(null);
  const [amortization, setAmortization] = useState([]);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  async function calculate(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE}/api/emi-calculator?principal=${principal}&annualRate=${rate}&months=${months}`
      );
      const data = await res.json();
      if (!res.ok) { addToast(data.error, 'error'); setLoading(false); return; }
      setResult(data);

      // Build amortization table on frontend using server EMI
      const emi = data.emi;
      const monthlyRate = parseFloat(rate) / 100 / 12;
      let remaining = parseFloat(principal);
      const table = [];
      for (let m = 1; m <= parseInt(months); m++) {
        const interest = remaining * monthlyRate;
        const principalComp = emi - interest;
        remaining = Math.max(remaining - principalComp, 0);
        table.push({
          month: m,
          interest: parseFloat(interest.toFixed(2)),
          principal: parseFloat(principalComp.toFixed(2)),
          remaining: parseFloat(remaining.toFixed(2))
        });
      }
      setAmortization(table);
    } catch {
      addToast('Network error', 'error');
    } finally {
      setLoading(false);
    }
  }

  const principalPct = result ? ((result.principal / result.totalPayable) * 100).toFixed(1) : 0;
  const interestPct = result ? ((result.totalInterest / result.totalPayable) * 100).toFixed(1) : 0;

  return (
    <div className="page-container fade-in">
      <h1 className="page-title">EMI Calculator</h1>

      <form className="emi-form" onSubmit={calculate}>
        <div className="emi-inputs">
          <div className="field-group">
            <label className="field-label">Principal (PKR)</label>
            <input className="form-input" type="number" placeholder="100000" value={principal} onChange={e => setPrincipal(e.target.value)} required min="1" />
          </div>
          <div className="field-group">
            <label className="field-label">Annual Interest Rate (%)</label>
            <input className="form-input" type="number" step="0.1" placeholder="12" value={rate} onChange={e => setRate(e.target.value)} required min="0.1" />
          </div>
          <div className="field-group">
            <label className="field-label">Tenure (months)</label>
            <input className="form-input" type="number" placeholder="12" value={months} onChange={e => setMonths(e.target.value)} required min="1" />
          </div>
        </div>
        <button className="btn btn-deposit emi-btn" type="submit" disabled={loading}>
          {loading ? 'Calculating…' : 'Calculate EMI'}
        </button>
      </form>

      {result && (
        <>
          <div className="stat-cards-row">
            <StatCard label="Monthly EMI" value={result.emi} />
            <StatCard label="Total Payable" value={result.totalPayable} />
            <StatCard label="Total Interest" value={result.totalInterest} />
          </div>

          <div className="breakdown-bar-wrap">
            <p className="breakdown-title">Principal vs Interest Breakdown</p>
            <div className="breakdown-bar">
              <div className="breakdown-principal" style={{ width: `${principalPct}%` }}>
                Principal {principalPct}%
              </div>
              <div className="breakdown-interest" style={{ width: `${interestPct}%` }}>
                Interest {interestPct}%
              </div>
            </div>
          </div>

          <div className="amortization-wrap fade-in">
            <h3 className="section-title">Amortization Schedule</h3>
            <div className="amortization-table-container">
              <table className="amortization-table">
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Principal</th>
                    <th>Interest</th>
                    <th>Remaining Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {amortization.map((row, i) => (
                    <tr key={row.month} className={i % 2 === 0 ? 'row-even' : 'row-odd'} style={{ animationDelay: `${i * 20}ms` }}>
                      <td>{row.month}</td>
                      <td className="positive">{formatPKR(row.principal)}</td>
                      <td className="negative">{formatPKR(row.interest)}</td>
                      <td>{formatPKR(row.remaining)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
