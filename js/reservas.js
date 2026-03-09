// reservas.js - Lógica de reserva y contadores
export function inicializarReservas() {
    const contenedor = document.getElementById("parqueadero");
    if (!contenedor) return;

    contenedor.addEventListener("click", (event) => {
        const btn = event.target;
        if (!btn.matches(".btn-reservar, .btn-cancelar")) return;

        const cupo = btn.closest(".cupo");
        if (btn.classList.contains("btn-reservar")) {
            gestionarEstado(cupo, "ocupado", "🔴 Ocupado", "Cancelar", "btn-cancelar");
        } else {
            gestionarEstado(cupo, "disponible", "🟢 Disponible", "Reservar", "btn-reservar");
        }
    });
}

function gestionarEstado(cupo, clase, texto, btnTexto, btnClase) {
    const btn = cupo.querySelector("button");
    const estadoDiv = cupo.querySelector(".estado");

    cupo.classList.remove("disponible", "ocupado", "reservado");
    cupo.classList.add(clase);
    estadoDiv.textContent = texto;
    btn.textContent = btnTexto;
    btn.className = btnClase;

    actualizarResumen();
}

export function actualizarResumen() {
    const total = document.querySelectorAll(".cupo").length;
    const disponibles = document.querySelectorAll(".cupo.disponible").length;
    const ocupados = document.querySelectorAll(".cupo.ocupado").length + document.querySelectorAll(".cupo.reservado").length;

    if (document.getElementById("total-cupos")) document.getElementById("total-cupos").textContent = total;
    if (document.getElementById("disponibles")) document.getElementById("disponibles").textContent = disponibles;
    if (document.getElementById("ocupados")) document.getElementById("ocupados").textContent = ocupados;
}