require('dotenv').config();

module.exports = {
  PAYMENT_MODE: process.env.PAYMENT_MODE || 'paybill', // 'paybill' or 'daraja'
  PAYBILL_NUMBER: process.env.PAYBILL_NUMBER || '0740761815', // Fallback to owner number as requested
  PAYBILL_ACCOUNT_PREFIX: process.env.PAYBILL_ACCOUNT_PREFIX || 'ONTHEMOVE',
};
