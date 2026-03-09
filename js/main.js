import { obtenerReserva } from "./api.js";
import { generarCupos } from "./ui.js";
import { inicializarReservas } from "./reservas.js";

document.addEventListener("DOMContentLoaded", async () => {

const info = document.getElementById("info-vehiculo");

const caracteristicas = {

carro: `
<h3>🚗 Parqueadero para carros</h3>
<p><strong>Dimensiones:</strong> 2.5m ancho x 5m largo</p>
<p><strong>Altura máxima:</strong> 2.2m</p>
`,

moto: `
<h3>🏍️ Parqueadero para motos</h3>
<p><strong>Dimensiones:</strong> 1.2m ancho x 2.5m largo</p>
<p><strong>Capacidad:</strong> hasta 2 motos</p>
`,

camion: `
<h3>🚚 Parqueadero para camiones</h3>
<p><strong>Dimensiones:</strong> 3.5m ancho x 10m largo</p>
<p><strong>Altura máxima:</strong> 4m</p>
`,

electrico: `
<h3>⚡ Parqueadero para vehículos eléctricos</h3>
<p><strong>Dimensiones:</strong> 2.5m x 5m</p>
<p><strong>Incluye:</strong> estación de carga</p>
`

};

const categorias = document.querySelectorAll(".categoria");

categorias.forEach(categoria => {

categoria.addEventListener("click", () => {

const tipo = categoria.dataset.tipo;

info.innerHTML = caracteristicas[tipo];

});

});


/* ACTIVAR EVENTOS DE LOS CUPOS */
inicializarReservas();


/* CUPOS DEL PARQUEADERO DESDE API */

try {

const data = await obtenerReserva();

generarCupos(data.reservations);

} catch (error) {

console.error("Error cargando cupos:", error);

}

});