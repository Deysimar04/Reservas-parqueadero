// js/api.js

export async function obtenerReserva() {
    // Reemplaza con tu URL real de Mockfly
    const URL_API = "https://api.mockfly.dev/mocks/tu-id-aqui/reservations";

    try {
        const respuesta = await fetch(URL_API);
        
        if (!respuesta.ok) {
            throw new Error("Error en la respuesta de la API");
        }

        const datos = await respuesta.json();
        return datos; 
    } catch (error) {
        console.warn("API no disponible, se usarán datos locales/aleatorios:", error.message);
        return null; // Devolvemos null para que main.js use generarDatosAleatorios()
    }
}