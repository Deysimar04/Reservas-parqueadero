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