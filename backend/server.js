const express = require('express');
const cors = require('cors');
const walletRouter = require('./routes/wallet');
const loansRouter = require('./routes/loans');

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Routes
app.use('/api', walletRouter);
app.use('/api', loansRouter);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'FintechFlow API is running', version: '1.0.0' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`FintechFlow backend running on port ${PORT}`);
});
