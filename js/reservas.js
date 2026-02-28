// reservas.js

import { actualizarResumen } from "./ui.js";

export function inicializarReservas() {

    const contenedor = document.querySelector("#parqueadero");

    contenedor.addEventListener("click", function (e) {

        const boton = e.target.closest("button");
        if (!boton) return;

        const cupo = boton.closest(".cupo");
        if (!cupo) return;

        if (cupo.classList.contains("disponible")) {
            reservarCupo(cupo);
        }

        else if (cupo.classList.contains("ocupado")) {
            cancelarReserva(cupo);
        }

    });

}



// LÓGICA

function reservarCupo(cupo) {

    cupo.classList.remove("disponible");
    cupo.classList.add("ocupado");

    cupo.querySelector(".estado").textContent = "🔴 Ocupado";

    const btn = cupo.querySelector("button");
    btn.textContent = "Cancelar";
    btn.className = "btn-cancelar";

    actualizarResumen();
}


function cancelarReserva(cupo) {

    cupo.classList.remove("ocupado");
    cupo.classList.add("disponible");

    cupo.querySelector(".estado").textContent = "🟢 Disponible";

    const btn = cupo.querySelector("button");
    btn.textContent = "Reservar";
    btn.className = "btn-reservar";

    actualizarResumen();
}