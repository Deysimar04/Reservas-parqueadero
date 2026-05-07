import {
  obtenerPlazas, guardarPlazas, obtenerDisponibilidad,
  registrarUsuario, loginUsuario, logoutUsuario,
  obtenerCategorias, obtenerCaracteristicas,
  crearReservaBackend, cancelarReservaBackend,
  obtenerReservasPorFecha, obtenerMisReservas
} from "./api.js";
import { PlazaManager, ContadorObserver, NotificacionObserver, DisponibilidadObserver } from "./patrones.js";

// ========== VALIDACIONES ==========

function validarRegistro(nombre, email, pass){
  if(!nombre || !email || !pass){ alert("Todos los campos son obligatorios"); return false; }
  if(nombre.length < 3){ alert("El nombre debe tener al menos 3 caracteres"); return false; }
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if(!regexEmail.test(email)){ alert("Email inválido"); return false; }
  const regexPass = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
  if(!regexPass.test(pass)){ alert("La contraseña debe tener mínimo 6 caracteres y un número"); return false; }
  return true;
}

function usuarioExiste(email){
  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  return usuarios.some(u => u.email === email);
}

// ========== NOTIFICACIONES / BANDEJA ==========

function guardarNotificacion(asunto, mensaje) {
  const usuario = JSON.parse(localStorage.getItem("usuarioActual"));
  if (!usuario) return;
  let bandeja = JSON.parse(localStorage.getItem("bandeja")) || [];
  const fechaLimpia = new Date().toLocaleString("es-CO", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: true
  });
  bandeja.push({ id: Date.now(), usuario: usuario.email, asunto, mensaje, fecha: fechaLimpia });
  localStorage.setItem("bandeja", JSON.stringify(bandeja));
  actualizarBurbujaBandeja();
}

function actualizarBurbujaBandeja() {
  const usuario = JSON.parse(localStorage.getItem("usuarioActual"));
  const burbuja = document.getElementById("badge-notif");
  if (!usuario || !burbuja) return;
  const bandeja = JSON.parse(localStorage.getItem("bandeja")) || [];
  const mensajesUsuario = bandeja.filter(m => m.usuario === usuario.email);
  if (mensajesUsuario.length > 0) {
    burbuja.style.display = "flex";
    burbuja.textContent = mensajesUsuario.length;
  } else {
    burbuja.style.display = "none";
  }
}

function cargarBandeja() {
  const usuario = JSON.parse(localStorage.getItem("usuarioActual"));
  const contenedor = document.getElementById("listaMensajes");
  let bandeja = JSON.parse(localStorage.getItem("bandeja")) || [];
  const mensajesUsuario = bandeja.filter(m => m.usuario === usuario.email);
  if (mensajesUsuario.length === 0) {
    contenedor.innerHTML = "<p>No tienes mensajes</p>";
    return;
  }
  contenedor.innerHTML = mensajesUsuario.map(m => `
    <div class="mensaje-card">
      <h4>${m.asunto}</h4>
      <p>${m.mensaje}</p>
      <small>${m.fecha}</small>
    </div>
  `).join("");
}

function limpiarBandeja() {
  const usuario = JSON.parse(localStorage.getItem("usuarioActual"));
  if (!usuario) return;
  let bandeja = JSON.parse(localStorage.getItem("bandeja")) || [];
  bandeja = bandeja.filter(m => m.usuario !== usuario.email);
  localStorage.setItem("bandeja", JSON.stringify(bandeja));
  cargarBandeja();
  actualizarBurbujaBandeja();
}

// ========== VARIABLES ==========
let plazas = [];
let plazasFiltradas = [];
let zonaSeleccionada = "";
let tipoSeleccionado = "";
let usuarioActual = null;

const manager = new PlazaManager();

// ========== INIT ==========
async function iniciar() {
  localStorage.removeItem("plazas");
  plazas = await obtenerPlazas();
  manager.suscribir(new ContadorObserver());
  manager.suscribir(new NotificacionObserver());
  manager.suscribir(new DisponibilidadObserver());
  manager.setPlazas(plazas);
  cargarSesion();
  configurarBotonesZona();
  await renderizarCategoriasHome();
  configurarLogo();
  configurarBotonVolver();
  configurarModales();
  actualizarEstadoUI();
  render();
}

// ========== SESIÓN ==========

function cargarSesion(){
  const user = localStorage.getItem("usuarioActual");
  if(user){
    usuarioActual = JSON.parse(user);
    mostrarHeaderUsuario();
    actualizarBurbujaBandeja();
  }else{
    mostrarHeaderLogin();
  }
}

