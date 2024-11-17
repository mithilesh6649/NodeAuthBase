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
        <html>
            <body style="font-family: Arial, sans-serif; background-color: #f4f7fc; margin: 0; padding: 0;">
                <div style="max-width: 600px; margin: 30px auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
                    <h1 style="color: #333333; font-size: 24px; text-align: center;">Email Verification</h1>
                    <p style="font-size: 16px; color: #555555; line-height: 1.5;">
                        Thank you for registering with us! To complete your registration, please click the link below to verify your email address:
                    </p>
                    <a href="${verificationLink}" style="display: inline-block; padding: 12px 20px; margin: 20px 0; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 4px; font-size: 16px; text-align: center;">
                        Verify Email
                    </a>
                    <p style="font-size: 16px; color: #555555; line-height: 1.5;">
                        If you did not sign up for this account, please ignore this email.
                    </p>
                    <div style="font-size: 14px; text-align: center; color: #777777; margin-top: 30px;">
                        <p>&copy; ${new Date().getFullYear()} Your Company Name. All Rights Reserved.</p>
                    </div>
                </div>
            </body>
        </html>
    `, // HTML body of the email (with inline CSS for styling)
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



/**
 * Function to send a password reset email
 * @param {string} userEmail - The recipient's email address
 * @param {string} resetLink - The password reset URL to be included in the email
 * @returns {Promise} Resolves when the email is sent
 */
const sendPasswordResetEmail = (userEmail, resetLink) => {
    // Setup email data
    const mailOptions = {
        from: config.mailer.MAIL_FROM_ADDRESS, // Sender's email address
        to: userEmail, // Recipient's email address
        subject: 'Password Reset Request', // Email subject
        html: `
        <html>
            <body style="font-family: Arial, sans-serif; background-color: #f4f7fc; margin: 0; padding: 0;">
                <div style="max-width: 600px; margin: 30px auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
                    <h1 style="color: #333333; font-size: 24px; text-align: center;">Password Reset Request</h1>
                    <p style="font-size: 16px; color: #555555; line-height: 1.5;">
                        We received a request to reset your password. To reset your password, please click the link below:
                    </p>
                    <a href="${resetLink}" style="display: inline-block; padding: 12px 20px; margin: 20px 0; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 4px; font-size: 16px; text-align: center;">
                        Reset Password
                    </a>
                    <p style="font-size: 16px; color: #555555; line-height: 1.5;">
                        If you did not request a password reset, please ignore this email.
                    </p>
                    <div style="font-size: 14px; text-align: center; color: #777777; margin-top: 30px;">
                        <p>&copy; ${new Date().getFullYear()} Your Company Name. All Rights Reserved.</p>
                    </div>
                </div>
            </body>
        </html>
    `, // HTML body of the email (with inline CSS for styling)
    };

    // Send the email
    return transporter.sendMail(mailOptions)
        .then(info => {
            console.log('Password reset email sent:', info.response);
            return info; // Resolve with the result
        })
        .catch(error => {
            console.error('Error sending password reset email:', error);
            throw error; // Reject with error if sending fails
        });
};


module.exports = {
    sendVerificationEmail,
    sendPasswordResetEmail
};