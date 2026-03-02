// api.js
export async function obtenerReserva() {
    const url = "https://api.mockfly.dev/mocks/bd5d9729-e528-4779-8a90-cfbc7a68fd5b/reservations";

    try {
        const respuesta = await fetch(url);
        if (!respuesta.ok) throw new Error(`Error: ${respuesta.status}`);

        const data = await respuesta.json();

        // devolvemos el objeto completo para que el orquestador (main.js) decida qué hacer
        return data;

    } catch (error) {
        console.error("Hubo un error al obtener las reservas", error);
        // devolver estructura vacía segura
        return { reservations: [] };
    }
}