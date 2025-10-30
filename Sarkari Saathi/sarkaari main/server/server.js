// server/server.js
import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";

// Load environment variables from .env file
dotenv.config();

// ======================================================
// 🔥 Firebase Configuration
// ======================================================
const firebaseConfig = {
  apiKey: "AIzaSyCdD53xXNZiO6zj8QNgkP-0mF-s56IZgr8",
  authDomain: "sarkari-saathi-4e42c.firebaseapp.com",
  projectId: "sarkari-saathi-4e42c",
  storageBucket: "sarkari-saathi-4e42c.firebasestorage.app",
  messagingSenderId: "194556152657",
  appId: "1:194556152657:web:ba889f998d28ef810a2170",
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

// ======================================================
// 🚀 Express Setup
// ======================================================
const server = express();
server.use(express.json());

// ✅ Secure CORS — allow only your app URLs
server.use(
  cors({
    origin: ["http://localhost:3000", "https://sarkari-saathi.vercel.app"],
    methods: ["GET", "POST"],
  })
);

// ======================================================
// 🧠 Rate Limiting — prevent OTP abuse
// ======================================================
const otpLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 3, // max 3 OTP requests per minute per IP
  message: {
    success: false,
    message: "Too many OTP requests. Please try again after a minute.",
  },
});

server.use("/send-otp", otpLimiter);

// ======================================================
// 📧 Nodemailer Setup using Environment Variables
// ======================================================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // from .env
    pass: process.env.EMAIL_PASS, // from .env (App Password)
  },
});

// ======================================================
// 🔢 Generate Random OTP
// ======================================================
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ======================================================
// 📬 Send OTP Endpoint
// ======================================================
server.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  const otp = generateOTP();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes validity

  try {
    await setDoc(doc(db, "emailOtps", email), { otp, expiresAt });

    await transporter.sendMail({
      from: `Sarkari Saathi <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Sarkari Saathi Login OTP",
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    });

    res.status(200).json({ success: true, message: "OTP sent successfully!" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
});

// ======================================================
// ✅ Verify OTP Endpoint
// ======================================================
server.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  try {
    const docRef = doc(db, "emailOtps", email);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists())
      return res.json({ success: false, message: "OTP not found" });

    const { otp: storedOtp, expiresAt } = docSnap.data();

    if (Date.now() > expiresAt) {
      await deleteDoc(docRef);
      return res.json({ success: false, message: "OTP expired" });
    }

    if (otp !== storedOtp)
      return res.json({ success: false, message: "Invalid OTP" });

    await deleteDoc(docRef);
    res.json({ success: true, message: "OTP verified successfully!" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ success: false, message: "Verification failed" });
  }
});

// ======================================================
// 🧹 Optional: Firestore Cleanup (Placeholder)
// ======================================================
// You can later add a Firebase Cloud Function or cron job
// to delete expired OTP docs automatically for maintenance.

// ======================================================
// 🌍 Start Server
// ======================================================
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Server running securely on http://localhost:${PORT}`);
});
