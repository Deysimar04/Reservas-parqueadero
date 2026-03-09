// reservas.js
import { pintarReserva } from "./validaciones.js";

export function inicializarReservas() {

    const contenedor = document.getElementById("parqueadero");

    if (!contenedor) return;

    contenedor.addEventListener("click", (event) => {

        const btn = event.target;

        if (!btn.matches(".btn-reservar, .btn-cancelar")) return;

        const cupo = btn.closest(".cupo");

        if (btn.classList.contains("btn-reservar")) {
            reservarCupo(cupo);
        } 
        else if (btn.classList.contains("btn-cancelar")) {
            cancelarReserva(cupo);
    }

});
    actualizarResumen();
}

function reservarCupo(cupo) {

    const btn = cupo.querySelector("button");
    const estadoDiv = cupo.querySelector(".estado");

    cupo.classList.remove("disponible", "reservado");
    cupo.classList.add("ocupado");

    estadoDiv.textContent = "🔴 Ocupado";

    btn.textContent = "Cancelar";
    btn.className = "btn-cancelar";

    alert("Cupo reservado exitosamente");

    actualizarResumen();
}

function cancelarReserva(cupo) {

    const btn = cupo.querySelector("button");
    const estadoDiv = cupo.querySelector(".estado");

    cupo.classList.remove("ocupado", "reservado");
    cupo.classList.add("disponible");

    estadoDiv.textContent = "🟢 Disponible";

    btn.textContent = "Reservar";
    btn.className = "btn-reservar";

    alert("Reserva cancelada");

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
