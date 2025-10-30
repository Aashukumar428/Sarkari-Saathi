// ==========================================================
// 🌐 NAVBAR TOGGLE & ACTIVE LINK HIGHLIGHT
// ==========================================================
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  document.addEventListener("click", (e) => {
    if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });

  // Active link highlight on click
  const links = Array.from(navLinks.querySelectorAll("a"));
  links.forEach((link) => {
    link.addEventListener("click", () => {
      links.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");
    });
  });

  // Maintain active link on reload (hash-based)
  window.addEventListener("load", () => {
    const currentHash = window.location.hash;
    if (currentHash) {
      const activeLink = navLinks.querySelector(`a[href="${currentHash}"]`);
      if (activeLink) activeLink.classList.add("active");
    }
  });
}

// ==========================================================
// 🧭 SIDE MENU TOGGLE (HAMBURGER PANEL)
// ==========================================================
const sideMenuBtn = document.getElementById("side-menu-btn");
const sideMenu = document.getElementById("side-menu");

if (sideMenuBtn && sideMenu) {
  sideMenuBtn.addEventListener("click", () => {
    sideMenu.classList.toggle("open");
    sideMenu.setAttribute("aria-hidden", sideMenu.classList.contains("open") ? "false" : "true");
  });

  document.addEventListener("click", (e) => {
    if (!sideMenu.contains(e.target) && !sideMenuBtn.contains(e.target)) {
      sideMenu.classList.remove("open");
      sideMenu.setAttribute("aria-hidden", "true");
    }
  });
}

// ==========================================================
// 🔒 LOGIN / SIGNUP MODAL HANDLING
// ==========================================================
const loginModal = document.getElementById("login-modal");
const loginBtn = document.getElementById("login-btn");
const loginClose = document.getElementById("login-close");
const tabButtons = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

if (loginBtn && loginModal) {
  loginBtn.addEventListener("click", () => {
    loginModal.classList.add("active");
    loginModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  });
}

if (loginClose && loginModal) {
  loginClose.addEventListener("click", () => {
    loginModal.classList.remove("active");
    loginModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "auto";
  });
}

loginModal?.addEventListener("click", (e) => {
  if (e.target === loginModal) {
    loginModal.classList.remove("active");
    loginModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "auto";
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (loginModal.classList.contains("active")) {
      loginModal.classList.remove("active");
      loginModal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "auto";
    }
  }
});

// tab switching (show-login / show-signup use tab-btn class)
tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    tabButtons.forEach((b) => b.classList.remove("active"));
    tabContents.forEach((c) => c.classList.add("hidden"));

    btn.classList.add("active");
    const target = document.getElementById(btn.dataset.target);
    if (target) {
      target.classList.remove("hidden");
    }
  });
});

// ==========================================================
// ⚙️ FIREBASE INITIALIZATION SAFETY CHECK
// ==========================================================
function waitForFirebaseInit(cb) {
  if (window.firebaseAuth && window.firebaseDB) return cb();
  const interval = setInterval(() => {
    if (window.firebaseAuth && window.firebaseDB) {
      clearInterval(interval);
      cb();
    }
  }, 80);
}

