// ============================================================
// HU19 — Correo fake, bandeja de salida, modal confirmación
// Usa el patrón Observer que ya existe en patrones.js
// ============================================================
 
import { PlazaManager } from "./patrones.js";
 
// ============================================================
// ESTILOS
// ============================================================
const estilos = document.createElement("style");
estilos.textContent = `
  #notifCorreo {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%) translateY(-80px);
    background: #2980b9;
    color: #fff;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    opacity: 0;
    transition: opacity .4s, transform .4s;
    z-index: 9999;
    pointer-events: none;
    white-space: nowrap;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  }
  #notifCorreo.visible {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
  #notifHU19 {
    position: fixed;
    bottom: 30px;
    right: 30px;
    padding: 14px 22px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    color: #fff;
    opacity: 0;
    transform: translateY(20px);
    transition: opacity .4s, transform .4s;
    z-index: 9999;
    pointer-events: none;
    max-width: 340px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  }
  #notifHU19.visible {
    opacity: 1;
    transform: translateY(0);
  }
  #btnBandeja {
    background: #2980b9;
    color: #fff;
    border: none;
    padding: 8px 14px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
  }
  #btnBandeja:hover { background: #1f6391; }
 
  /* Modal confirmacion */
  #modalConfirmacion .modal-contenido {
    text-align: center;
    max-width: 420px;
  }
  .confirm-info {
    background: #f0f4f8;
    border-radius: 10px;
    padding: 16px;
    margin: 14px 0;
    text-align: left;
    font-size: 15px;
    line-height: 1.8;
  }
  .confirm-info.es-admin {
    background: #fdf3ff;
    border-left: 4px solid #8e44ad;
  }
  .confirm-info .etiqueta {
    color: #888;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: .5px;
  }
  .confirm-info .valor {
    font-weight: 700;
    color: #222;
  }
  .btn-ok {
    background: #27ae60; color:#fff; border:none;
    padding: 11px 26px; border-radius:7px;
    cursor:pointer; font-size:15px; font-weight:700;
    margin-right:10px;
  }
  .btn-ok:hover  { background:#1e8449; }
  .btn-no {
    background: #e74c3c; color:#fff; border:none;
    padding: 11px 26px; border-radius:7px;
    cursor:pointer; font-size:15px; font-weight:700;
  }
  .btn-no:hover { background:#c0392b; }
 
  /* Modal bandeja */
  #modalBandeja .modal-contenido {
    max-width: 650px;
    width: 95%;
    max-height: 85vh;
    overflow-y: auto;
  }
  .bandeja-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
  }
  .bandeja-contador {
    font-size: 13px;
    color: #888;
    background: #f0f4f8;
    padding: 4px 10px;
    border-radius: 20px;
  }
  .correo-item {
    border: 1px solid #dde3ea;
    border-radius: 10px;
    padding: 16px;
    margin-bottom: 12px;
    background: #fafbfc;
    transition: box-shadow .2s;
  }
  .correo-item:hover { box-shadow: 0 2px 10px rgba(0,0,0,0.08); }
  .correo-item.tipo-reserva  { border-left: 4px solid #27ae60; }
  .correo-item.tipo-cancelar { border-left: 4px solid #e74c3c; }
  .correo-item.tipo-admin    { border-left: 4px solid #8e44ad; }
  .correo-item.tipo-liberar  { border-left: 4px solid #3498db; }
  .correo-meta {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 8px;
    flex-wrap: wrap;
    gap: 4px;
  }
  .correo-para  { font-size: 13px; color: #555; }
  .correo-fecha { font-size: 11px; color: #aaa; }
  .correo-asunto { font-size: 15px; font-weight: 700; color: #222; margin-bottom: 8px; }
  .correo-cuerpo {
    font-size: 13px; color: #555; line-height: 1.7;
    background: #fff; padding: 10px 12px;
    border-radius: 6px; border: 1px solid #eee;
  }
  .correo-cuerpo .linea { margin-bottom: 4px; }
  .correo-cuerpo .firma {
    margin-top: 12px; color: #aaa;
    font-style: italic; font-size: 12px;
    border-top: 1px solid #eee; padding-top: 8px;
  }
  .bandeja-vacia {
    text-align: center; padding: 40px 0;
    color: #aaa; font-size: 15px; line-height: 2;
  }
  .btn-limpiar {
    margin-top: 16px; background: #e74c3c; color:#fff;
    border:none; padding: 8px 18px; border-radius:6px;
    cursor:pointer; font-size:13px;
  }
  .btn-limpiar:hover { background: #c0392b; }
`;
document.head.appendChild(estilos);
 
 
// ============================================================
// BANDEJA DE SALIDA
// ============================================================
let bandejaCorreos = JSON.parse(localStorage.getItem("bandejaCorreos")) || [];
 
