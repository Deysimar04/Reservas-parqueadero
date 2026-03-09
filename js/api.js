// api.js - Responsable de Datos Externos
export async function obtenerReserva() {
    const url = "https://api.mockfly.dev/mocks/bd5d9729-e528-4779-8a90-cfbc7a68fd5b/reservations";

    try {
        const respuesta = await fetch(url);
        if (!respuesta.ok) throw new Error(`Error: ${respuesta.status}`);

        const data = await respuesta.json();
        return data; // Retorna { reservations: [...] }

    } catch (error) {
        console.error("Hubo un error al obtener las reservas de la API:", error);
        // Devolvemos null para que main.js sepa que debe usar el generador aleatorio
        return null; 
    }
}