const express = require('express');
const router = express.Router();

// In-memory data store
let wallet = {
  balance: 50000,
  currency: 'PKR',
  owner: 'Demo User'
};

let transactions = [
  { id: 1, type: 'credit', amount: 50000, timestamp: new Date(Date.now() - 86400000 * 3).toISOString(), description: 'Initial deposit' },
  { id: 2, type: 'debit', amount: 5000, timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), description: 'Utility bill payment' },
  { id: 3, type: 'credit', amount: 12000, timestamp: new Date(Date.now() - 86400000).toISOString(), description: 'Salary credit' },
];

let txIdCounter = 4;

// GET /api/wallet
router.get('/wallet', (req, res) => {
  res.json(wallet);
});

// POST /api/wallet/deposit
router.post('/wallet/deposit', (req, res) => {
  const { amount } = req.body;

  if (amount === undefined || amount === null) {
    return res.status(400).json({ error: 'amount is required' });
  }
  if (typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ error: 'amount must be a positive number greater than 0' });
  }

  wallet.balance += amount;

  const tx = {
    id: txIdCounter++,
    type: 'credit',
    amount,
    timestamp: new Date().toISOString(),
    description: `Deposit of PKR ${amount.toLocaleString()}`
  };
  transactions.unshift(tx);

  res.json({
    message: 'Deposit successful',
    wallet,
    transaction: tx
  });
});

// POST /api/wallet/withdraw
router.post('/wallet/withdraw', (req, res) => {
  const { amount } = req.body;

  if (amount === undefined || amount === null) {
    return res.status(400).json({ error: 'amount is required' });
  }
  if (typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ error: 'amount must be a positive number greater than 0' });
  }
  if (wallet.balance - amount < 0) {
    return res.status(400).json({ error: 'Insufficient funds. Current balance: PKR ' + wallet.balance });
  }

  wallet.balance -= amount;

  const tx = {
    id: txIdCounter++,
    type: 'debit',
    amount,
    timestamp: new Date().toISOString(),
    description: `Withdrawal of PKR ${amount.toLocaleString()}`
  };
  transactions.unshift(tx);

  res.json({
    message: 'Withdrawal successful',
    wallet,
    transaction: tx
  });
});

// GET /api/transactions
router.get('/transactions', (req, res) => {
  const { type } = req.query;

  let result = [...transactions].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  if (type) {
    const validTypes = ['credit', 'debit'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ error: 'type must be "credit" or "debit"' });
    }
    result = result.filter(t => t.type === type);
  }

  res.json(result);
});

module.exports = router;
module.exports.getTransactions = () => transactions;
