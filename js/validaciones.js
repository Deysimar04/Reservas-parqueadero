// validaciones.js

export function validarReserva(data) {

    if (!data.vehicle_plate || data.vehicle_plate.trim() === "") {
        alert("Debe ingresar una placa.");
        return false;
    }

    if (!data.start_time || !data.end_time) {
        alert("Debe seleccionar fechas.");
        return false;
    }

    const inicio = new Date(data.start_time);
    const fin = new Date(data.end_time);

    if (inicio >= fin) {
        alert("La fecha inicial debe ser menor a la final.");
        return false;
    }

    return true;
}