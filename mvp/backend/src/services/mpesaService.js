const axios = require('axios');
require('dotenv').config();

const getAccessToken = async () => {
  const consumer_key = process.env.MPESA_CONSUMER_KEY;
  const consumer_secret = process.env.MPESA_CONSUMER_SECRET;
  const auth = Buffer.from(`${consumer_key}:${consumer_secret}`).toString('base64');

  try {
    const response = await axios.get(
      'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error('M-Pesa Access Token Error:', error.response ? error.response.data : error.message);
    throw new Error('Failed to get M-Pesa access token');
  }
};

const initiateSTKPush = async (phone, amount, errandId) => {
    const token = await getAccessToken();
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
    const password = Buffer.from(
      `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
    ).toString('base64');
  
    // Normalize phone number to 254...
    let formattedPhone = phone;
    if (phone.startsWith('0')) {
        formattedPhone = '254' + phone.slice(1);
    } else if (phone.startsWith('+')) {
        formattedPhone = phone.slice(1);
    }

    const data = {
      BusinessShortCode: process.env.MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: formattedPhone,
      PartyB: process.env.MPESA_SHORTCODE,
      PhoneNumber: formattedPhone,
      CallBackURL: process.env.MPESA_CALLBACK_URL,
      AccountReference: `Errand-${errandId.slice(0, 8)}`,
      TransactionDesc: 'Errand payment',
    };
  
    try {
      const response = await axios.post(
        'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
       console.error('M-Pesa STK Push Error:', error.response ? error.response.data : error.message);
       throw new Error('Failed to initiate STK Push');
    }
  };

module.exports = {
  getAccessToken,
  initiateSTKPush,
};

