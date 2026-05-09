const db = require('../config/db');
const owner = require('../config/owner');
const QRCode = require('qrcode');

const generateInvoice = async (errandId) => {
  let client;
  try {
    client = await db.pool.connect();
    let invoiceNumber;
    
    try {
      await client.query('BEGIN');
      
      const year = new Date().getFullYear();
      
      // Atomically increment and get the next number
      const counterResult = await client.query(
        "UPDATE invoice_counter SET last_number = last_number + 1 WHERE id = 'single' RETURNING last_number"
      );
      
      if (counterResult.rows.length === 0) {
        throw new Error('Invoice counter not initialized');
      }
      
      const nextNumber = counterResult.rows[0].last_number;
      invoiceNumber = `INV-${year}-${nextNumber.toString().padStart(5, '0')}`;
      
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }

    const errandResult = await db.query(
      'SELECT e.*, u.full_name, u.phone, u.kra_pin FROM errands e JOIN users u ON e.customer_id = u.id WHERE e.id = $1',
      [errandId]
    );
    
    if (errandResult.rows.length === 0) {
      throw new Error(`Errand with id ${errandId} not found`);
    }
    
    const errand = errandResult.rows[0];

    const amount = parseFloat(errand.estimated_price);
    const vat = amount * 0.16; // 16% VAT in Kenya
    const total = amount + vat;

    // Generate QR Code data (for KRA compliance placeholder)
    const qrData = JSON.stringify({
      invoiceNumber,
      date: new Date().toISOString(),
      total: total.toFixed(2),
      ownerPIN: owner.OWNER_KRA_PIN,
      customerPIN: errand.kra_pin || 'N/A'
    });
    const qrCodeDataUrl = await QRCode.toDataURL(qrData);

    const result = await db.query(
      'INSERT INTO invoices (errand_id, invoice_number, amount, vat, total, pdf_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [errandId, invoiceNumber, amount, vat, total, qrCodeDataUrl]
    );

    console.log(`Invoice generated: ${invoiceNumber}`);
    
    return {
      ...result.rows[0],
      owner,
      qrCodeDataUrl
    };
  } catch (error) {
    console.error('Invoice Generation Error:', error);
    throw error;
  }
};

module.exports = {
  generateInvoice,
};
