import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCmrj9SjTcSNC_QLfKqljFn-nrawASwJwA",
  authDomain: "bit-track-rover.firebaseapp.com",
  projectId: "bit-track-rover",
  storageBucket: "bit-track-rover.firebasestorage.app",
  messagingSenderId: "923535592866",
  appId: "1:923535592866:web:97dd99f1a1cba6f74bb6fb"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);