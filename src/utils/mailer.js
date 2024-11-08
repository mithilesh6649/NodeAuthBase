const config = require('../config/config');
const nodemailer = require('nodemailer');

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    host: config.mailer.MAIL_HOST, // SMTP host (e.g., Gmail or custom SMTP server)
    port: config.mailer.MAIL_PORT, // SMTP port (usually 587 or 465 for secure email)
    secure: false, // config.mailer.MAIL_ENCRYPTION, // Use TLS/SSL
    auth: {
        user: config.mailer.MAIL_USERNAME, // Your email address (sender)
        pass: config.mailer.MAIL_PASSWORD, // Your email password or app-specific password
    }
});

/**
 * Function to send verification email
 * @param {string} userEmail - The recipient's email address
 * @param {string} verificationLink - The verification URL to be included in the email
 * @returns {Promise} Resolves when the email is sent
 */
const sendVerificationEmail = (userEmail, verificationLink) => {
    // Setup email data
    const mailOptions = {
        from: config.mailer.MAIL_FROM_ADDRESS, // Sender's email address
        to: userEmail, // Recipient's email address
        subject: 'Email Verification', // Email subject
        html: `
            <h1>Email Verification</h1>
            <p>Thank you for registering! Please click the link below to verify your email address:</p>
            <a href="${verificationLink}">Verify Email</a>
            <p>If you didn't sign up for this account, please ignore this email.</p>
        `, // HTML body of the email (you can use a template engine for better formatting)
    };

    // Send the email
    return transporter.sendMail(mailOptions)
        .then(info => {
            console.log('Verification email sent:', info.response);
            return info; // Resolve with the result
        })
        .catch(error => {
            console.error('Error sending email:', error);
            throw error; // Reject with error if sending fails
        });
};

module.exports = {
    sendVerificationEmail
};