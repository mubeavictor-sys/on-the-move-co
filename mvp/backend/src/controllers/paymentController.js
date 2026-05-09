const { initiateSTKPush } = require('../services/mpesaService');
const db = require('../config/db');
const paymentConfig = require('../config/payment');

const getPaymentSettings = async (req, res) => {
  res.json({
    mode: paymentConfig.PAYMENT_MODE,
    paybillNumber: paymentConfig.PAYBILL_NUMBER,
    accountPrefix: paymentConfig.PAYBILL_ACCOUNT_PREFIX,
  });
};

const confirmManualPayment = async (req, res) => {
    const { errandId, transactionReference } = req.body;
    const customer_id = req.user.id;

    try {
        await db.query(
            "UPDATE errands SET payment_status = 'pending_verification', mpesa_receipt_number = $1 WHERE id = $2 AND customer_id = $3",
            [transactionReference, errandId, customer_id]
        );
        
        // Log the action
        await db.query(
            'INSERT INTO errand_logs (errand_id, status, updated_by) VALUES ($1, $2, $3)',
            [errandId, 'payment_submitted', customer_id]
        );

        res.json({ message: 'Payment confirmation submitted for verification' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to submit payment confirmation' });
    }
};

const initiatePayment = async (req, res) => {
  const { errandId, phone, amount } = req.body;

  if (paymentConfig.PAYMENT_MODE === 'paybill') {
      return res.status(400).json({ message: 'STK Push is disabled in Paybill mode. Please confirm payment manually.' });
  }

  try {
    const mpesaResponse = await initiateSTKPush(phone, amount, errandId);
    
    // Store CheckoutRequestID in the errand record to track it
    await db.query(
      'UPDATE errands SET mpesa_checkout_id = $1 WHERE id = $2',
      [mpesaResponse.CheckoutRequestID, errandId]
    );

    res.json({
      message: 'STK Push initiated successfully',
      checkoutRequestId: mpesaResponse.CheckoutRequestID,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to initiate payment' });
  }
};

const handleCallback = async (req, res) => {
  const { Body } = req.body;
  const { stkCallback } = Body;

  console.log('M-Pesa Callback received:', JSON.stringify(req.body));

  if (stkCallback.ResultCode === 0) {
    const checkoutRequestId = stkCallback.CheckoutRequestID;
    const mpesaReceiptNumber = stkCallback.CallbackMetadata.Item.find(
      (item) => item.Name === 'MpesaReceiptNumber'
    ).Value;

    try {
      await db.query(
        "UPDATE errands SET payment_status = 'completed', mpesa_receipt_number = $1 WHERE mpesa_checkout_id = $2",
        [mpesaReceiptNumber, checkoutRequestId]
      );
      console.log(`Payment successful for CheckoutRequestID: ${checkoutRequestId}`);
    } catch (error) {
      console.error('Error updating payment status:', error);
    }
  } else {
    console.log(`Payment failed for CheckoutRequestID: ${stkCallback.CheckoutRequestID}. ResultCode: ${stkCallback.ResultCode}`);
    // Optionally update status to failed
  }

  res.json({ ResultCode: 0, ResultDesc: 'Success' });
};

const verifyManualPayment = async (req, res) => {
    const { id } = req.params;
    const admin_id = req.user.id;

    try {
        await db.query(
            "UPDATE errands SET payment_status = 'completed' WHERE id = $1",
            [id]
        );

        await db.query(
            'INSERT INTO errand_logs (errand_id, status, updated_by) VALUES ($1, $2, $3)',
            [id, 'assigned', admin_id] // Moving to assigned once paid
        );

        res.json({ message: 'Payment verified and errand updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to verify payment' });
    }
};

module.exports = {
  getPaymentSettings,
  confirmManualPayment,
  initiatePayment,
  handleCallback,
  verifyManualPayment,
};
