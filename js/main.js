// main.js

import { obtenerReserva } from "./api.js";
import { pintarParqueadero } from "./ui.js";
import { inicializarReservas } from "./reservas.js";

document.addEventListener("DOMContentLoaded", async () => {

    inicializarReservas();

    try {

        const data = await obtenerReserva();

        // Normalizar estados
        const reservasNormalizadas = data.reservations.map(r => {

            if (r.status === "reservado") {
                r.status = "ocupado";
            }

            return r;
        });

        pintarParqueadero(reservasNormalizadas);

    } catch (error) {

        console.error("Error cargando reservas:", error);

    }

});