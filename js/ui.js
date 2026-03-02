export function actualizarResumen() {

    const cupos = document.querySelectorAll(".cupo");
    const total = cupos.length;

    const disponibles =
        document.querySelectorAll(".cupo.disponible").length;

    const ocupados =
        document.querySelectorAll(".cupo.ocupado").length;

    // 🔎 VERIFICACIÓN AUTOMÁTICA 1:
    // Que todos los cupos tengan un estado válido
    cupos.forEach(cupo => {
        if (
            !cupo.classList.contains("disponible") &&
            !cupo.classList.contains("ocupado")
        ) {
            console.error("Cupo con estado inválido detectado:", cupo);
        }
    });

    // 🔎 VERIFICACIÓN AUTOMÁTICA 2:
    // Que los contadores coincidan con el total
    if (disponibles + ocupados !== total) {
        console.error("Desincronización detectada en contadores.");
    }

    // 🔎 VERIFICACIÓN AUTOMÁTICA 3:
    // Que no tenga ambas clases al mismo tiempo
    cupos.forEach(cupo => {
        if (
            cupo.classList.contains("disponible") &&
            cupo.classList.contains("ocupado")
        ) {
            console.error("Cupo con doble estado detectado:", cupo);
        }
    });

    // ✅ Actualizar UI
    document.getElementById("total-cupos").textContent = total;
    document.getElementById("disponibles").textContent = disponibles;
    document.getElementById("ocupados").textContent = ocupados;
}