// ============================================================
// api.js — Conexión con Backend Java (Spring Boot)
// ============================================================

const BASE_URL = "http://localhost:8080";

// ============================================================
// AUTH — HU13, HU14, HU15
// ============================================================

export async function registrarUsuario(username, email, password, rol = "USER") {
  try {
    const res = await fetch(`${BASE_URL}/api/auth/registro`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        email,
        password,
        role: ["admin", "ADMIN"].includes(rol) ? "ADMIN" : "USER"
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Error al registrar");
    return { ok: true, mensaje: data.mensaje };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}
export async function obtenerTodasLasReservas() {
    try {
        const res = await fetch('${BASE_URL}/api/reservas/todas', {
        headers: authHeaders()
    });
    if (!res.ok) throw new Error("Error al obtener reservas");
        return await res.json();
    } catch (e) {
        console.error("Error obteniendo reservas:", e.message);
    return [];
    }
  }
export async function loginUsuario(username, password) {
  try {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Credenciales incorrectas");

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

export async function obtenerProductos() {
  try {
    const res = await fetch(`${BASE_URL}/api/productos`);
    return await res.json();
  } catch (_) {
    return [];
  }
}

export async function obtenerCategorias() {
  try {
    const res = await fetch(`${BASE_URL}/api/productos/categorias`);
    const data = await res.json();
    if (data.length > 0 && typeof data[0] === "object") {
      return data.map(c => c.name);
    }
    return data;
  } catch (_) {
    return ["Cubierto", "Descubierto", "Motos", "Bicicletas", "Discapacitados"];
  }
}

export async function obtenerCaracteristicas() {
  try {
    const res = await fetch(`${BASE_URL}/api/productos/caracteristicas`);
    return await res.json();
  } catch (_) {
    return [];
  }
}

export async function crearProducto(producto) {
  try {
    const res = await fetch(`${BASE_URL}/api/productos`, {
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
// PLAZAS — Desde el BACKEND (productos reales de la BD)
// ============================================================

export async function obtenerPlazas() {
  try {
    const res = await fetch(`${BASE_URL}/api/productos`);
    if (!res.ok) throw new Error("Error al cargar productos");
    const productos = await res.json();

    return productos.map(p => ({
      id:           p.id,
      nombre:       p.name,
      zona:         p.zona || "General",
      tipo:         mapearTipo(p.category?.name),
      estado:       "disponible",
      reservadoPor: null,
      fecha:        null,
      extras: {
        techado:        p.category?.name === "Cubierto",
        camaras:        false,
        iluminado:      true,
        discapacitados: p.category?.name === "Discapacitados"
      }
    }));
  } catch (e) {
    console.error("Error obteniendo plazas:", e.message);
    return [];
  }
}

function mapearTipo(categoria) {
  const mapa = {
    "Cubierto":       "automovil",
    "Descubierto":    "camioneta",
    "Motos":          "moto",
    "Bicicletas":     "moto",
    "Discapacitados": "automovil"
  };
  return mapa[categoria] || "automovil";
}

export function guardarPlazas(plazas) {
  localStorage.setItem("plazas", JSON.stringify(plazas));
}

// ============================================================
// HU23 — Disponibilidad
// ============================================================
11
export async function obtenerDisponibilidad(zona = "", tipo = "", fecha = "") {
  try {
    const plazas = obtenerPlazasLocal();
    let resultado = plazas.filter(p => p.estado !== "ocupado");
    if (zona)  resultado = resultado.filter(p => p.zona.toLowerCase() === zona.toLowerCase());
    if (tipo)  resultado = resultado.filter(p => p.tipo.toLowerCase() === tipo.toLowerCase());
    if (fecha) resultado = resultado.filter(p => !(p.estado === "reservado" && p.fecha === fecha));
    return { ok: true, total: resultado.length, filtros: { zona, tipo, fecha }, plazas: resultado };
  } catch (_) {
    return { ok: false, plazas: [] };
  }
}

// ============================================================
// HU32 — Crear reserva (con ID real del producto)
// ============================================================
export async function crearReservaBackend(productId, fecha) {
  try {
    const startTime = `${fecha}T08:00:00`;
    const endTime   = `${fecha}T20:00:00`;

    const res = await fetch(`${BASE_URL}/api/reservas`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({
        product: { id: productId },
        startTime,
        endTime
      })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Error al crear reserva");
    return { ok: true, reserva: data };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}
// ============================================================
// HU33 — Historial de reservas
// ============================================================

export async function obtenerMisReservas() {
  try {
    const res = await fetch(`${BASE_URL}/api/reservas/mis-reservas`, {
      headers: authHeaders()
    });
    if (!res.ok) throw new Error("Error al obtener reservas");
    return await res.json();
  } catch (e) {
    console.warn("Error obteniendo reservas:", e.message);
    return [];
  }
}

// ============================================================
// HU31 — Detalle de una reserva
// ============================================================

export async function obtenerDetalleReserva(id) {
  try {
    const res = await fetch(`${BASE_URL}/api/reservas/${id}`, {
      headers: authHeaders()
    });
    if (!res.ok) throw new Error("Reserva no encontrada");
    return { ok: true, reserva: await res.json() };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

// ============================================================
// Cancelar reserva
// ============================================================

export async function cancelarReservaBackend(reservaId) {
  try {
    const res = await fetch(`${BASE_URL}/api/reservas/${reservaId}/cancelar`, {
      method: "PUT",
      headers: authHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Error al cancelar");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

// ============================================================
// UTIL — Header con token JWT
// ============================================================
function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}
// prueba