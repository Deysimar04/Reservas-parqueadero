import { obtenerReserva } from "./api.js";
export function pintarReserva(data) {

    const lista = document.getElementById("reservasLista");

    const col = document.createElement("div");
    col.className = "col-md-3";

    function formatearRangoFechas(inicio, fin) {

    if (!inicio || !fin) return "N/A";

    const inicioLimpio = inicio.replace(" ", "");
    const finLimpio = fin.replace(" ", "");

    const fechaInicio = new Date(inicioLimpio);
    const fechaFin = new Date(finLimpio);

    if (isNaN(fechaInicio) || isNaN(fechaFin)) return "N/A";

    const fecha = fechaInicio.toLocaleDateString("es-CO", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });

    const horaInicio = fechaInicio.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    });

    const horaFin = fechaFin.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    });

    return `${fecha}<br>${horaInicio} - ${horaFin}`;
    }

    col.innerHTML = `
        <div class="card shadow-sm text-center">
            <div class="card-body">
                <h5 class="card-title">Spot ${data.spot_number}</h5>

                <p class="card-text">
                    <strong>Status:</strong> ${data.status} <br>
                    <strong>Plate:</strong> ${data.vehicle_plate ?? "N/A"} <br>
                    <strong>Reservation:</strong><br>
                    ${formatearRangoFechas(data.start_time, data.end_time)}
                </p>
            </div>
        </div>
    `;

    lista.appendChild(col);
}

obtenerReserva();