const axios = require('axios');
require('dotenv').config();

const sendSMS = async (to, message) => {
  const username = process.env.AFRICASTALKING_USERNAME;
  const apiKey = process.env.AFRICASTALKING_API_KEY;

  // Normalize phone number
  let formattedPhone = to;
  if (to.startsWith('0')) {
      formattedPhone = '+254' + to.slice(1);
  } else if (!to.startsWith('+')) {
      formattedPhone = '+' + to;
  }

  const data = new URLSearchParams();
  data.append('username', username);
  data.append('to', formattedPhone);
  data.append('message', message);

  try {
    const response = await axios.post(
      'https://api.africastalking.com/version1/messaging',
      data,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          'apiKey': apiKey,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('SMS Send Error:', error.response ? error.response.data : error.message);
    // Don't throw, just log to prevent breaking the flow
  }
};

module.exports = {
  sendSMS,
};
