let caracteristicas = [];

/* ================= OBTENER PLAZAS ================= */
export async function obtenerPlazas() {

  const zonas = ["Aeropuerto", "Centro Comercial", "Centro Ciudad"];
  const tipos = ["automovil", "camioneta", "moto"];
  const estados = ["disponible", "reservado", "ocupado"];

  let plazas = [];

  for (let i = 1; i <= 10; i++) {
    plazas.push({
      id: i,
      zona: zonas[Math.floor(Math.random() * zonas.length)],
      tipo: tipos[Math.floor(Math.random() * tipos.length)],
      estado: estados[Math.floor(Math.random() * estados.length)],

      // 🔥 NUEVO
      usuario: null,
      caracteristicas: [],

      extras: {
        techado: Math.random() > 0.5,
        camaras: Math.random() > 0.5,
        iluminado: Math.random() > 0.5,
        discapacitados: Math.random() > 0.5
      }
    });
  }

  return plazas;
}

/* ================= CRUD CARACTERISTICAS ================= */

// 🔹 CREAR
export function crearCaracteristica(nombre) {
  const nueva = {
    id: Date.now(),
    nombre
  };
  caracteristicas.push(nueva);
  return nueva;
}

// 🔹 LEER
export function obtenerCaracteristicas() {
  return caracteristicas;
}

// 🔹 ELIMINAR
export function eliminarCaracteristica(id) {
  caracteristicas = caracteristicas.filter(c => c.id !== id);
}

// 🔹 (OPCIONAL UPDATE si quieres)
export function actualizarCaracteristica(id, nuevoNombre) {
  const c = caracteristicas.find(c => c.id === id);
  if (c) c.nombre = nuevoNombre;
}

/* ================= ASOCIAR A PLAZA ================= */

export function asignarCaracteristica(plazaId, caracteristicaId, plazas) {
  const plaza = plazas.find(p => p.id === plazaId);

  if (!plaza) return;

  if (!plaza.caracteristicas.includes(caracteristicaId)) {
    plaza.caracteristicas.push(caracteristicaId);
  }
}