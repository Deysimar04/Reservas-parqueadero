// main.js
import { inicializarReservas, aplicarFiltro } from "./reservas.js";
import { pintarParqueadero } from "./validaciones.js";
import { obtenerReserva } from "./api.js";

document.addEventListener("DOMContentLoaded", async () => {
    // Traer datos de la API
    const data = await obtenerReserva();
    pintarParqueadero(data);

    // Inicializar botones y estados
    inicializarReservas();

    // Checkbox de filtro
    const filtroCheckbox = document.getElementById("filtro");
    filtroCheckbox.addEventListener("change", aplicarFiltro);
});