// validaciones.js

// función robusta para limpiar y formatear rango de fechas
function formatearRangoFechas(inicio, fin) {
    if (!inicio || !fin) return "N/A";

    // eliminar cualquier whitespace que rompa el ISO (p.ej. "2026-02-27 T10:00:00")
    const inicioLimpio = String(inicio).replace(/\s+/g, "");
    const finLimpio = String(fin).replace(/\s+/g, "");

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

    // formato: 27/02/2026 <br> 10:00 AM - 12:00 PM  (si prefieres distinta separación, lo cambias)
    return `    ${fecha} ${horaInicio} - ${horaFin}`;
}

// pinta un solo cupo (actualiza DOM ya existente con data-id)
export function pintarReserva(data) {
    const cupo = document.querySelector(`[data-id="${data.spot_number}"]`);
    if (!cupo) return;

    const estado = cupo.querySelector(".estado");
    const btn = cupo.querySelector("button");

    // limpiar clases previas relevantes
    cupo.classList.remove("disponible", "ocupado", "reservado");

    // actualizar visual según estado
    if (data.status === "disponible") {
        cupo.classList.add("disponible");
        if (estado) estado.textContent = "🟢 Disponible";
        if (btn) {
            btn.textContent = "Reservar";
            btn.classList.remove("btn-cancelar");
            btn.classList.add("btn-reservar");
        }
    } else if (data.status === "ocupado") {
        cupo.classList.add("ocupado");
        if (estado) estado.textContent = `🔴 Ocupado${data.vehicle_plate ? " - " + data.vehicle_plate + formatearRangoFechas(data.start_time, data.end_time) : ""}`;
        if (btn) {
            btn.textContent = "Cancelar";
            btn.classList.remove("btn-reservar");
            btn.classList.add("btn-cancelar");
        }
    } else if (data.status === "reservado") {
        // puedes elegir si 'reservado' se visualiza como una clase propia o como 'ocupado'
        cupo.classList.add("reservado");
        if (estado) estado.innerHTML = `🟡 Reservado<br>${formatearRangoFechas(data.start_time, data.end_time)}`;
        if (btn) {
            btn.textContent = "Cancelar";
            btn.classList.remove("btn-reservar");
            btn.classList.add("btn-cancelar");
        }
    }
}

// pinta todo el parqueadero: recibe el objeto o el array y actualiza los contadores
export function pintarParqueadero(dataOrArray) {
    const reservas = Array.isArray(dataOrArray)
        ? dataOrArray
        : (dataOrArray && dataOrArray.reservations) ? dataOrArray.reservations : [];

    let disponibles = 0;
    let ocupados = 0;

    reservas.forEach(reserva => {
        pintarReserva(reserva);

        if (reserva.status === "disponible") disponibles++;
        else ocupados++;
    });

    // actualizar panel superior
    const total = document.querySelectorAll(".cupo").length;
    document.getElementById("total-cupos").textContent = total;
    document.getElementById("disponibles").textContent = disponibles;
    document.getElementById("ocupados").textContent = ocupados;
}