// Firebase SDK imports (v9 modular)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-storage.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDOXH8T2TZvjs9F9eCgLD7TZPANJwV-4Zk",
  authDomain: "teens-club-813.firebaseapp.com",
  databaseURL: "https://teens-club-813-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "teens-club-813",
  storageBucket: "teens-club-813.firebasestorage.app",
  messagingSenderId: "76001653226",
  appId: "1:76001653226:web:f1ceec79b3496025af4293"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services to use in all other JS files
export const auth = getAuth(app);
export const db = getFirestore(app);
export const realtime = getDatabase(app); // If you want RTDB for typing indicators
export const storage = getStorage(app);