// ==========================================================
// 🔐 FIREBASE-DEPENDENT CODE (SAFE WRAPPED BLOCK)
// ==========================================================
waitForFirebaseInit(async () => {
  // Import Firestore modules
  const { setDoc, doc, getDoc } = await import(
    "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js"
  );

  const db = window.firebaseDB;
  const backendURL = "http://localhost:5000";

  // ========================================================
  // 📨 UTILITY FUNCTIONS
  // ========================================================
  function updateStatus(elementId, message, color = "green") {
    const el = document.getElementById(elementId);
    if (el) {
      el.textContent = message;
      el.style.color = color;
      el.style.display = "block";
    }
  }

  function startResendCountdown(button, seconds = 60) {
    button.disabled = true;
    let remaining = seconds;
    const originalText = button.textContent;
    const timer = setInterval(() => {
      button.textContent = `Resend OTP (${remaining--}s)`;
      if (remaining < 0) {
        clearInterval(timer);
        button.textContent = originalText;
        button.disabled = false;
      }
    }, 1000);
  }

  // ========================================================
  // 🧾 SIGNUP FLOW
  // ========================================================
  const signupSendOTP = document.getElementById("signup-send-otp");
  const signupVerifyOTP = document.getElementById("signup-verify-otp");
  const signupOTPSection = document.getElementById("signup-otp-section");

  signupSendOTP?.addEventListener("click", async () => {
    const username = document.getElementById("signup-name")?.value.trim();
    const email = document.getElementById("signup-email")?.value.trim();
    const password = document.getElementById("signup-password")?.value;
    const confirm = document.getElementById("signup-password-confirm")?.value;

    if (!username || !email || !password || !confirm) {
      return updateStatus("signup-status", "⚠️ Fill all fields.", "red");
    }
    if (password !== confirm) {
      return updateStatus("signup-status", "❌ Passwords do not match.", "red");
    }

    try {
      updateStatus("signup-status", "⏳ Sending OTP...", "#555");
      const res = await fetch(`${backendURL}/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();

      if (data.success) {
        updateStatus("signup-status", "📨 OTP sent! Check inbox.", "green");
        signupOTPSection.classList.remove("hidden");
        signupOTPSection.style.animation = "fadeSlideIn 0.4s ease forwards";
        startResendCountdown(signupSendOTP);
      } else {
        updateStatus("signup-status", "❌ " + (data.message || data.error || "Failed to send OTP"), "red");
      }
    } catch (err) {
      console.error(err);
      updateStatus("signup-status", "⚠️ Network error.", "red");
    }
  });

  signupVerifyOTP?.addEventListener("click", async () => {
    const enteredOtp = document.getElementById("signup-otp")?.value.trim();
    const email = document.getElementById("signup-email")?.value.trim();
    const username = document.getElementById("signup-name")?.value.trim();
    if (!enteredOtp) return updateStatus("signup-status", "Enter OTP first!", "red");

    updateStatus("signup-status", "⏳ Verifying OTP...", "#555");

    try {
      const res = await fetch(`${backendURL}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: enteredOtp })
      });
      const data = await res.json();

      if (data.success) {
        await setDoc(doc(db, "users", email.replace(/[.@]/g, "_")), {
          username,
          email,
          createdAt: new Date().toISOString()
        });

        updateStatus("signup-status", "🎉 Signup successful!", "green");
        setTimeout(() => {
          // reset & hide
          document.getElementById("signup-form")?.reset();
          signupOTPSection.classList.add("hidden");
          loginModal.classList.remove("active");
          loginModal.setAttribute("aria-hidden", "true");
          document.body.style.overflow = "auto";
        }, 1000);
      } else {
        updateStatus("signup-status", "❌ " + (data.message || data.error || "Invalid OTP"), "red");
      }
    } catch (err) {
      console.error(err);
      updateStatus("signup-status", "⚠️ Verification failed.", "red");
    }
  });

  // ========================================================
  // 🔑 LOGIN FLOW
  // ========================================================
  const loginSendOTP = document.getElementById("login-send-otp");
  const loginVerifyOTP = document.getElementById("login-verify-otp");
  const loginOTPSection = document.getElementById("login-otp-section");

  loginSendOTP?.addEventListener("click", async () => {
    const email = document.getElementById("login-email")?.value.trim();
    if (!email) return updateStatus("login-status", "Enter your email.", "red");

    loginOTPSection.classList.add("hidden"); // ensure hidden first
    updateStatus("login-status", "⏳ Sending OTP...", "#555");

    try {
      const res = await fetch(`${backendURL}/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();

      if (data.success) {
        updateStatus("login-status", "📩 OTP sent to your email.", "green");
        loginOTPSection.classList.remove("hidden");
        loginOTPSection.style.animation = "fadeSlideIn 0.4s ease forwards";
        startResendCountdown(loginSendOTP);
      } else {
        updateStatus("login-status", "❌ " + (data.message || data.error || "Failed to send OTP"), "red");
      }
    } catch (err) {
      console.error(err);
      updateStatus("login-status", "⚠️ Network error.", "red");
    }
  });

  loginVerifyOTP?.addEventListener("click", async () => {
    const email = document.getElementById("login-email")?.value.trim();
    const entered = document.getElementById("login-otp")?.value.trim();
    if (!entered) return updateStatus("login-status", "Enter OTP first.", "red");

    updateStatus("login-status", "⏳ Verifying OTP...", "#555");

    try {
      const res = await fetch(`${backendURL}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: entered })
      });
      const data = await res.json();

      if (data.success) {
        const userDoc = await getDoc(doc(db, "users", email.replace(/[.@]/g, "_")));
        if (!userDoc.exists()) {
          updateStatus("login-status", "⚠️ Account not found. Please sign up first.", "red");
          return;
        }

        updateStatus("login-status", "✅ Login successful!", "green");
        setTimeout(() => {
          document.getElementById("login-form")?.reset();
          loginOTPSection.classList.add("hidden");
          loginModal.classList.remove("active");
          loginModal.setAttribute("aria-hidden", "true");
          document.body.style.overflow = "auto";
          // TODO: update side-menu / navbar to show dashboard state
        }, 1000);
      } else {
        updateStatus("login-status", "❌ " + (data.message || data.error || "Invalid OTP"), "red");
      }
    } catch (err) {
      console.error(err);
      updateStatus("login-status", "⚠️ Verification failed.", "red");
    }
  });
});
