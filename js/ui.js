// ui.js

// 🔹 GENERA LOS CUPOS DINÁMICAMENTE
export function generarCupos(cantidad = 10) {

    const contenedor = document.getElementById("parqueadero");

    if (!contenedor) return;

    contenedor.innerHTML = "";

    for (let i = 1; i <= cantidad; i++) {

        const cupo = document.createElement("div");

        cupo.className = "cupo disponible";
        cupo.dataset.id = i;

        cupo.innerHTML = `
            <h3>Cupo ${i}</h3>
            <p class="estado">🟢 Disponible</p>
            <button class="btn-reservar">Reservar</button>
        `;

        contenedor.appendChild(cupo);
    }

    actualizarResumen();
}


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


// 🔹 PINTA UNA RESERVA INDIVIDUAL
export function pintarReserva(data) {

    const id = data.spot_number || data.id;

    if (!id) return;

    const cupo = document.querySelector(`[data-id="${id}"]`);
    if (!cupo) return;

    const estado = cupo.querySelector(".estado");
    const btn = cupo.querySelector("button");

    cupo.classList.remove("disponible", "ocupado");

    if (data.status === "ocupado") {

        cupo.classList.add("ocupado");

        if (estado) estado.textContent = "🔴 Ocupado";

        if (btn) {
            btn.textContent = "Cancelar";
            btn.className = "btn-cancelar";
        }

    } else {

        cupo.classList.add("disponible");

        if (estado) estado.textContent = "🟢 Disponible";

        if (btn) {
            btn.textContent = "Reservar";
            btn.className = "btn-reservar";
        }
    }
}


// 🔹 PINTA TODAS LAS RESERVAS
export function pintarParqueadero(reservas = []) {

    reservas.forEach(reserva => {
        pintarReserva(reserva);
    });

    actualizarResumen();
}


// 🔹 ACTUALIZA CONTADORES
export function actualizarResumen() {

    const total = document.querySelectorAll(".cupo").length;

    const disponibles =
        document.querySelectorAll(".cupo.disponible").length;

    const ocupados =
        document.querySelectorAll(".cupo.ocupado").length;

    const totalElement = document.getElementById("total-cupos");
    const disponiblesElement = document.getElementById("disponibles");
    const ocupadosElement = document.getElementById("ocupados");

    if (totalElement) totalElement.textContent = total;
    if (disponiblesElement) disponiblesElement.textContent = disponibles;
    if (ocupadosElement) ocupadosElement.textContent = ocupados;
}