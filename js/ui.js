// ui.js

// 🔹 GENERA LOS CUPOS DINÁMICAMENTE
export function generarCupos(reservas = []) {

    const contenedor = document.getElementById("parqueadero");

    if (!contenedor) return;

    contenedor.innerHTML = "";

    // imágenes según tipo de vehículo
    const imagenes = {
        carro: "🚗",
        moto: "🏍️",
        camion: "🚚",
        electrico: "⚡",
        disponible: ""
    };

    reservas.forEach(reserva => {

        const cupo = document.createElement("div");

        let claseEstado = "disponible";
        let textoEstado = "🟢 Disponible";
        let boton = `<button class="btn-reservar">Reservar</button>`;

        if (reserva.status === "ocupado") {
            claseEstado = "ocupado";
            textoEstado = `🔴 Ocupado ${reserva.vehicle_plate ?? ""}`;
            boton = `<button class="btn-cancelar">Cancelar</button>`;
        }

        if (reserva.status === "reservado") {
            claseEstado = "reservado";
            textoEstado = `🟡 Reservado`;
            boton = `<button class="btn-cancelar">Cancelar</button>`;
        }

        // seleccionar imagen según tipo
        const tipoVehiculo = reserva.type ?? "disponible";
        const imagen = imagenes[tipoVehiculo] || imagenes.disponible;

        cupo.className = `cupo ${claseEstado}`;
        cupo.dataset.id = reserva.spot_number;

        cupo.innerHTML = `
            <h3>${imagen}</h3>
            <h3>Cupo ${reserva.spot_number}</h3>

            <p class="estado">${textoEstado}</p>

            ${boton}
        `;

        contenedor.appendChild(cupo);
    });

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