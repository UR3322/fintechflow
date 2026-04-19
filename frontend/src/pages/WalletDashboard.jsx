import React, { useState, useEffect } from 'react';
import { useCountUp } from '../hooks/useCountUp';
import { useToast } from '../context/AppContext';
import { formatPKR, API_BASE } from '../utils/helpers';

export default function WalletDashboard() {
  const [wallet, setWallet] = useState(null);
  const [depositAmt, setDepositAmt] = useState('');
  const [withdrawAmt, setWithdrawAmt] = useState('');
  const [loading, setLoading] = useState(true);
  const [pulse, setPulse] = useState('');
  const { addToast } = useToast();

  const displayBalance = useCountUp(wallet?.balance ?? 0);

  useEffect(() => {
    fetchWallet();
  }, []);

  async function fetchWallet() {
    try {
      const res = await fetch(`${API_BASE}/api/wallet`);
      const data = await res.json();
      setWallet(data);
    } catch {
      addToast('Failed to load wallet', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function handleDeposit(e) {
    e.preventDefault();
    const amount = parseFloat(depositAmt);
    try {
      const res = await fetch(`${API_BASE}/api/wallet/deposit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount })
      });
      const data = await res.json();
      if (!res.ok) { addToast(data.error, 'error'); triggerShake('deposit'); return; }
      setWallet(data.wallet);
      setPulse('green');
      setTimeout(() => setPulse(''), 700);
      addToast(`Deposited ${formatPKR(amount)} successfully!`, 'success');
      setDepositAmt('');
    } catch {
      addToast('Network error', 'error');
    }
  }

  async function handleWithdraw(e) {
    e.preventDefault();
    const amount = parseFloat(withdrawAmt);
    try {
      const res = await fetch(`${API_BASE}/api/wallet/withdraw`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount })
      });
      const data = await res.json();
      if (!res.ok) { addToast(data.error, 'error'); triggerShake('withdraw'); return; }
      setWallet(data.wallet);
      setPulse('red');
      setTimeout(() => setPulse(''), 700);
      addToast(`Withdrew ${formatPKR(amount)} successfully!`, 'success');
      setWithdrawAmt('');
    } catch {
      addToast('Network error', 'error');
    }
  }

  const [shakeField, setShakeField] = useState('');
  function triggerShake(field) {
    setShakeField(field);
    setTimeout(() => setShakeField(''), 600);
  }

  if (loading) return (
    <div className="page-container">
      <div className="balance-card skeleton-card" style={{ height: 180 }} />
      <div className="forms-row">
        <div className="skeleton-card" style={{ height: 160, flex: 1 }} />
        <div className="skeleton-card" style={{ height: 160, flex: 1 }} />
      </div>
    </div>
  );

  return (
    <div className="page-container fade-in">
      <h1 className="page-title">Wallet</h1>

      <div className={`balance-card ${pulse === 'green' ? 'pulse-green' : ''} ${pulse === 'red' ? 'pulse-red' : ''}`}>
        <p className="balance-label">Available Balance</p>
        <p className="balance-amount">{formatPKR(displayBalance)}</p>
        <p className="balance-meta">{wallet.currency} · {wallet.owner}</p>
      </div>

      <div className="forms-row">
        <form className={`action-form ${shakeField === 'deposit' ? 'shake' : ''}`} onSubmit={handleDeposit}>
          <h3 className="form-title deposit-title">↑ Deposit</h3>
          <input
            className="form-input"
            type="number"
            placeholder="Amount in PKR"
            value={depositAmt}
            onChange={e => setDepositAmt(e.target.value)}
            min="1"
            required
          />
          <button className="btn btn-deposit" type="submit">Deposit Funds</button>
        </form>

        <form className={`action-form ${shakeField === 'withdraw' ? 'shake' : ''}`} onSubmit={handleWithdraw}>
          <h3 className="form-title withdraw-title">↓ Withdraw</h3>
          <input
            className="form-input"
            type="number"
            placeholder="Amount in PKR"
            value={withdrawAmt}
            onChange={e => setWithdrawAmt(e.target.value)}
            min="1"
            required
          />
          <button className="btn btn-withdraw" type="submit">Withdraw Funds</button>
        </form>
      </div>
    </div>
  );
}