function guardarSesion(user){
  localStorage.setItem("usuarioActual", JSON.stringify(user));
  usuarioActual = user;
  mostrarHeaderUsuario();
  actualizarEstadoUI();
  actualizarBurbujaBandeja();
  render();
  renderMisReservas();
}

async function cerrarSesion(){
  await logoutUsuario();
  usuarioActual = null;
  mostrarHeaderLogin();
  actualizarEstadoUI();
  const burbuja = document.getElementById("badge-notif");
  if(burbuja) burbuja.style.display = "none";
  // Ocultar mis reservas al cerrar sesión
  const section = document.getElementById("misReservasSection");
  if(section) section.style.display = "none";
  render();
}

function mostrarHeaderUsuario(){
  document.getElementById("headerBtns").style.display = "none";
  const headerUser = document.getElementById("headerUser");
  headerUser.style.display = "flex";
  const nombre = usuarioActual.nombre || usuarioActual.username || "U";
  const iniciales = nombre.split(" ").map(n => n[0]).join("").toUpperCase();
  document.querySelector(".avatar").textContent = iniciales;
  document.getElementById("usuarioActual").textContent = `Hola, ${nombre} (${usuarioActual.rol})`;
  const btnAdmin = document.getElementById("btnAdminPanel");
  if(usuarioActual.rol === "admin"){
    btnAdmin.style.display = "inline-block";
    btnAdmin.onclick = () => location.href = "admin.html";
  }else{
    btnAdmin.style.display = "none";
  }
}

function mostrarHeaderLogin(){
  document.getElementById("headerBtns").style.display = "flex";
  document.getElementById("headerUser").style.display = "none";
}

// ========== BLOQUEO VISUAL ==========

function actualizarEstadoUI(){
  const categorias = document.querySelectorAll(".categoria-card");
  const botonesZona = document.querySelectorAll(".btn-zona");
  if(!usuarioActual){
    categorias.forEach(c => c.classList.add("deshabilitado"));
    botonesZona.forEach(b => b.disabled = true);
  }else{
    categorias.forEach(c => c.classList.remove("deshabilitado"));
    botonesZona.forEach(b => b.disabled = false);
  }
}

// ========== FECHA ==========

function obtenerFecha(){
  return document.getElementById("fechaReserva").value;
}

// ========== RENDER ==========

async function render(){
  const cont = document.getElementById("parkingContainer");
  if(!usuarioActual){
    cont.innerHTML = "<div class='aviso-login'>Inicia sesión para ver y reservar plazas</div>";
    return;
  }
  await filtrarPlazas();
  mostrarPlazas();
  actualizarContador();
  renderMisReservas();
}

async function filtrarPlazas() {
  const fecha = obtenerFecha();
  let idsOcupados = new Set();

  if (fecha) {
    const ids = await obtenerReservasPorFecha(fecha);
    idsOcupados = new Set(ids);
  }

  // ✅ FIX: el estado se calcula desde plazasFiltradas, no desde plazas[]
  plazasFiltradas = plazas.map(p => ({
    ...p,
    estado: idsOcupados.has(p.id) ? "reservado" : "disponible"
  })).filter(p => {
    const zonaOk = zonaSeleccionada === "" || p.zona === zonaSeleccionada;
    const tipoOk = tipoSeleccionado === "" || p.tipo === tipoSeleccionado;
    return zonaOk && tipoOk;
  });
}

