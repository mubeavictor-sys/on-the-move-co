const express = require('express');
const router = express.Router();
const { getPaymentSettings, confirmManualPayment, initiatePayment, handleCallback, verifyManualPayment } = require('../controllers/paymentController');
const { auth, authorize } = require('../middleware/authMiddleware');

router.get('/settings', getPaymentSettings);
router.post('/confirm-manual', auth, confirmManualPayment);
router.post('/stk-push', auth, initiatePayment);
router.post('/callback', handleCallback);
router.post('/verify/:id', auth, authorize('admin'), verifyManualPayment);

module.exports = router;
