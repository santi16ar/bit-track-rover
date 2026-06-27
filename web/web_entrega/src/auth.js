// ============================================
// auth.js — reemplaza Firebase Auth
// Usa la api.php con MySQL
// ============================================

const API = "api.php";

// LOGIN
export async function login(email, password) {
  try {
    const res = await fetch(`${API}?resource=login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (data.ok) {
      // Guardamos el usuario en sessionStorage (equivalente a la sesión de Firebase)
      sessionStorage.setItem("usuario", JSON.stringify(data.usuario));
      window.location.href = "home.html";
    } else {
      alert("Error al iniciar sesión: " + (data.error || "credenciales incorrectas"));
    }
  } catch (e) {
    alert("Error de conexión con el servidor.");
    console.error(e);
  }
}

// REGISTRO
export async function registro(email, password, nombre, hospitalId, rol, rovers) {
  try {
    const res = await fetch(`${API}?resource=registro`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, nombre, fk_id_hospital: hospitalId, fk_rol: rol, rovers }),
    });
    const data = await res.json();

    if (data.ok) {
      sessionStorage.setItem("usuario", JSON.stringify(data.usuario));
      window.location.href = "home.html";
    } else {
      alert("Error al registrarse: " + (data.error || "intenta de nuevo"));
    }
  } catch (e) {
    alert("Error de conexión con el servidor.");
    console.error(e);
  }
}

// CERRAR SESIÓN
export function cerrarSesion() {
  sessionStorage.removeItem("usuario");
  window.location.href = "index.html";
}

// PROTEGER PÁGINAS — redirige si no hay sesión activa
export function protegerPagina() {
  const usuario = sessionStorage.getItem("usuario");
  if (!usuario) {
    window.location.href = "index.html";
  }
  return JSON.parse(usuario);
}

// OBTENER USUARIO ACTUAL
export function getUsuario() {
  const u = sessionStorage.getItem("usuario");
  return u ? JSON.parse(u) : null;
}
