const QRCode = require('qrcode');
const crypto = require('crypto');

class QRCodeService {
  static async generateQRCode(eventId) {
    try {
      // Generate a unique token for the event
      const token = crypto.randomBytes(32).toString('hex');
      
      // Create QR code data
      const qrData = JSON.stringify({
        eventId,
        token,
        timestamp: Date.now()
      });

      // Generate QR code image
      const qrCode = await QRCode.toDataURL(qrData);
      
      return {
        qrCode,
        token
      };
    } catch (error) {
      throw new Error('Failed to generate QR code');
    }
  }

  static verifyQRCode(qrData, eventId) {
    try {
      const data = JSON.parse(qrData);
      
      // Verify event ID
      if (data.eventId !== eventId) {
        return false;
      }

      // Verify timestamp (QR code expires after 24 hours)
      const now = Date.now();
      const qrTimestamp = data.timestamp;
      const timeDiff = now - qrTimestamp;
      
      if (timeDiff > 24 * 60 * 60 * 1000) { // 24 hours in milliseconds
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  static async generateCheckInQRCode(eventId, studentId) {
    try {
      // Generate a unique token for the check-in
      const token = crypto.randomBytes(32).toString('hex');
      
      // Create QR code data
      const qrData = JSON.stringify({
        eventId,
        studentId,
        token,
        timestamp: Date.now()
      });

      // Generate QR code image
      const qrCode = await QRCode.toDataURL(qrData);
      
      return {
        qrCode,
        token
      };
    } catch (error) {
      throw new Error('Failed to generate check-in QR code');
    }
  }

  static verifyCheckInQRCode(qrData, eventId, studentId) {
    try {
      const data = JSON.parse(qrData);
      
      // Verify event ID and student ID
      if (data.eventId !== eventId || data.studentId !== studentId) {
        return false;
      }

      // Verify timestamp (QR code expires after 1 hour)
      const now = Date.now();
      const qrTimestamp = data.timestamp;
      const timeDiff = now - qrTimestamp;
      
      if (timeDiff > 60 * 60 * 1000) { // 1 hour in milliseconds
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  }
}

module.exports = QRCodeService; 