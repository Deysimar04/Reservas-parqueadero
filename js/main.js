// main.js
import { inicializarReservas } from "./reservas.js";
import { obtenerReserva } from "./api.js";
import { pintarParqueadero } from "./validaciones.js";

document.addEventListener("DOMContentLoaded", async () => {
    // inicializa handlers locales (botones Reservar/Cancelar)
    inicializarReservas();

    // traer datos desde la API
    const data = await obtenerReserva();

    // pintar todo el parqueadero y actualizar contadores
    pintarParqueadero(data);
});