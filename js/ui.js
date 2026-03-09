import { actualizarResumen } from "./reservas.js";

export function generarDatosAleatorios() {
    const tipos = ["carro", "moto", "camion", "electrico"];
    const estados = ["disponible", "ocupado", "reservado"];
    return Array.from({ length: 10 }, (_, i) => ({
        spot_number: i + 1,
        type: tipos[Math.floor(Math.random() * tipos.length)],
        status: estados[Math.floor(Math.random() * estados.length)],
        vehicle_plate: "ABC-" + Math.floor(100 + Math.random() * 900)
    }));
}

export function generarCupos(reservas = []) {
    const contenedor = document.getElementById("parqueadero");
    if (!contenedor) return;
    contenedor.innerHTML = "";

    const iconos = { carro: "🚗", moto: "🏍️", camion: "🚚", electrico: "⚡" };

    reservas.forEach(res => {
        const div = document.createElement("div");
        div.className = `cupo ${res.status}`;
        div.dataset.id = res.spot_number;
        
        const icono = iconos[res.type] || "🅿️";
        const btnTexto = res.status === "disponible" ? "Reservar" : "Cancelar";
        const btnClase = res.status === "disponible" ? "btn-reservar" : "btn-cancelar";

        div.innerHTML = `
            <h3>${icono}</h3>
            <h3>Cupo ${res.spot_number}</h3>
            <p class="estado">${res.status.toUpperCase()}</p>
            <button class="${btnClase}">${btnTexto}</button>
        `;
        contenedor.appendChild(div);
    });
    actualizarResumen();
}
