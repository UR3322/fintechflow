const express = require('express');
const router = express.Router();

// In-memory loans store
let loans = [
  {
    id: 'LN-001',
    applicant: 'Ali Hassan',
    cnic: '35202-1234567-1',
    contact: '0300-1234567',
    amount: 100000,
    purpose: 'Business',
    tenure: 12,
    status: 'approved',
    appliedAt: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: 'LN-002',
    applicant: 'Sara Khan',
    cnic: '35202-7654321-2',
    contact: '0311-9876543',
    amount: 50000,
    purpose: 'Education',
    tenure: 24,
    status: 'pending',
    appliedAt: new Date(Date.now() - 86400000 * 2).toISOString()
  }
];

let loanIdCounter = 3;

function generateLoanId() {
  return `LN-${String(loanIdCounter++).padStart(3, '0')}`;
}

// POST /api/loans/apply
router.post('/loans/apply', (req, res) => {
  const { applicant, cnic, contact, amount, purpose, tenure } = req.body;

  if (!applicant || typeof applicant !== 'string' || applicant.trim() === '') {
    return res.status(400).json({ error: 'applicant name is required' });
  }
  if (!cnic || typeof cnic !== 'string' || cnic.trim() === '') {
    return res.status(400).json({ error: 'CNIC is required' });
  }
  const cnicRegex = /^\d{5}-\d{7}-\d{1}$/;
  if (!cnicRegex.test(cnic.trim())) {
    return res.status(400).json({ error: 'CNIC must be in format XXXXX-XXXXXXX-X' });
  }
  if (!contact || typeof contact !== 'string' || contact.trim() === '') {
    return res.status(400).json({ error: 'contact number is required' });
  }
  if (amount === undefined || amount === null) {
    return res.status(400).json({ error: 'amount is required' });
  }
  if (typeof amount !== 'number' || amount < 5000 || amount > 5000000) {
    return res.status(400).json({ error: 'amount must be between PKR 5,000 and PKR 5,000,000' });
  }
  const validPurposes = ['Business', 'Education', 'Medical', 'Personal'];
  if (!purpose || !validPurposes.includes(purpose)) {
    return res.status(400).json({ error: `purpose must be one of: ${validPurposes.join(', ')}` });
  }
  if (tenure === undefined || tenure === null) {
    return res.status(400).json({ error: 'tenure is required' });
  }
  if (typeof tenure !== 'number' || tenure < 3 || tenure > 60) {
    return res.status(400).json({ error: 'tenure must be between 3 and 60 months' });
  }

  const loan = {
    id: generateLoanId(),
    applicant: applicant.trim(),
    cnic: cnic.trim(),
    contact: contact.trim(),
    amount,
    purpose,
    tenure,
    status: 'pending',
    appliedAt: new Date().toISOString()
  };

  loans.unshift(loan);

  res.status(201).json({
    message: 'Loan application submitted successfully',
    loan
  });
});

// GET /api/loans
router.get('/loans', (req, res) => {
  res.json(loans);
});

// PATCH /api/loans/:id/status
router.patch('/loans/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['approved', 'rejected'];
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ error: 'status must be "approved" or "rejected"' });
  }

  const loanIndex = loans.findIndex(l => l.id === id);
  if (loanIndex === -1) {
    return res.status(404).json({ error: `Loan with id "${id}" not found` });
  }

  loans[loanIndex].status = status;
  loans[loanIndex].updatedAt = new Date().toISOString();

  res.json({
    message: `Loan ${id} has been ${status}`,
    loan: loans[loanIndex]
  });
});

// GET /api/emi-calculator
router.get('/emi-calculator', (req, res) => {
  const { principal, annualRate, months } = req.query;

  if (!principal || !annualRate || !months) {
    return res.status(400).json({ error: 'principal, annualRate, and months are all required as query parameters' });
  }

  const P = parseFloat(principal);
  const annualRateNum = parseFloat(annualRate);
  const n = parseInt(months);

  if (isNaN(P) || P <= 0) {
    return res.status(400).json({ error: 'principal must be a positive number' });
  }
  if (isNaN(annualRateNum) || annualRateNum <= 0) {
    return res.status(400).json({ error: 'annualRate must be a positive number (e.g., 12 for 12%)' });
  }
  if (isNaN(n) || n < 1) {
    return res.status(400).json({ error: 'months must be a positive integer' });
  }

  const r = annualRateNum / 100 / 12;
  const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const totalPayable = emi * n;
  const totalInterest = totalPayable - P;

  res.json({
    emi: parseFloat(emi.toFixed(2)),
    totalPayable: parseFloat(totalPayable.toFixed(2)),
    totalInterest: parseFloat(totalInterest.toFixed(2)),
    principal: P,
    annualRate: annualRateNum,
    months: n
  });
});

module.exports = router;
