export async function obtenerPlazas() {
  // Si ya hay plazas guardadas, retornarlas
  const guardadas = localStorage.getItem("plazas");
  if (guardadas) {
    return JSON.parse(guardadas);
  }

  // Si no hay, generar las iniciales y guardarlas
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
      reservadoPor: null,
      fecha: null,
      extras: {
        techado: Math.random() > 0.5,
        camaras: Math.random() > 0.5,
        iluminado: Math.random() > 0.5,
        discapacitados: Math.random() > 0.5
      }
    });
  }

  localStorage.setItem("plazas", JSON.stringify(plazas));
  return plazas;
}

export function guardarPlazas(plazas) {
  localStorage.setItem("plazas", JSON.stringify(plazas));
}

// ============================================
// HU23 — ENDPOINT MOCK DISPONIBILIDAD
// Simula un GET /api/disponibilidad?zona=&tipo=&fecha=
// ============================================
export async function obtenerDisponibilidad(zona = "", tipo = "", fecha = "") {

  // Simular latencia de red (300ms)
  await new Promise(resolve => setTimeout(resolve, 300));

  const plazas = JSON.parse(localStorage.getItem("plazas")) || [];

  // Excluir plazas ocupadas
  let resultado = plazas.filter(p => p.estado !== "ocupado");

  // Filtrar por zona
  if (zona) {
    resultado = resultado.filter(p =>
      p.zona.toLowerCase() === zona.toLowerCase()
    );
  }

  // Filtrar por tipo de vehículo
  if (tipo) {
    resultado = resultado.filter(p =>
      p.tipo.toLowerCase() === tipo.toLowerCase()
    );
  }

  // Filtrar por fecha: excluir plazas ya reservadas para esa fecha
  if (fecha) {
    resultado = resultado.filter(p =>
      !(p.estado === "reservado" && p.fecha === fecha)
    );
  }

  // Simular respuesta tipo API REST
  return {
    ok: true,
    status: 200,
    total: resultado.length,
    filtros: { zona, tipo, fecha },
    plazas: resultado
  };
}