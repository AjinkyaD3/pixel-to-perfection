const nodemailer = require('nodemailer');
const logger = require('./logger');

const sendEmail = async (options) => {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: options.to,
      subject: options.subject,
      html: options.html
    };

    // Send email
    await transporter.sendMail(mailOptions);
    logger.info(`Email sent to ${options.to}`);
  } catch (error) {
    logger.error('Error sending email:', error);
    throw new Error('Email could not be sent');
  }
};

module.exports = sendEmail; 