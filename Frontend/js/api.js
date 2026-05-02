// ============================================================
// api.js — Conexión con Backend Java (Spring Boot)
// ============================================================

const BASE_URL = "http://localhost:8080";

// ============================================================
// AUTH — HU13, HU14, HU15
// ============================================================

// HU13: Registrar usuario en el backend
export async function registrarUsuario(username, email, password) {
  try {
    const res = await fetch(`${BASE_URL}/api/auth/registro`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Error al registrar");
    return { ok: true, mensaje: data.mensaje };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

// HU14: Login — guarda token y rol en localStorage
export async function loginUsuario(username, password) {
  try {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Credenciales incorrectas");

    // Guardar token y sesión
    localStorage.setItem("token", data.token);
    localStorage.setItem("usuarioActual", JSON.stringify({
      nombre:   data.username,
      email:    username,
      rol:      data.role === "ADMIN" ? "admin" : "cliente",
      username: data.username
    }));
    return { ok: true, usuario: data };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

// HU15: Logout — limpia token y sesión
export async function logoutUsuario() {
  try {
    await fetch(`${BASE_URL}/api/auth/logout`, {
      method: "POST",
      headers: authHeaders()
    });
  } catch (_) {}
  localStorage.removeItem("token");
  localStorage.removeItem("usuarioActual");
}

// ============================================================
// PRODUCTOS — HU10, HU3, HU12, HU17
// ============================================================

// HU10: Listar productos del backend
export async function obtenerProductos() {
  try {
    const res = await fetch(`${BASE_URL}/productos`);
    return await res.json();
  } catch (_) {
    return [];
  }
}

// HU12: Categorías del backend
export async function obtenerCategorias() {
  try {
    const res = await fetch(`${BASE_URL}/productos/categorias`);
    return await res.json();
  } catch (_) {
    return ["Cubierto", "Descubierto", "Motos", "Bicicletas"];
  }
}

// HU17: Características del backend
export async function obtenerCaracteristicas() {
  try {
    const res = await fetch(`${BASE_URL}/productos/caracteristicas`);
    return await res.json();
  } catch (_) {
    return [];
  }
}

// HU3: Crear producto (solo ADMIN)
export async function crearProducto(producto) {
  try {
    const res = await fetch(`${BASE_URL}/productos`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(producto)
    });
    const data = await res.json();
    if (res.status === 403) return { ok: false, error: "No tienes permisos" };
    if (!res.ok) return { ok: false, error: data.error };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

// ============================================================
// PLAZAS — sigue en localStorage (Sprint 3 conectará a BD)
// ============================================================

export async function obtenerPlazas() {
  const guardadas = localStorage.getItem("plazas");
  if (guardadas) return JSON.parse(guardadas);

  const zonas   = ["Aeropuerto", "Centro Comercial", "Centro Ciudad"];
  const tipos   = ["automovil", "camioneta", "moto"];
  const estados = ["disponible", "reservado", "ocupado"];

  const plazas = Array.from({ length: 10 }, (_, i) => ({
    id:          i + 1,
    zona:        zonas[Math.floor(Math.random() * zonas.length)],
    tipo:        tipos[Math.floor(Math.random() * tipos.length)],
    estado:      estados[Math.floor(Math.random() * estados.length)],
    reservadoPor: null,
    fecha:       null,
    extras: {
      techado:        Math.random() > 0.5,
      camaras:        Math.random() > 0.5,
      iluminado:      Math.random() > 0.5,
      discapacitados: Math.random() > 0.5
    }
  }));

  localStorage.setItem("plazas", JSON.stringify(plazas));
  return plazas;
}

export function guardarPlazas(plazas) {
  localStorage.setItem("plazas", JSON.stringify(plazas));
}

// ============================================================
// HU23 — Disponibilidad mock
// ============================================================
export async function obtenerDisponibilidad(zona = "", tipo = "", fecha = "") {
  try {
    // Intenta primero el backend
    const res = await fetch(`${BASE_URL}/productos/${encodeURIComponent(zona || "1")}/disponibilidad`);
    if (res.ok) {
      const data = await res.json();
      return { ok: true, status: 200, total: 1, plazas: [], backendData: data };
    }
  } catch (_) {}

  // Fallback a localStorage
  await new Promise(r => setTimeout(r, 300));
  const plazas = JSON.parse(localStorage.getItem("plazas")) || [];
  let resultado = plazas.filter(p => p.estado !== "ocupado");
  if (zona)  resultado = resultado.filter(p => p.zona.toLowerCase() === zona.toLowerCase());
  if (tipo)  resultado = resultado.filter(p => p.tipo.toLowerCase() === tipo.toLowerCase());
  if (fecha) resultado = resultado.filter(p => !(p.estado === "reservado" && p.fecha === fecha));

  return { ok: true, status: 200, total: resultado.length, filtros: { zona, tipo, fecha }, plazas: resultado };
}

// ============================================================
// UTIL — Header con token JWT
// ============================================================
function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}