function guardarBandeja() {
  localStorage.setItem("bandejaCorreos", JSON.stringify(bandejaCorreos));
}
 
function simularEnvioCorreo(para, asunto, htmlCuerpo, tipo = "reserva") {
  const correo = {
    id: Date.now() + Math.random(),
    para,
    asunto,
    cuerpo: htmlCuerpo,
    tipo,
    fecha: new Date().toLocaleString("es-CO", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit"
    })
  };
  bandejaCorreos.unshift(correo);
  guardarBandeja();
  mostrarNotifCorreo("📧 Correo enviado a " + para);
}
 
function renderBandeja() {
  const lista     = document.getElementById("listaBandeja");
  const contador  = document.getElementById("bandejaContador");
  if (!lista) return;
 
  bandejaCorreos = JSON.parse(localStorage.getItem("bandejaCorreos")) || [];
  if (contador) contador.textContent = bandejaCorreos.length + " correo(s)";
 
  if (bandejaCorreos.length === 0) {
    lista.innerHTML = `<div class="bandeja-vacia">📭 No hay correos enviados aún.<br><small>Aparecerán aquí cuando hagas reservas o cancelaciones.</small></div>`;
    return;
  }
 
  const iconos = { reserva:"🟢", cancelar:"🔴", admin:"🟣", liberar:"🔵" };
 
  lista.innerHTML = bandejaCorreos.map(c => `
    <div class="correo-item tipo-${c.tipo}">
      <div class="correo-meta">
        <span class="correo-para">📧 Para: <strong>${c.para}</strong></span>
        <span class="correo-fecha">🕐 ${c.fecha}</span>
      </div>
      <div class="correo-asunto">${iconos[c.tipo] || "📌"} ${c.asunto}</div>
      <div class="correo-cuerpo">${c.cuerpo}</div>
    </div>
  `).join("");
}
 
 
// ============================================================
// NOTIFICACIONES
// ============================================================
function mostrarNotifCorreo(msg) {
  const el = document.getElementById("notifCorreo");
  if (!el) return;
  el.textContent = msg;
  el.classList.add("visible");
  setTimeout(() => el.classList.remove("visible"), 3500);
}
 
function mostrarNotifAlerta(msg, tipo = "rojo") {
  const el = document.getElementById("notifHU19");
  if (!el) return;
  el.textContent = msg;
  el.style.background = tipo === "rojo" ? "#e74c3c" : tipo === "verde" ? "#27ae60" : "#2980b9";
  el.classList.add("visible");
  setTimeout(() => el.classList.remove("visible"), 3500);
}
 
 
// ============================================================
// PLANTILLAS DE CORREO
// ============================================================
function extras(plaza) {
  if (!plaza.extras) return "No especificados";
  const lista = [];
  if (plaza.extras.techado)        lista.push("🏠 Techado");
  if (plaza.extras.camaras)        lista.push("📷 Cámaras");
  if (plaza.extras.iluminado)      lista.push("💡 Iluminado");
  if (plaza.extras.discapacitados) lista.push("♿ Accesible");
  return lista.length ? lista.join(", ") : "Sin extras";
}
 
function tplReservaCliente(usuario, plaza, fecha) {
  return `
    <div class="linea">👋 Hola, <strong>${usuario.nombre}</strong></div>
    <div class="linea">Tu reserva ha sido <strong style="color:#27ae60">confirmada exitosamente</strong>.</div>
    <br>
    <div class="linea">🅿️ <strong>Plaza:</strong> #${plaza.id}</div>
    <div class="linea">📍 <strong>Zona:</strong> ${plaza.zona}</div>
    <div class="linea">🚗 <strong>Tipo de vehículo:</strong> ${plaza.tipo}</div>
    <div class="linea">📅 <strong>Fecha de reserva:</strong> ${fecha}</div>
    <div class="linea">✨ <strong>Extras:</strong> ${extras(plaza)}</div>
    <br>
    <div class="linea">Por favor llega <strong>10 minutos antes</strong> de tu hora reservada.</div>
    <div class="firma">— ParkApp · Sistema de Parqueadero</div>
  `;
}
 
