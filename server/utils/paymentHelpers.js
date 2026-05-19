import crypto from 'crypto';

// Generate unique product ID
export const generateProductId = (userId) => {
  const random = crypto.randomBytes(4).toString('hex');
  return `SYN-${Date.now()}-${random}`;
};

// Generate eSewa HMAC SHA256 signature
export const generateEsewaSignature = (secretKey, message) => {
  const hmac = crypto.createHmac('sha256', secretKey);
  hmac.update(message);
  return hmac.digest('base64');
};

// Calculate subscription end date
export const calculateEndDate = (billingCycle) => {
  const date = new Date();
  if (billingCycle === 'yearly') {
    date.setFullYear(date.getFullYear() + 1);
  } else {
    date.setMonth(date.getMonth() + 1);
  }
  return date;
};