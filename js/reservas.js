// reservas.js
import { pintarReserva } from "./validaciones.js";

export function inicializarReservas() {
    const cupos = document.querySelectorAll(".cupo");

    cupos.forEach(cupo => {
        const btn = cupo.querySelector("button");

        // eliminar listeners previos si existen para no duplicar
        btn.replaceWith(btn.cloneNode(true));
    });

    // volver a seleccionar botones recién clonados
    const nuevosCupos = document.querySelectorAll(".cupo");
    nuevosCupos.forEach(cupo => {
        const btn = cupo.querySelector("button");
        btn.addEventListener("click", () => toggleReserva(cupo));
    });

    actualizarResumen();
}

function toggleReserva(cupo) {
    const btn = cupo.querySelector("button");
    const estadoDiv = cupo.querySelector(".estado");

    if (cupo.classList.contains("ocupado")) {
        // Cancelar reserva
        cupo.classList.remove("ocupado");
        cupo.classList.add("disponible");
        estadoDiv.textContent = "🟢 Disponible";
        btn.textContent = "Reservar";
        btn.className = "btn-reservar";
        alert("Reserva cancelada");
    } else if (cupo.classList.contains("disponible") || cupo.classList.contains("reservado")) {
        // Reservar
        cupo.classList.remove("disponible", "reservado");
        cupo.classList.add("ocupado");
        estadoDiv.textContent = "🔴 Ocupado";
        btn.textContent = "Cancelar";
        btn.className = "btn-cancelar";
        alert("Cupo reservado exitosamente");
    }

    actualizarResumen();
}

// Actualiza los contadores visibles
export function actualizarResumen() {
    const total = document.querySelectorAll(".cupo").length;
    const disponibles = document.querySelectorAll(".cupo.disponible").length;
    const ocupados = document.querySelectorAll(".cupo.ocupado").length;

    document.getElementById("total-cupos").textContent = total;
    document.getElementById("disponibles").textContent = disponibles;
    document.getElementById("ocupados").textContent = ocupados;
}

// Filtro de disponibles
export function aplicarFiltro() {
    const mostrarSoloLibres = document.getElementById("filtro")?.checked;
    document.querySelectorAll(".cupo").forEach(cupo => {
        if (mostrarSoloLibres && !cupo.classList.contains("disponible")) {
            cupo.style.display = "none";
        } else {
            cupo.style.display = "block";
        }
    });
}