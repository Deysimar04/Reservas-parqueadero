// ============================================================
// api.js — Conexión con Backend Java (Spring Boot)
// ============================================================

const BASE_URL = "https://reservas-parqueadero-production.up.railway.app";

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

export async function loginUsuario(username, password) {
  try {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    const data = await leerRespuesta(res);
    if (!res.ok) throw new Error(data.error || `Error ${res.status}: credenciales incorrectas`);

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

async function leerRespuesta(res) {
  const text = await res.text();
  if (!text) return {};

  try {
    return JSON.parse(text);
  } catch (_) {
    return { error: text };
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

export function sesionValida() {
  return Boolean(getValidToken());
}

export async function obtenerUsuarios() {
  try {

    const res = await fetch(`${BASE_URL}/api/auth/usuarios`, {
      headers: authHeaders()
    });

    if (!res.ok) {
      throw new Error("Error obteniendo usuarios");
    }

    return await res.json();

  } catch (e) {

    console.error(e);

    return [];
  }
}

export async function cambiarRolUsuario(id, role) {

  try {

    const res = await fetch(`${BASE_URL}/api/auth/usuarios/${id}/rol`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders()
      },
      body: JSON.stringify({ role })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Error cambiando rol");
    }

    return { ok: true };

  } catch (e) {

    return {
      ok: false,
      error: e.message
    };
  }
}
export async function eliminarUsuario(id) {

  try {

    const res = await fetch(`${BASE_URL}/api/auth/usuarios/${id}`, {
      method: "DELETE",
      headers: authHeaders()
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Error eliminando usuario");
    }

    return { ok: true };

  } catch (e) {

    return {
      ok: false,
      error: e.message
    };
  }
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
    if (!res.ok) return { ok: false, error: data.error || "Error al crear" };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

export async function eliminarProducto(id) {
  console.log(authHeaders());
  try {
    const res = await fetch(`${BASE_URL}/api/productos/${id}`, {
      method: "DELETE",
      headers: authHeaders()
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Error eliminando");
    }
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

    // Mapeamos productos del backend como "plazas" para el frontend
    return productos.map(p => ({
      id:           p.id,
      nombre:       p.name,
      zona:         p.zona || "General",
      tipo:         mapearTipo(p.category?.name),
      estado:       "disponible",
      reservadoPor: null,
      fecha:        null,
      precioPorHora: p.precioPorHora || 5000,
      features:     p.features || [],
      category:     p.category,
      extras: {
        techado:        p.category?.name === "Cubierto",
        camaras:        (p.features || []).some(f => f.name === "Cámara vigilancia"),
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
// HU23 — Disponibilidad real con fechas de la BD
// ============================================================

export async function obtenerDisponibilidad() {
  try {
    const productos = await obtenerProductos();
    return {
      ok: true,
      total: productos.length,
      plazas: productos
    };
  } catch (e) {
    return { ok: false, plazas: [] };
  }
}

// HU23: IDs de productos ocupados en una fecha específica
export async function obtenerReservasPorFecha(fecha) {
  try {
    if (!sesionValida()) return [];

    const startTime = `${fecha}T00:00:00`;
    const endTime   = `${fecha}T23:59:59`;
    const res = await fetch(
      `${BASE_URL}/api/reservas/ocupadas?startTime=${startTime}&endTime=${endTime}`,
      { headers: authHeaders() }
    );
    if (!res.ok) return [];
    return await res.json(); // lista de productIds ocupados ese día
  } catch (e) {
    console.warn("Error consultando disponibilidad:", e.message);
    return [];
  }
}

// ============================================================
// HU32 — Crear reserva (con ID real del producto)
// ============================================================

export async function crearReservaBackend(productId, fecha) {
  try {
    if (!sesionValida()) {
      return { ok: false, error: "Debes iniciar sesion nuevamente" };
    }

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
// HU33 — Historial de reservas del usuario
// ============================================================

export async function obtenerMisReservas() {
  try {
    if (!sesionValida()) return [];

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
// Admin — Todas las reservas
// ============================================================

export async function obtenerTodasLasReservas() {
  try {
    if (!sesionValida()) return [];

    const res = await fetch(`${BASE_URL}/api/reservas/todas`, {
      headers: authHeaders()
    });
    if (!res.ok) throw new Error("Error al obtener reservas");
    return await res.json();
  } catch (e) {
    console.error("Error obteniendo todas las reservas:", e.message);
    return [];
  }
}

// ============================================================
// HU31 — Detalle de una reserva
// ============================================================

export async function obtenerDetalleReserva(id) {
  try {
    if (!sesionValida()) {
      return { ok: false, error: "Debes iniciar sesion nuevamente" };
    }

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
    if (!sesionValida()) {
      return { ok: false, error: "Debes iniciar sesion nuevamente" };
    }

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
// ============================================================
// FAVORITOS — HU24, HU25
// ============================================================

export async function obtenerFavoritos() {
  try {
    if (!sesionValida()) return [];

    const res = await fetch(`${BASE_URL}/favoritos`, {
      headers: authHeaders()
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (e) {
    console.warn("Error obteniendo favoritos:", e.message);
    return [];
  }
}

export async function marcarFavorito(productoId) {
  try {
    if (!sesionValida()) {
      return { ok: false, error: "Debes iniciar sesion nuevamente" };
    }

    const res = await fetch(`${BASE_URL}/favoritos/${productoId}`, {
      method: "POST",
      headers: authHeaders()
    });
    const data = await leerRespuesta(res);
    if (!res.ok) throw new Error(data.error || "Error al marcar favorito");
    return { ok: true, favorito: data };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

export async function desmarcarFavorito(productoId) {
  try {
    if (!sesionValida()) {
      return { ok: false, error: "Debes iniciar sesion nuevamente" };
    }

    const res = await fetch(`${BASE_URL}/favoritos/${productoId}`, {
      method: "DELETE",
      headers: authHeaders()
    });
    const data = await leerRespuesta(res);
    if (!res.ok) throw new Error(data.error || "Error al quitar favorito");
    return { ok: true, mensaje: data.mensaje };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

function authHeaders() {
  const token = getValidToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function getValidToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(toBase64(token.split(".")[1])));
    if (payload.exp && payload.exp * 1000 <= Date.now()) {
      limpiarSesionVencida();
      return null;
    }
    return token;
  } catch (_) {
    limpiarSesionVencida();
    return null;
  }
}

function limpiarSesionVencida() {
  localStorage.removeItem("token");
  localStorage.removeItem("usuarioActual");
}

function toBase64(base64Url) {
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  return base64.padEnd(base64.length + (4 - base64.length % 4) % 4, "=");
}
export async function enviarCorreoConfirmacion(reservaId) {
  try {
    const res = await fetch(`${BASE_URL}/api/reservas/${reservaId}/confirmar-correo`, {
      method: "POST",
      headers: authHeaders()
    });
    return res.ok ? { ok: true } : { ok: false };
  } catch (_) {
    return { ok: false };
  }
}
//hola