import { pintarReserva } from "./validaciones.js";
export async function obtenerReserva() {
    const url = "https://api.mockfly.dev/mocks/bd5d9729-e528-4779-8a90-cfbc7a68fd5b/reservations";

    try {
        const respuesta = await fetch(url);
        if (!respuesta.ok) throw new Error(`Error: ${respuesta.status}`);

        const data = await respuesta.json();

        const reservas = data.reservations;

        for (const reserva of reservas) {
            pintarReserva(reserva);
        }

    } catch (error) {
        console.error("Hubo un error", error);
    }
}
