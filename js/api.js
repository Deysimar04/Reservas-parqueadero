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