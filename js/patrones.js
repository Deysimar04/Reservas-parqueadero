// ============================================
// PATRÓN SINGLETON — PlazaManager
// Solo existe UNA instancia que maneja las plazas
// ============================================
class PlazaManager {
  constructor() {
    if (PlazaManager.instancia) {
      return PlazaManager.instancia;
    }
    this.plazas = [];
    this.observers = [];
    PlazaManager.instancia = this;
  }

  // Cargar plazas
  setPlazas(plazas) {
    this.plazas = plazas;
    this.notificar("carga");
    
  }

  // Reservar plaza
  reservar(id, fecha) {
    const plaza = this.plazas.find(p => p.id === id);
    if (!plaza) return;
    plaza.estado = "reservado";
    plaza.fecha  = fecha;
    this.guardar();
    this.notificar("reserva", plaza);
  }

  // Cancelar reserva
  cancelar(id) {
    const plaza = this.plazas.find(p => p.id === id);
    if (!plaza) return;
    plaza.estado = "disponible";
    plaza.fecha  = null;
    this.guardar();
    this.notificar("cancelar", plaza);
  }

  // Liberar plaza (admin)
  liberar(id) {
    const plaza = this.plazas.find(p => p.id === id);
    if (!plaza) return;
    plaza.estado = "disponible";
    plaza.fecha  = null;
    this.guardar();
    this.notificar("liberar", plaza);
  }

  // Guardar en localStorage
  guardar() {
    localStorage.setItem("plazas", JSON.stringify(this.plazas));
  }

  getPlazas() {
    return this.plazas;
  }

  // ============================================
  // PATRÓN OBSERVER
  // Registrar quién quiere ser notificado
  // ============================================
  suscribir(observer) {
    this.observers.push(observer);
  }

  // Notificar a todos los suscritos
  notificar(evento, data = null) {
    this.observers.forEach(obs => obs.actualizar(evento, data));
  }
}

// ============================================
// OBSERVERS — Reaccionan a cambios en plazas
// ============================================

// Observer 1: actualiza el contador de plazas
class ContadorObserver {
  actualizar(evento) {
    const manager = new PlazaManager();
    const plazas  = manager.getPlazas();

    document.getElementById("totalPlazas").textContent =
      plazas.length;
    document.getElementById("plazasLibres").textContent =
      plazas.filter(p => p.estado === "disponible").length;
    document.getElementById("plazasReservadas").textContent =
      plazas.filter(p => p.estado === "reservado").length;
    document.getElementById("plazasOcupadas").textContent =
      plazas.filter(p => p.estado === "ocupado").length;
  }
}

// Observer 2: muestra notificación según el evento
class NotificacionObserver {
  actualizar(evento, data) {
    const mensajes = {
      reserva:  `Plaza #${data?.id} reservada`,
      cancelar: ` Reserva de plaza #${data?.id} cancelada`,
      liberar:  `Plaza #${data?.id} liberada`,
      carga:    null
    };
    const msg = mensajes[evento];
    if (!msg) return;

    const el = document.getElementById("notificacion");
    if (!el) return;

    el.textContent = msg;
    el.style.opacity = "1";
    el.style.transform = "translateY(0)";
    el.style.background = evento === "reserva" ? "#27ae60" :
                          evento === "cancelar" ? "#e74c3c" : "#3498db";

    setTimeout(() => {
      el.style.opacity = "0";
      el.style.transform = "translateY(-20px)";
    }, 2000);
  }
}

export { PlazaManager, ContadorObserver, NotificacionObserver };