function mostrarPlazas(){
  const cont = document.getElementById("parkingContainer");
  cont.innerHTML = "";

  if(plazasFiltradas.length === 0){
    cont.innerHTML = `<p>No hay plazas disponibles con estos filtros.</p>`;
    return;
  }

  plazasFiltradas.forEach(plazaFiltrada => {
    // ✅ FIX: usar plazaFiltrada.estado (que viene de filtrarPlazas con datos reales)
    const estadoReal = plazaFiltrada.estado;

    // Si es reservado y no es el dueño ni admin, no mostrar
    if(
      usuarioActual.rol !== "admin" &&
      estadoReal === "reservado" &&
      plazaFiltrada.reservadoPor !== usuarioActual.email
    ){
      return;
    }

    const card = document.createElement("div");
    card.className = `tarjeta ${estadoReal}`;

    const fechaTexto = plazaFiltrada.fecha
      ? `<p class="plaza-fecha">Reservado para: ${plazaFiltrada.fecha}</p>`
      : "";

    // ✅ FIX: botones según estadoReal
    let btnHtml = "";
    if(estadoReal === "disponible"){
      btnHtml = `<button class="btn-reservar">Reservar</button>`;
    }else if(estadoReal === "reservado"){
      if(plazaFiltrada.reservadoPor === usuarioActual.email || usuarioActual.rol === "admin"){
        btnHtml = `<button class="btn-cancelar">Cancelar</button>`;
      }else{
        btnHtml = `<button class="btn-ocupada" disabled>Reservado</button>`;
      }
    }else if(estadoReal === "ocupado"){
      if(usuarioActual.rol === "admin"){
        btnHtml = `<button class="btn-liberar">Liberar plaza</button>`;
      }else{
        btnHtml = `<button class="btn-ocupada" disabled>Plaza ocupada</button>`;
      }
    }

    card.innerHTML = `
      <h3>${plazaFiltrada.nombre || "Plaza #" + plazaFiltrada.id}</h3>
      <p>Zona: ${plazaFiltrada.zona}</p>
      <p>Tipo: ${plazaFiltrada.tipo}</p>
      <p class="estado-texto">${estadoReal.toUpperCase()}</p>
      <p class="plaza-precio">💰 $${(plazaFiltrada.precioPorHora || 5000).toLocaleString("es-CO")}/hora</p>
      ${fechaTexto}
      ${btnHtml}
    `;

    // ✅ RESERVAR
    card.querySelector(".btn-reservar")?.addEventListener("click", async () => {
      const fecha = obtenerFecha();
      const errorSpan = document.getElementById("fechaError");

      if (!fecha) {
        errorSpan.classList.add("visible");
        document.getElementById("fechaReserva").focus();
        return;
      }
      errorSpan.classList.remove("visible");

      const hoy = new Date().toISOString().split("T")[0];
      if (fecha < hoy) {
        alert("No puedes reservar en una fecha pasada");
        return;
      }

      // Verificar disponibilidad real en backend
      const idsOcupados = await obtenerReservasPorFecha(fecha);
      if (idsOcupados.includes(plazaFiltrada.id)) {
        alert("Esta plaza ya está reservada para esa fecha");
        await render();
        return;
      }

      // Confirmación con precio
      const horas  = 12;
      const precio = (plazaFiltrada.precioPorHora || 5000) * horas;
      const ok = confirm(
        `¿Confirmar reserva?\n\n` +
        `Plaza: ${plazaFiltrada.nombre || "#" + plazaFiltrada.id}\n` +
        `Zona: ${plazaFiltrada.zona}\n` +
        `Fecha: ${fecha}\n` +
        `Horario: 08:00 – 20:00\n` +
        `Total: $${precio.toLocaleString("es-CO")}`
      );
      if (!ok) return;

      const resultado = await crearReservaBackend(plazaFiltrada.id, fecha);

      if (!resultado.ok) {
        alert("Error al reservar: " + resultado.error);
        return;
      }

      guardarNotificacion(
        "Reserva confirmada ✅",
        `Reservaste la plaza ${plazaFiltrada.nombre || "#"+plazaFiltrada.id} para el ${fecha}. Total: $${precio.toLocaleString("es-CO")}`
      );
      simularEnvioCorreo(usuarioActual, plazaFiltrada, fecha);

      // Recargar plazas desde backend para reflejar estado real
      plazas = await obtenerPlazas();
      manager.setPlazas(plazas);
      await render();
    });

    // ✅ CANCELAR
    card.querySelector(".btn-cancelar")?.addEventListener("click", async () => {
      const esAdmin = usuarioActual.rol === "admin";
      const esDueno = plazaFiltrada.reservadoPor === usuarioActual.email;

      if (!esAdmin && !esDueno) {
        alert("No puedes cancelar una reserva que no es tuya");
        return;
      }

      if (!confirm("¿Cancelar esta reserva?")) return;

      if (plazaFiltrada.reservaBackendId) {
        const res = await cancelarReservaBackend(plazaFiltrada.reservaBackendId);
        if (!res.ok) {
          alert("Error al cancelar: " + res.error);
          return;
        }
      }

      guardarNotificacion(
        "Reserva cancelada ❌",
        `Cancelaste la reserva de la plaza ${plazaFiltrada.nombre || "#"+plazaFiltrada.id}`
      );

      plazas = await obtenerPlazas();
      manager.setPlazas(plazas);
      await render();
    });

    // LIBERAR (admin)
    card.querySelector(".btn-liberar")?.addEventListener("click", async () => {
      if(usuarioActual.rol !== "admin") return;
      if (!confirm("¿Liberar esta plaza?")) return;
      plazas = await obtenerPlazas();
      manager.setPlazas(plazas);
      await render();
    });

    cont.appendChild(card);
  });
}

