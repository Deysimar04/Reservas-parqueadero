import { obtenerReserva } from "./api.js";
import { generarCupos, generarDatosAleatorios } from "./ui.js";
import { inicializarReservas } from "./reservas.js";

document.addEventListener("DOMContentLoaded", async () => {
    const info = document.getElementById("info-vehiculo");

 // Datos de características (Persona 3) - Sin dimensiones de altura
    const caracteristicas = {
        carro: `<h3>🚗 Carros</h3><p><strong>Dimensiones:</strong> 2.5m x 5m</p>`,
        moto: `<h3>🏍️ Motos</h3><p><strong>Dimensiones:</strong> 1.2m x 2.5m</p><p><strong>Capacidad:</strong> hasta 2 motos</p>`,
        camion: `<h3>🚚 Camiones</h3><p><strong>Dimensiones:</strong> 3.5m x 10m</p>`,
        electrico: `<h3>⚡ Eléctricos</h3><p><strong>Dimensiones:</strong> 2.5m x 5m</p><p><strong>Incluye:</strong> estación de carga</p>`
    };
    // Eventos de categorías
    document.querySelectorAll(".categoria").forEach(cat => {
        cat.addEventListener("click", () => {
            const tipo = cat.dataset.tipo;
            if (info && caracteristicas[tipo]) info.innerHTML = caracteristicas[tipo];
        });
    });

    // Inicializar eventos de reserva (botones)
    inicializarReservas();

    // Carga de datos (API o Mocks Aleatorios de Persona 3)
    try {
        const data = await obtenerReserva();
        if (data && data.reservations && data.reservations.length > 0) {
            generarCupos(data.reservations);
        } else {
            generarCupos(generarDatosAleatorios());
        }
    } catch (e) {
        generarCupos(generarDatosAleatorios());
    }
});