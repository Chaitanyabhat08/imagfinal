const nodeMailer = require('nodemailer');
const catchAsyncError = require('../middleware/asyncError');
const dotenv = require('dotenv');
dotenv.config({ path: '../config/.env' });

const sendEmail = async (options) => {
  try {
    const transporter = nodeMailer.createTransport({
      host: process.env.SMTP_SERVICE,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
    });
    const mailOptions = {
      from: "bhatchaitanya420@gmail.com",
      to: options.email,
      subject: options.subject,
      // text: options.message,
      html: options.html,
      // attachments: options.attachments,
    }
    await transporter.sendMail(mailOptions)
  } catch (err) {
    res.status(err.status).send({message:"Internal server error", err: err})
  }
};
module.exports = sendEmail;