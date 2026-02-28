import { inicializarReservas } from "./reservas.js";
import { obtenerReserva } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
    inicializarReservas();
    obtenerReserva();
});