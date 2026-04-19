import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../context/AppContext';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="brand-icon">◈</span>
        <span className="brand-name">FintechFlow</span>
      </div>
      <ul className="navbar-links">
        <li><NavLink to="/" end>Wallet</NavLink></li>
        <li><NavLink to="/transactions">Transactions</NavLink></li>
        <li><NavLink to="/loans/apply">Apply Loan</NavLink></li>
        <li><NavLink to="/loans">Loan Status</NavLink></li>
        <li><NavLink to="/emi">EMI Calc</NavLink></li>
      </ul>
      <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
        {theme === 'dark' ? '☀' : '◑'}
      </button>
    </nav>
  );
}
