// reservas.js

export function inicializarReservas() {
    const cupos = document.querySelectorAll(".cupo");

    cupos.forEach(cupo => {
        const btnReservar = cupo.querySelector(".btn-reservar");
        const btnCancelar = cupo.querySelector(".btn-cancelar");

        if (btnReservar) {
            btnReservar.addEventListener("click", () => reservarCupo(cupo));
        }

        if (btnCancelar) {
            btnCancelar.addEventListener("click", () => cancelarReserva(cupo));
        }
    });
    actualizarResumen();
}

function reservarCupo(cupo) {
    cupo.classList.remove("disponible");
    cupo.classList.add("ocupado");

    const estado = cupo.querySelector(".estado");
    estado.textContent = "🔴 Ocupado";

    // Cambiar botón
    const btn = cupo.querySelector("button");
    btn.textContent = "Cancelar";
    btn.className = "btn-cancelar";

    btn.onclick = () => cancelarReserva(cupo);

    console.log(`Cupo ${cupo.dataset.id} reservado`);

    actualizarResumen();
}

function cancelarReserva(cupo) {
    cupo.classList.remove("ocupado");
    cupo.classList.add("disponible");

    const estado = cupo.querySelector(".estado");
    estado.textContent = "🟢 Disponible";

    // Cambiar botón
    const btn = cupo.querySelector("button");
    btn.textContent = "Reservar";
    btn.className = "btn-reservar";

    btn.onclick = () => reservarCupo(cupo);

    console.log(`Reserva del cupo ${cupo.dataset.id} cancelada`);

    actualizarResumen();
}
function actualizarResumen() {
    const total = document.querySelectorAll(".cupo").length;
    const disponibles = document.querySelectorAll(".cupo.disponible").length;
    const ocupados = document.querySelectorAll(".cupo.ocupado").length;

    document.getElementById("total-cupos").textContent = total;
    document.getElementById("disponibles").textContent = disponibles;
    document.getElementById("ocupados").textContent = ocupados;
}