function tplReservaAdmin(usuario, plaza, fecha) {
  return `
    <div class="linea">👤 <strong>[ADMINISTRADOR]</strong> ${usuario.nombre}</div>
    <div class="linea">Has registrado una reserva administrativa.</div>
    <br>
    <div class="linea">🅿️ <strong>Plaza:</strong> #${plaza.id}</div>
    <div class="linea">📍 <strong>Zona:</strong> ${plaza.zona}</div>
    <div class="linea">🚗 <strong>Tipo:</strong> ${plaza.tipo}</div>
    <div class="linea">📅 <strong>Fecha:</strong> ${fecha}</div>
    <div class="linea">✨ <strong>Extras:</strong> ${extras(plaza)}</div>
    <br>
    <div class="linea">Esta reserva quedó registrada bajo tu cuenta de administrador.</div>
    <div class="firma">— ParkApp · Panel Administrativo</div>
  `;
}
 
function tplCancelarCliente(usuario, plaza) {
  return `
    <div class="linea">👋 Hola, <strong>${usuario.nombre}</strong></div>
    <div class="linea">Tu reserva ha sido <strong style="color:#e74c3c">cancelada correctamente</strong>.</div>
    <br>
    <div class="linea">🅿️ <strong>Plaza cancelada:</strong> #${plaza.id}</div>
    <div class="linea">📍 <strong>Zona:</strong> ${plaza.zona}</div>
    <div class="linea">🚗 <strong>Tipo de vehículo:</strong> ${plaza.tipo}</div>
    <br>
    <div class="linea">La plaza ya está disponible para otros usuarios.</div>
    <div class="linea">Puedes hacer una nueva reserva cuando lo necesites.</div>
    <div class="firma">— ParkApp · Sistema de Parqueadero</div>
  `;
}
 
function tplCancelarAdminAlCliente(admin, plaza) {
  return `
    <div class="linea">⚠️ <strong>Aviso importante</strong></div>
    <div class="linea">El administrador <strong>${admin.nombre}</strong> ha cancelado tu reserva.</div>
    <br>
    <div class="linea">🅿️ <strong>Plaza cancelada:</strong> #${plaza.id}</div>
    <div class="linea">📍 <strong>Zona:</strong> ${plaza.zona}</div>
    <div class="linea">🚗 <strong>Tipo:</strong> ${plaza.tipo}</div>
    <br>
    <div class="linea">Si tienes dudas, comunícate directamente con el parqueadero.</div>
    <div class="linea">Lamentamos los inconvenientes ocasionados.</div>
    <div class="firma">— ParkApp · Sistema de Parqueadero</div>
  `;
}
 
function tplCancelarAdminConfirmacion(admin, plaza, dueno) {
  return `
    <div class="linea">👤 <strong>[ADMINISTRADOR]</strong> ${admin.nombre}</div>
    <div class="linea">Has cancelado exitosamente la siguiente reserva:</div>
    <br>
    <div class="linea">🅿️ <strong>Plaza:</strong> #${plaza.id}</div>
    <div class="linea">📍 <strong>Zona:</strong> ${plaza.zona}</div>
    <div class="linea">👤 <strong>Reserva pertenecía a:</strong> ${dueno}</div>
    <br>
    <div class="linea">El cliente fue notificado automáticamente.</div>
    <div class="firma">— ParkApp · Panel Administrativo</div>
  `;
}
 
function tplLiberarAdmin(usuario, plaza) {
  return `
    <div class="linea">👤 <strong>[ADMINISTRADOR]</strong> ${usuario.nombre}</div>
    <div class="linea">Has <strong style="color:#3498db">liberado</strong> la siguiente plaza:</div>
    <br>
    <div class="linea">🅿️ <strong>Plaza:</strong> #${plaza.id}</div>
    <div class="linea">📍 <strong>Zona:</strong> ${plaza.zona}</div>
    <div class="linea">🚗 <strong>Tipo:</strong> ${plaza.tipo}</div>
    <br>
    <div class="linea">La plaza ya está <strong>disponible</strong> para nuevas reservas.</div>
    <div class="firma">— ParkApp · Panel Administrativo</div>
  `;
}
 
 
// ============================================================
// OBSERVER DE CORREOS
// Se suscribe al PlazaManager Singleton que ya usa main.js
// Cuando main.js llama manager.reservar() o manager.cancelar(),
// este observer se activa automáticamente con los datos correctos
// ============================================================
let cancelContext = null;
 
