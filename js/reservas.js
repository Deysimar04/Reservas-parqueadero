// reservas.js

import { actualizarResumen } from "./ui.js";

let accionEnProceso = false; // evita múltiples clics rápidos

export function inicializarReservas() {

    const contenedor = document.querySelector("#parqueadero");

    contenedor.addEventListener("click", function (e) {

        if (accionEnProceso) return;

        const boton = e.target.closest("button");
        if (!boton) return;

        const cupo = boton.closest(".cupo");
        if (!cupo) {
            alert("Error: cupo no encontrado.");
            return;
        }

        if (cupo.classList.contains("disponible")) {
            reservarCupo(cupo);
        }

        else if (cupo.classList.contains("ocupado")) {
            cancelarReserva(cupo);
        }

        else {
            alert("Estado inválido detectado.");
        }

    });

}


// 🔹 LÓGICA CON VALIDACIONES

function reservarCupo(cupo) {

    // 🔴 Validar que realmente esté disponible
    if (!cupo.classList.contains("disponible")) {
        alert("No se puede reservar un cupo ocupado.");
        return;
    }

    accionEnProceso = true;

    cupo.classList.remove("disponible");
    cupo.classList.add("ocupado");

    const estado = cupo.querySelector(".estado");
    if (estado) estado.textContent = "🔴 Ocupado";

    const btn = cupo.querySelector("button");
    if (btn) {
        btn.textContent = "Cancelar";
        btn.className = "btn-cancelar";
    }

    actualizarResumen();

    accionEnProceso = false;
}


function cancelarReserva(cupo) {

    // 🔴 Validar que realmente esté ocupado
    if (!cupo.classList.contains("ocupado")) {
        alert("No se puede cancelar un cupo disponible.");
        return;
    }

    accionEnProceso = true;

    cupo.classList.remove("ocupado");
    cupo.classList.add("disponible");

    const estado = cupo.querySelector(".estado");
    if (estado) estado.textContent = "🟢 Disponible";

    const btn = cupo.querySelector("button");
    if (btn) {
        btn.textContent = "Reservar";
        btn.className = "btn-reservar";
    }

    actualizarResumen();

    accionEnProceso = false;
}