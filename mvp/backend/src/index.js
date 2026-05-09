const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/errands', require('./routes/errandRoutes'));
app.use('/api/v1/payments', require('./routes/paymentRoutes'));
app.use('/api/v1/runners', require('./routes/runnerRoutes'));

// Basic Route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to On The Move Co. API' });
});

const { runAutoComplete } = require('./controllers/errandController');

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  
  // Run auto-complete check every 15 minutes
  setInterval(runAutoComplete, 15 * 60 * 1000);
});