class CorreoObserver {
  actualizar(evento, data) {
    const usuario = JSON.parse(localStorage.getItem("usuarioActual"));
    if (!usuario || !data) return;
 
    if (evento === "reserva") {
      const esAdmin = usuario.rol === "admin";
      if (esAdmin) {
        simularEnvioCorreo(
          usuario.email,
          "[Admin] Reserva registrada — Plaza #" + data.id,
          tplReservaAdmin(usuario, data, data.fecha),
          "admin"
        );
      } else {
        simularEnvioCorreo(
          usuario.email,
          "Confirmacion de reserva — Plaza #" + data.id,
          tplReservaCliente(usuario, data, data.fecha),
          "reserva"
        );
      }
    }
 
    if (evento === "cancelar" && cancelContext) {
      const { plazaOriginal, canceladoPor } = cancelContext;
      const esAdmin = canceladoPor.rol === "admin";
      const esDueno = plazaOriginal.reservadoPor === canceladoPor.email;
 
      if (esAdmin && !esDueno) {
        simularEnvioCorreo(
          plazaOriginal.reservadoPor,
          "Tu reserva fue cancelada — Plaza #" + plazaOriginal.id,
          tplCancelarAdminAlCliente(canceladoPor, plazaOriginal),
          "cancelar"
        );
        simularEnvioCorreo(
          canceladoPor.email,
          "[Admin] Cancelaste reserva de " + plazaOriginal.reservadoPor + " — Plaza #" + plazaOriginal.id,
          tplCancelarAdminConfirmacion(canceladoPor, plazaOriginal, plazaOriginal.reservadoPor),
          "admin"
        );
      } else {
        simularEnvioCorreo(
          canceladoPor.email,
          "Reserva cancelada — Plaza #" + plazaOriginal.id,
          tplCancelarCliente(canceladoPor, plazaOriginal),
          "cancelar"
        );
      }
      cancelContext = null;
    }
 
    if (evento === "liberar") {
      simularEnvioCorreo(
        usuario.email,
        "[Admin] Plaza liberada — Plaza #" + data.id,
        tplLiberarAdmin(usuario, data),
        "liberar"
      );
    }
  }
}
 
// Conectar al Singleton — misma instancia que usa main.js
const manager = new PlazaManager();
manager.suscribir(new CorreoObserver());
 
 
// ============================================================
// INTERCEPTOR — btn-reservar (captura, ANTES de main.js)
// Muestra modal de confirmacion. Si el usuario acepta,
// deja pasar el evento a main.js para que haga la reserva normal.
// ============================================================
document.getElementById("parkingContainer").addEventListener("click", (e) => {
  if (!e.target.classList.contains("btn-reservar")) return;
 
  const fecha = document.getElementById("fechaReserva").value;
  if (!fecha) return; // sin fecha: main.js muestra el error
 
  const hoy = new Date().toISOString().split("T")[0];
  if (fecha < hoy) return; // fecha pasada: main.js valida
 
  if (e.target.dataset.confirmado === "true") {
    delete e.target.dataset.confirmado;
    return; // ya confirmado, dejamos pasar
  }
 
  e.stopPropagation(); // bloqueamos main.js
 
  const card    = e.target.closest(".tarjeta");
  const plazaId = parseInt(card.querySelector("h3").textContent.replace("Plaza ", "").trim());
  const plazas  = JSON.parse(localStorage.getItem("plazas")) || [];
  const plaza   = plazas.find(p => p.id === plazaId);
  const usuario = JSON.parse(localStorage.getItem("usuarioActual"));
  const esAdmin = usuario?.rol === "admin";
  const btn     = e.target;
 
  const infoBox = document.getElementById("confirmInfoBox");
  infoBox.className = "confirm-info" + (esAdmin ? " es-admin" : "");
  infoBox.innerHTML = esAdmin ? `
    <div><span class="etiqueta">Modo</span><br><span class="valor">👤 Administrador</span></div><br>
    <div><span class="etiqueta">Plaza</span><br><span class="valor">#${plazaId} — ${plaza?.zona || ""}</span></div><br>
    <div><span class="etiqueta">Vehículo</span><br><span class="valor">${plaza?.tipo || ""}</span></div><br>
    <div><span class="etiqueta">Fecha</span><br><span class="valor">📅 ${fecha}</span></div>
    <br><small style="color:#8e44ad">La reserva quedará registrada bajo tu cuenta de administrador.</small>
  ` : `
    <div><span class="etiqueta">Plaza</span><br><span class="valor">#${plazaId} — ${plaza?.zona || ""}</span></div><br>
    <div><span class="etiqueta">Vehículo</span><br><span class="valor">${plaza?.tipo || ""}</span></div><br>
    <div><span class="etiqueta">Fecha</span><br><span class="valor">📅 ${fecha}</span></div>
    <br><small style="color:#555">Recibirás confirmación por correo al confirmar.</small>
  `;
 
  document.getElementById("modalConfirmacion").style.display = "flex";
 
  document.getElementById("btnConfirmarReserva").onclick = () => {
    document.getElementById("modalConfirmacion").style.display = "none";
    btn.dataset.confirmado = "true";
    btn.click();
  };
 
  document.getElementById("btnCancelarConfirmacion").onclick = () => {
    document.getElementById("modalConfirmacion").style.display = "none";
  };
 
}, true);
 
 
// ============================================================
// INTERCEPTOR — btn-cancelar (captura, ANTES de main.js)
// Bloquea intentos no autorizados con notificacion visual.
// Guarda contexto de la plaza antes de que main.js la cancele.
// ============================================================
document.getElementById("parkingContainer").addEventListener("click", (e) => {
  if (!e.target.classList.contains("btn-cancelar")) return;
 
  const card    = e.target.closest(".tarjeta");
  const plazaId = parseInt(card.querySelector("h3").textContent.replace("Plaza ", "").trim());
  const plazas  = JSON.parse(localStorage.getItem("plazas")) || [];
  const plaza   = plazas.find(p => p.id === plazaId);
  const usuario = JSON.parse(localStorage.getItem("usuarioActual"));
 
  if (!plaza || !usuario) return;
 
  const esAdmin = usuario.rol === "admin";
  const esDueno = plaza.reservadoPor === usuario.email;
 
  if (!esAdmin && !esDueno) {
    e.stopPropagation();
    mostrarNotifAlerta("🚫 No puedes cancelar una reserva que no es tuya", "rojo");
    return;
  }
 
  cancelContext = {
    plazaOriginal: { ...plaza },
    canceladoPor: usuario
  };
 
}, true);
 
 
// ============================================================
// BANDEJA — eventos de UI
// ============================================================
document.getElementById("btnBandeja")?.addEventListener("click", () => {
  renderBandeja();
  document.getElementById("modalBandeja").style.display = "flex";
});
 
