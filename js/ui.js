export function generarCupos(reservas) {
    const contenedor = document.getElementById("parqueadero");
    // Ajuste de IDs según tu captura de pantalla
    const disponiblesH3 = document.getElementById("disponibles"); 
    const ocupadosH3 = document.getElementById("ocupados");
    const totalCuposH3 = document.getElementById("total-cupos");

    if (!contenedor) return;

    contenedor.innerHTML = "";
    let countDisponibles = 0;
    let countOcupados = 0;

    reservas.forEach(reserva => {
        const div = document.createElement("div");
        div.classList.add("cupo", reserva.estado.toLowerCase(), reserva.tipo.toLowerCase());

        div.innerHTML = `
            <span class="icono">${obtenerIcono(reserva.tipo)}</span>
            <h3>Cupo ${reserva.id}</h3>
            <p class="estado-texto">${reserva.estado.toUpperCase()}</p>
            <button class="${reserva.estado === 'disponible' ? 'btn-reservar' : 'btn-cancelar'}">
                ${reserva.estado === 'disponible' ? 'Reservar' : 'Cancelar'}
            </button>
        `;

        contenedor.appendChild(div);

        if (reserva.estado.toLowerCase() === "disponible") {
            countDisponibles++;
        } else {
            countOcupados++;
        }
    });

    // ACTUALIZACIÓN DE CONTADORES
    if (disponiblesH3) disponiblesH3.innerText = countDisponibles;
    if (ocupadosH3) ocupadosH3.innerText = countOcupados;
    if (totalCuposH3) totalCuposH3.innerText = reservas.length;
}

function obtenerIcono(tipo) {
    const iconos = { carro: "🚗", moto: "🏍️", camion: "🚚", electrico: "⚡" };
    return iconos[tipo.toLowerCase()] || "🅿️";
}

export function generarDatosAleatorios() {
    const tipos = ["carro", "moto", "camion", "electrico"];
    const estados = ["disponible", "ocupado", "reservado"];
    return Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        tipo: tipos[Math.floor(Math.random() * tipos.length)],
        estado: estados[Math.floor(Math.random() * estados.length)]
    }));
}