// sendEmail.js
// Currently not used. Email sending handled directly in server.js
// Future: Move Nodemailer logic here for cleaner separation if needed.
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendOtpEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // your Gmail ID
      pass: process.env.EMAIL_PASS  // your Gmail App Password
    },
  });

  const mailOptions = {
    from: `"Sarkari Sathi" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your OTP Code for Verification",
    html: `
      <div style="font-family:Arial, sans-serif; color:#333; padding:20px;">
        <h2>OTP Verification</h2>
        <p>Your OTP code is:</p>
        <h1 style="color:#004aad; letter-spacing:2px;">${otp}</h1>
        <p>This code will expire in 5 minutes.</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};
