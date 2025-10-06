// utils/emailService.js
import nodemailer from 'nodemailer';

// --- Configuration (Replace with your actual data) ---
// NOTE: Use environment variables in a production app!
const EMAIL_USER = 'santhosh@cybomb.com'; 
const EMAIL_PASS = 'Starboy@123'; // Generate an App Password for Gmail
const MANAGEMENT_EMAIL = 'sancybomb@gmail.com';
const SENDER_NAME = 'Billing Pro Inventory Manager';

const transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com', // Your SMTP host
  port: 587,                   // TLS port
  secure: false,               // false for TLS on port 587
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // sometimes required for self-signed certs
  },
});

// ----------------------------------------------------


/**
 * Sends a restock notification email.
 * @param {object} product - The product object.
 * @param {number} currentStock - The stock before restock.
 * @param {number} restockAmount - The quantity added.
 */
export const sendRestockNotification = async (product, currentStock, restockAmount) => {
  const mailOptions = {
    from: `${SENDER_NAME} <${EMAIL_USER}>`,
    to: MANAGEMENT_EMAIL,
    subject: `✅ Inventory Restock Alert: ${product.name} Updated`,
    html: `<h2>Stock Restock Notification</h2> ...`, // your existing HTML
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Restock Notification sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending restock notification email:', error);
  }
};



/**
 * Sends an auto-generated low-stock notification/restock order suggestion.
 * @param {object} product - The product object.
 */
export const sendLowStockOrderSuggestion = async (product) => {
  const mailOptions = {
    from: `${SENDER_NAME} <${EMAIL_USER}>`,
    to: MANAGEMENT_EMAIL,
    subject: `⚠️ LOW STOCK / RESTOCK ORDER REQUIRED: ${product.name}`,
    html: `
      <h2>Urgent Low Stock Alert!</h2>
      <p>The following product has fallen below its minimum threshold and requires a purchase order:</p>
      <table style="border: 1px solid #ccc; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #f9e6e6;">
            <th style="padding: 8px; border: 1px solid #ccc;">Field</th>
            <th style="padding: 8px; border: 1px solid #ccc;">Detail</th>
          </tr>
        </thead>
        <tbody>
          <tr><td style="padding: 8px; border: 1px solid #ccc;">Product Name</td><td style="padding: 8px; border: 1px solid #ccc;">${product.name}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ccc;">SKU</td><td style="padding: 8px; border: 1px solid #ccc;">${product.sku || 'N/A'}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ccc;">Current Stock</td><td style="padding: 8px; border: 1px solid #ccc; color: red; font-weight: bold;">${product.stock} units</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ccc;">Threshold</td><td style="padding: 8px; border: 1px solid #ccc;">${product.lowStockThreshold} units</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ccc; font-weight: bold;">Cost Price (Per Unit)</td><td style="padding: 8px; border: 1px solid #ccc; font-weight: bold;">$${product.costPrice ? product.costPrice.toFixed(2) : 'N/A'}</td></tr>
        </tbody>
      </table>
      <p style="margin-top: 20px;">Please create a restock order immediately.</p>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Low Stock Notification sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending low stock email:', error);
  }
};