function actualizarContador(){
  const total      = plazas.length;
  const ocupadas   = plazasFiltradas.filter(p => p.estado === "reservado").length;
  const libres     = total - ocupadas;

  document.getElementById("totalPlazas").textContent       = total;
  document.getElementById("plazasLibres").textContent      = libres;
  document.getElementById("plazasReservadas").textContent  = ocupadas;
  document.getElementById("plazasOcupadas").textContent    = plazas.filter(p => p.estado === "ocupado").length;
}

// ========== MIS RESERVAS — desde backend ==========

async function renderMisReservas(){
  const usuario = JSON.parse(localStorage.getItem("usuarioActual"));
  if(!usuario) return;

  const cont    = document.getElementById("misReservas");
  const section = document.getElementById("misReservasSection");
  if(!cont || !section) return;

  // ✅ FIX: cargar reservas reales del backend
  const reservas = await obtenerMisReservas();

  if(!reservas || reservas.length === 0){
    cont.innerHTML = "<p style='color:#aaa;font-style:italic'>No tienes reservas activas</p>";
  }else{
    cont.innerHTML = reservas
      .filter(r => r.estado !== "CANCELLED")
      .map(r => `
        <div class="reserva-card">
          <p><strong>${r.product?.name || "Plaza #" + r.product?.id}</strong></p>
          <p>Zona: ${r.product?.zona || "—"}</p>
          <p>Tipo: ${r.product?.category?.name || "—"}</p>
          <p class="reserva-fecha">📅 ${r.startTime?.split("T")[0] || "Sin fecha"}</p>
          <p style="font-size:12px;color:#888">Estado: ${r.estado}</p>
        </div>
      `).join("");
  }

  section.style.display = "block";
}

// ========== CATEGORIAS ==========

function configurarCategorias(){
  const categorias = document.querySelectorAll(".categoria-card");
  categorias.forEach(card => {
    card.onclick = () => {
      if(!usuarioActual) return;
      categorias.forEach(c => c.classList.remove("activa"));
      card.classList.add("activa");
      tipoSeleccionado = card.dataset.tipo;
    };
  });
}

// ========== CATEGORÍAS DINÁMICAS HOME ==========

async function renderizarCategoriasHome() {
  const contenedor = document.getElementById("contenedorCategorias");
  if (!contenedor) return;

  const categoriasVehiculo = JSON.parse(localStorage.getItem("categoriasVehiculo")) || [
    { nombre: "automovil", label: "Automóvil", icono: "🚗" },
    { nombre: "camioneta", label: "Camioneta", icono: "🚙" },
    { nombre: "moto",      label: "Moto",      icono: "🏍️" }
  ];

  contenedor.innerHTML = categoriasVehiculo.map(cat => `
    <div class="categoria-card" data-tipo="${cat.nombre}">
      <div style="font-size:40px;margin-bottom:10px">${cat.icono}</div>
      <h3>${cat.label}</h3>
    </div>
  `).join("");

  configurarCategorias();
}

// ========== BOTONES ZONA ==========

function configurarBotonesZona(){
  document.querySelectorAll(".btn-zona").forEach(btn => {
    btn.onclick = () => {
      if(!usuarioActual) return;
      if(tipoSeleccionado === ""){
        alert("Primero selecciona un tipo de vehículo");
        return;
      }
      zonaSeleccionada = btn.closest(".zona-card").querySelector("h3").textContent;
      document.getElementById("fechaReservaContainer").style.display = "block";
      document.getElementById("btnVolver").style.display = "block";
      render();
      document.getElementById("parkingContainer").scrollIntoView({behavior:"smooth"});
    };
  });
}

// ========== LOGO ==========

function configurarLogo(){
  document.querySelector(".logo").onclick = () => location.reload();
}

// ========== BOTON VOLVER ==========

function configurarBotonVolver(){
  document.getElementById("btnVolver").onclick = () => {
    zonaSeleccionada = "";
    tipoSeleccionado = "";
    document.querySelectorAll(".categoria-card").forEach(c => c.classList.remove("activa"));
    document.getElementById("btnVolver").style.display = "none";
    document.getElementById("fechaReservaContainer").style.display = "none";
    document.getElementById("fechaReserva").value = "";
    document.getElementById("fechaError").classList.remove("visible");
    render();
    window.scrollTo({top:0, behavior:"smooth"});
  };
}

