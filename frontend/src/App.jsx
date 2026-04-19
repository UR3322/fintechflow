import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider, ThemeProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import WalletDashboard from './pages/WalletDashboard';
import TransactionHistory from './pages/TransactionHistory';
import LoanApply from './pages/LoanApply';
import LoanStatus from './pages/LoanStatus';
import EMICalculator from './pages/EMICalculator';

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <BrowserRouter>
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<WalletDashboard />} />
              <Route path="/transactions" element={<TransactionHistory />} />
              <Route path="/loans/apply" element={<LoanApply />} />
              <Route path="/loans" element={<LoanStatus />} />
              <Route path="/emi" element={<EMICalculator />} />
            </Routes>
          </main>
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  );
}
