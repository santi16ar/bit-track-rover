import { auth } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// REGISTRO
export function registro(email, password) {
  return createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      window.location.href = "home.html"; // redirige al home
    })
    .catch((error) => {
      alert("Error al registrarse: " + error.message);
    });
}

// LOGIN
export function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      window.location.href = "home.html"; // redirige al home
    })
    .catch((error) => {
      alert("Error al iniciar sesión: " + error.message);
    });
}

// CERRAR SESION
export function cerrarSesion() {
  signOut(auth).then(() => {
    window.location.href = "index.html";
  });
}

// PROTEGER PAGINAS — redirige si no hay sesión
export function protegerPagina() {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      window.location.href = "index.html";
    }
  });
}
