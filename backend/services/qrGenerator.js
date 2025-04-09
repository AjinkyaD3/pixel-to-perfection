const QRCode = require('qrcode');
const crypto = require('crypto');
const logger = require('../utils/logger');

/**
 * Generate a unique QR code for event registration
 * @param {string} registrationId - The registration ID
 * @param {string} eventId - The event ID
 * @param {string} studentId - The student ID
 * @returns {Promise<string>} The QR code data URL
 */
const generateQRCode = async (registrationId, eventId, studentId) => {
  try {
    // Create a unique token for the QR code
    const token = crypto
      .createHash('sha256')
      .update(`${registrationId}-${eventId}-${studentId}-${Date.now()}`)
      .digest('hex');

    // Create QR code data
    const qrData = JSON.stringify({
      registrationId,
      eventId,
      studentId,
      token,
      timestamp: Date.now()
    });

    // Generate QR code as data URL
    const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 300,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });

    return qrCodeDataUrl;
  } catch (error) {
    logger.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
};

/**
 * Generate a QR code as a buffer for event registration
 * @param {string} registrationId - The registration ID
 * @param {string} eventId - The event ID
 * @param {string} studentId - The student ID
 * @returns {Promise<Buffer>} The QR code buffer
 */
const generateQRCodeBuffer = async (registrationId, eventId, studentId) => {
  try {
    // Create a unique token for the QR code
    const token = crypto
      .createHash('sha256')
      .update(`${registrationId}-${eventId}-${studentId}-${Date.now()}`)
      .digest('hex');

    // Create QR code data
    const qrData = JSON.stringify({
      registrationId,
      eventId,
      studentId,
      token,
      timestamp: Date.now()
    });

    // Generate QR code as buffer
    const qrCodeBuffer = await QRCode.toBuffer(qrData, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 300,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });

    return qrCodeBuffer;
  } catch (error) {
    logger.error('Error generating QR code buffer:', error);
    throw new Error('Failed to generate QR code buffer');
  }
};

/**
 * Verify a QR code token
 * @param {string} token - The QR code token to verify
 * @param {Object} data - The QR code data
 * @returns {boolean} Whether the token is valid
 */
const verifyQRCode = (token, data) => {
  try {
    const generatedToken = crypto
      .createHash('sha256')
      .update(`${data.registrationId}-${data.eventId}-${data.studentId}-${data.timestamp}`)
      .digest('hex');

    return token === generatedToken;
  } catch (error) {
    logger.error('Error verifying QR code:', error);
    throw new Error('Failed to verify QR code');
  }
};

module.exports = {
  generateQRCode,
  generateQRCodeBuffer,
  verifyQRCode
}; 