// ========== MODALES ==========

function configurarModales(){
  const mCrear = document.getElementById("modalCrear");
  const mLogin = document.getElementById("modalLogin");

  // HU13: Registro
  document.getElementById("btnCrearCuenta").onclick = async () => {
    const nombre = document.getElementById("nombreCrear").value.trim();
    const email  = document.getElementById("emailCrear").value.trim();
    const pass   = document.getElementById("passCrear").value.trim();
    const rol    = document.getElementById("rolCrear").value;

    if (!nombre || !email || !pass) {
      alert("Todos los campos son obligatorios");
      return;
    }

    const resultado = await registrarUsuario(nombre, email, pass, rol);
    if (!resultado.ok) {
      alert("Error: " + resultado.error);
      return;
    }

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    usuarios.push({ nombre, email, pass, rol });
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    simularCorreoBienvenida({ nombre, email, rol });
    alert("Cuenta creada correctamente");
    mCrear.style.display = "none";
  };

  // HU14: Login
  document.getElementById("btnLogin").onclick = async () => {
    const username = document.getElementById("emailLogin").value.trim();
    const pass     = document.getElementById("passLogin").value.trim();

    if (!username || !pass) {
      alert("Completa todos los campos");
      return;
    }

    const resultado = await loginUsuario(username, pass);
    if (resultado.ok) {
      const usuario = JSON.parse(localStorage.getItem("usuarioActual"));
      guardarSesion(usuario);
      mLogin.style.display = "none";
      return;
    }

    alert(resultado.error || "Credenciales incorrectas");
  };

  document.getElementById("btnHeaderCrear").onclick = () => mCrear.style.display = "flex";
  document.getElementById("btnHeaderLogin").onclick = () => mLogin.style.display = "flex";

  document.querySelectorAll(".cerrar").forEach(btn => {
    btn.addEventListener("click", () => {
      mCrear.style.display = "none";
      mLogin.style.display = "none";
    });
  });

  document.getElementById("btnLogout").onclick = cerrarSesion;
}

// ========== CORREOS SIMULADOS — HU19 ==========

function simularCorreoBienvenida(usuario) {
  const bandejaInterna = JSON.parse(localStorage.getItem("bandeja")) || [];
  bandejaInterna.push({
    id: Date.now(),
    usuario: usuario.email,
    asunto: "Bienvenido a ParkApp 🎉",
    mensaje: `Tu cuenta fue creada correctamente. Rol: ${usuario.rol}`,
    fecha: new Date().toLocaleString("es-CO", { hour: "2-digit", minute: "2-digit", hour12: true })
  });
  localStorage.setItem("bandeja", JSON.stringify(bandejaInterna));
  mostrarNotifCorreo("Correo de bienvenida enviado");
}

function simularEnvioCorreo(usuario, plaza, fecha) {
  const correo = {
    para: usuario.email,
    asunto: "Confirmación de reserva - ParkApp",
    mensaje: `Hola ${usuario.nombre || usuario.username}, tu reserva fue confirmada. Plaza: ${plaza.nombre || plaza.id} | Fecha: ${fecha}`,
    fechaEnvio: new Date().toLocaleString()
  };
  let bandeja = JSON.parse(localStorage.getItem("bandejaSalida")) || [];
  bandeja.push(correo);
  localStorage.setItem("bandejaSalida", JSON.stringify(bandeja));
  mostrarNotifCorreo("Correo enviado correctamente ✉️");
}

function mostrarNotifCorreo(mensaje) {
  const notif = document.getElementById("notifCorreo");
  if (!notif) return;
  notif.innerText = mensaje;
  notif.style.display = "block";
  setTimeout(() => { notif.style.display = "none"; }, 3000);
}

// ========== BANDEJA EVENTOS ==========

const btnBandeja        = document.getElementById("btnBandeja");
const modalBandeja      = document.getElementById("modalBandeja");
const cerrarBandeja     = document.getElementById("cerrarBandeja");
const btnLimpiarBandeja = document.getElementById("btnLimpiarBandeja");

btnLimpiarBandeja.addEventListener("click", () => {
  if (confirm("¿Seguro que quieres borrar todos tus mensajes?")) {
    limpiarBandeja();
  }
});

btnBandeja.addEventListener("click", () => {
  modalBandeja.style.display = "flex";
  cargarBandeja();
});

cerrarBandeja.addEventListener("click", () => {
  modalBandeja.style.display = "none";
});

iniciar();