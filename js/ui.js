// ui.js

function formatearRangoFechas(inicio, fin) {

    if (!inicio || !fin) return "";

    const fechaInicio = new Date(inicio);
    const fechaFin = new Date(fin);

    const fecha = fechaInicio.toLocaleDateString("es-CO");

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

    return `${fecha} ${horaInicio} - ${horaFin}`;
}


export function pintarReserva(data) {

    const cupo = document.querySelector(`[data-id="${data.spot_number}"]`);
    if (!cupo) return;

    const estado = cupo.querySelector(".estado");
    const btn = cupo.querySelector("button");

    // Resetear estado SIEMPRE
    cupo.classList.remove("disponible", "ocupado");

    if (data.status === "ocupado") {

        cupo.classList.add("ocupado");

        estado.textContent = "🔴 Ocupado";
        btn.textContent = "Cancelar";
        btn.className = "btn-cancelar";

    } else {

        cupo.classList.add("disponible");

        estado.textContent = "🟢 Disponible";
        btn.textContent = "Reservar";
        btn.className = "btn-reservar";
    }
}

export function pintarParqueadero(reservas) {

    reservas.forEach(reserva => {
        pintarReserva(reserva);
    });

    actualizarResumen();
}


export function actualizarResumen() {

    const total = document.querySelectorAll(".cupo").length;

    const disponibles =
        document.querySelectorAll(".cupo.disponible").length;

    const ocupados =
        document.querySelectorAll(".cupo.ocupado").length;

    document.getElementById("total-cupos").textContent = total;
    document.getElementById("disponibles").textContent = disponibles;
    document.getElementById("ocupados").textContent = ocupados;
}