document.getElementById("cerrarBandeja")?.addEventListener("click", () => {
  document.getElementById("modalBandeja").style.display = "none";
});
 
document.getElementById("modalBandeja")?.addEventListener("click", (e) => {
  if (e.target === document.getElementById("modalBandeja"))
    document.getElementById("modalBandeja").style.display = "none";
});
 
document.getElementById("modalConfirmacion")?.addEventListener("click", (e) => {
  if (e.target === document.getElementById("modalConfirmacion"))
    document.getElementById("modalConfirmacion").style.display = "none";
});
 
document.getElementById("btnLimpiarBandeja")?.addEventListener("click", () => {
  bandejaCorreos = [];
  guardarBandeja();
  renderBandeja();
});

const bandeja = [];

function generarHora() {
  return new Date().toLocaleTimeString();
}

export const EmailService = {

  enviarConfirmacionReserva(usuario, plazaId, fecha) {
    bandeja.push({
      para: usuario.email,
      de: "parqueadero@gmail.com",
      asunto: "Confirmación de Reserva",
      cuerpo: `Hola ${usuario.nombre},

Te notificamos que tu reserva fue realizada con éxito.

📍 Plaza: ${plazaId}
📅 Fecha: ${fecha}
⏰ Hora: ${generarHora()}

Gracias por usar nuestro sistema de parqueadero.`,
      fecha: new Date().toLocaleString(),
      estado: "Enviado"
    });
  },

  enviarConfirmacionCancelacion(usuario, plazaId, esDueno) {
    bandeja.push({
      para: usuario.email,
      de: "parqueadero@gmail.com",
      asunto: "Cancelación de Reserva",
      cuerpo: esDueno
        ? `Hola ${usuario.nombre},

Tu reserva de la plaza ${plazaId} ha sido cancelada correctamente.

⏰ Hora: ${generarHora()}`
        : `Hola ${usuario.nombre},

Un administrador ha cancelado tu reserva de la plaza ${plazaId}.

⏰ Hora: ${generarHora()}`,
      fecha: new Date().toLocaleString(),
      estado: "Enviado"
    });
  },

  notificarCancelacionNoAutorizada(usuario, duenoEmail, plazaId) {
    bandeja.push({
      para: usuario.email,
      de: "parqueadero@gmail.com",
      asunto: "Intento no autorizado",
      cuerpo: `Hola ${usuario.nombre},

Intentaste cancelar una reserva que no te pertenece.

🚫 Plaza: ${plazaId}
📧 Dueño: ${duenoEmail}

⏰ Hora: ${generarHora()}`,
      fecha: new Date().toLocaleString(),
      estado: "Bloqueado"
    });
  },

  getBandeja() {
    return bandeja;
  }
};