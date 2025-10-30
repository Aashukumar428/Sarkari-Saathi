// firebaseConfig.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCdD53xXNZiO6zj8QNgkP-0mF-s56IZgr8",
  authDomain: "sarkari-saathi-4e42c.firebaseapp.com",
  projectId: "sarkari-saathi-4e42c",
  storageBucket: "sarkari-saathi-4e42c.firebasestorage.app",
  messagingSenderId: "194556152657",
  appId: "1:194556152657:web:ba889f998d28ef810a2170",
  measurementId: "G-RH01FWBJVJ"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 🌍 Make them globally available
window.firebaseAuth = auth;
window.firebaseDB = db;

console.log("🔥 Firebase initialized successfully");
