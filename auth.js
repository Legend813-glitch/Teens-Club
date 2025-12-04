// auth.js - ALL-IN-ONE

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { 
  getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";

// FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyDOXH8T2TZvjs9F9eCgLD7TZPANJwV-4Zk",
  authDomain: "teens-club-813.firebaseapp.com",
  databaseURL: "https://teens-club-813-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "teens-club-813",
  storageBucket: "teens-club-813.firebasestorage.app",
  messagingSenderId: "76001653226",
  appId: "1:76001653226:web:f1ceec79b3496025af4293"
};

// INIT
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

window.onload = () => {

  // POPUPS
  const loginPopup = document.getElementById("loginPopup");
  const signupPopup = document.getElementById("signupPopup");

  document.getElementById("openLogin").onclick = () => loginPopup.classList.remove("hidden");
  document.getElementById("closeLogin").onclick = () => loginPopup.classList.add("hidden");
  document.getElementById("openSignup").onclick = () => signupPopup.classList.remove("hidden");
  document.getElementById("closeSignup").onclick = () => signupPopup.classList.add("hidden");

  // INPUTS
  const loginEmail = document.getElementById("loginEmail");
  const loginPassword = document.getElementById("loginPassword");
  const loginBtn = document.getElementById("loginBtn");

  const signupUsername = document.getElementById("signupUsername");
  const signupEmail = document.getElementById("signupEmail");
  const signupPassword = document.getElementById("signupPassword");
  const signupGender = document.getElementById("signupGender");
  const signupAge = document.getElementById("signupAge");
  const signupBtn = document.getElementById("signupBtn");

  // Inline messages
  const loginMsg = document.createElement("div");
  loginMsg.style.color = "#ff6b6b";
  loginMsg.style.marginTop = "8px";
  loginPopup.querySelector(".popup-box").appendChild(loginMsg);

  const signupMsg = document.createElement("div");
  signupMsg.style.color = "#6df";
  signupMsg.style.marginTop = "8px";
  signupPopup.querySelector(".popup-box").appendChild(signupMsg);

  // Fill age dropdown 13-99
  for (let i = 13; i <= 99; i++) {
      const opt = document.createElement("option");
      opt.value = i;
      opt.textContent = i;
      signupAge.appendChild(opt);
  }

  // SIGNUP
  signupBtn.onclick = async () => {
      signupMsg.textContent = "";
      const username = signupUsername.value.trim();
      const email = signupEmail.value.trim();
      const password = signupPassword.value;
      const gender = signupGender.value;
      const age = signupAge.value;

      if (!username || !email || !password || !gender || !age) {
          signupMsg.textContent = "Please fill all the fields.";
          return;
      }

      const snap = await get(ref(db, `users/${username}`));
      if (snap.exists()) {
          signupMsg.textContent = "Username already taken.";
          return;
      }

      try {
          const userCred = await createUserWithEmailAndPassword(auth, email, password);
          await set(ref(db, `users/${username}`), {
              uid: userCred.user.uid,
              email,
              gender,
              age
          });
          signupMsg.style.color = "#6df";
          signupMsg.textContent = "Account created!";
          setTimeout(() => window.location.href = "chat.html", 1000);
      } catch (err) {
          signupMsg.textContent = err.message;
      }
  };

  // LOGIN
  loginBtn.onclick = async () => {
      loginMsg.textContent = "";
      let emailOrUser = loginEmail.value.trim();
      const password = loginPassword.value;

      if (!emailOrUser || !password) {
          loginMsg.textContent = "Please fill all the fields.";
          return;
      }

      try {
          // If username, find email
          if (!emailOrUser.includes("@")) {
              const snap = await get(ref(db, `users/${emailOrUser}`));
              if (!snap.exists()) {
                  loginMsg.textContent = "Username not found. Use a valid username.";
                  return;
              }
              emailOrUser = snap.val().email;
          }

          await signInWithEmailAndPassword(auth, emailOrUser, password);
          loginMsg.style.color = "#6df";
          loginMsg.textContent = "Login successful!";
          setTimeout(() => window.location.href = "chat.html", 1000);
  
