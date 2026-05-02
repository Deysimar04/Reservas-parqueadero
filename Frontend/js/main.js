import {
  obtenerPlazas, guardarPlazas, obtenerDisponibilidad,
  registrarUsuario, loginUsuario, logoutUsuario,
  obtenerCategorias, obtenerCaracteristicas
} from "./api.js";
import { PlazaManager, ContadorObserver, NotificacionObserver, DisponibilidadObserver } from "./patrones.js";

// ========== VALIDACIONES ==========

function validarRegistro(nombre, email, pass){
  if(!nombre || !email || !pass){
    alert("Todos los campos son obligatorios");
    return false;
  }
  if(nombre.length < 3){
    alert("El nombre debe tener al menos 3 caracteres");
    return false;
  }
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if(!regexEmail.test(email)){
    alert("Email inválido");
    return false;
  }
  const regexPass = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
  if(!regexPass.test(pass)){
    alert("La contraseña debe tener mínimo 6 caracteres y un número");
    return false;
  }
  return true;
}

function usuarioExiste(email){
  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  return usuarios.some(u => u.email === email);
}

function validarLogin(email, pass){
  if(!email || !pass){
    alert("Completa todos los campos");
    return null;
  }
  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  const usuario = usuarios.find(u => u.email === email && u.pass === pass);
  if(!usuario){
    alert("Credenciales incorrectas");
    return null;
  }
  return usuario;
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

  bandeja.push({
    id: Date.now(),
    usuario: usuario.email,
    asunto, mensaje,
    fecha: fechaLimpia
  });

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

function validarFecha(fecha){
  if(!fecha) return false;
  const hoy = new Date().toISOString().split("T")[0];
  if(fecha < hoy){
    alert("No puedes usar fechas pasadas");
    return false;
  }
  return true;
}

function reservaDuplicada(plazaId, fecha){
  return plazas.some(p =>
    p.id === plazaId &&
    p.fecha === fecha &&
    p.estado === "reservado"
  );
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
  await logoutUsuario(); // llama al backend y limpia token
  usuarioActual = null;
  mostrarHeaderLogin();
  actualizarEstadoUI();
  const burbuja = document.getElementById("badge-notif");
  if(burbuja) burbuja.style.display = "none";
  render();
}

function mostrarHeaderUsuario(){
  document.getElementById("headerBtns").style.display = "none";
  const headerUser = document.getElementById("headerUser");
  headerUser.style.display = "flex";
  const nombre = usuarioActual.nombre;
  const iniciales = nombre.split(" ").map(n => n[0]).join("").toUpperCase();
  document.querySelector(".avatar").textContent = iniciales;
  document.getElementById("usuarioActual").textContent =
    `Hola, ${usuarioActual.nombre} (${usuarioActual.rol})`;
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
    cont.innerHTML =
      "<div class='aviso-login'>Inicia sesión para ver y reservar plazas</div>";
    return;
  }
  await filtrarPlazas();
  mostrarPlazas();
  actualizarContador();
  renderMisReservas();
}

async function filtrarPlazas(){
  const fecha = obtenerFecha();
  const respuesta = await manager.consultarDisponibilidad(
    zonaSeleccionada, tipoSeleccionado, fecha
  );

  if (respuesta.ok) {
    const idsDisponibles = new Set(respuesta.plazas.map(p => p.id));
    plazasFiltradas = plazas.filter(p => {
      if (p.reservadoPor === usuarioActual?.email) return true;
      return idsDisponibles.has(p.id);
    });
  } else {
    plazasFiltradas = [...plazas];
    if (zonaSeleccionada !== "") {
      plazasFiltradas = plazasFiltradas.filter(p =>
        p.zona.toLowerCase() === zonaSeleccionada.toLowerCase()
      );
    }
    if (tipoSeleccionado !== "") {
      plazasFiltradas = plazasFiltradas.filter(p =>
        p.tipo.toLowerCase() === tipoSeleccionado.toLowerCase()
      );
    }
  }
}

function mostrarPlazas(){
  const cont = document.getElementById("parkingContainer");
  cont.innerHTML = "";

  if(plazasFiltradas.length === 0){
    cont.innerHTML = `<p>No hay plazas disponibles con estos filtros.</p>`;
    return;
  }

  plazasFiltradas.forEach(p => {
    const idx = plazas.findIndex(pl => pl.id === p.id);
    if(
      usuarioActual.rol !== "admin" &&
      plazas[idx].estado === "reservado" &&
      plazas[idx].reservadoPor !== usuarioActual.email
    ){
      return;
    }

    const card = document.createElement("div");
    card.className = `tarjeta ${plazas[idx].estado}`;

    const fechaTexto = plazas[idx].fecha
      ? `<p class="plaza-fecha">Reservado para: ${plazas[idx].fecha}</p>`
      : "";

    let btnHtml = "";
    if(plazas[idx].estado === "disponible"){
      btnHtml = `<button class="btn-reservar">Reservar</button>`;
    }else if(plazas[idx].estado === "reservado"){
      btnHtml = `<button class="btn-cancelar">Cancelar</button>`;
    }else if(plazas[idx].estado === "ocupado"){
      if(usuarioActual.rol === "admin"){
        btnHtml = `<button class="btn-liberar">Liberar plaza</button>`;
      }else{
        btnHtml = `<button class="btn-ocupada">Plaza ocupada</button>`;
      }
    }

    card.innerHTML = `
      <h3>Plaza ${plazas[idx].id}</h3>
      <p>Zona: ${plazas[idx].zona}</p>
      <p>Vehículo: ${plazas[idx].tipo}</p>
      <p class="estado-texto">${plazas[idx].estado.toUpperCase()}</p>
      ${fechaTexto}
      ${btnHtml}
    `;

    card.querySelector(".btn-reservar")?.addEventListener("click", () => {
      const fecha = obtenerFecha();
      const errorSpan = document.getElementById("fechaError");

      if(!fecha){
        errorSpan.classList.add("visible");
        document.getElementById("fechaReserva").focus();
        return;
      }
      errorSpan.classList.remove("visible");

      const hoy = new Date().toISOString().split("T")[0];
      if(fecha < hoy){
        alert("No puedes reservar en una fecha pasada");
        return;
      }
      if(plazas[idx].estado !== "disponible"){
        alert("Esta plaza ya fue reservada");
        return;
      }

      const yaTiene = plazas.some(p =>
        p.reservadoPor === usuarioActual.email && p.fecha === fecha
      );
      if(yaTiene){
        alert("Ya tienes una reserva para esa fecha");
        return;
      }
      if(reservaDuplicada(plazas[idx].id, fecha)){
        alert("Esta plaza ya está reservada para esa fecha");
        return;
      }

      const tieneReservaActiva = plazas.some(p =>
        p.reservadoPor === usuarioActual.email && p.estado === "reservado"
      );
      if (tieneReservaActiva) {
        alert("Ya tienes una plaza activa. Debes cancelarla antes de reservar otra.");
        return;
      }

      plazas[idx].reservadoPor = usuarioActual.email;
      manager.reservar(plazas[idx].id, fecha);
      plazas = manager.getPlazas();
      guardarPlazas(plazas);
      guardarNotificacion(
        "Reserva confirmada",
        `Reservaste la plaza ${plazas[idx].id} para el día ${fecha}`
      );
      simularEnvioCorreo(usuarioActual, plazas[idx], fecha);
      render();
    });

    card.querySelector(".btn-cancelar")?.addEventListener("click", () => {
      const esAdmin = usuarioActual.rol === "admin";
      const esDueno = plazas[idx].reservadoPor === usuarioActual.email;

      if (!esAdmin && !esDueno) {
        alert("No puedes cancelar una reserva que no es tuya");
        return;
      }

      manager.cancelar(plazas[idx].id);
      plazas = manager.getPlazas();
      guardarPlazas(plazas);

      if (esAdmin && !esDueno) {
        guardarNotificacion(
          "Reserva cancelada por administrador",
          `Tu reserva de la plaza ${plazas[idx].id} fue cancelada por un administrador`
        );
      } else {
        guardarNotificacion(
          "Reserva cancelada",
          `Cancelaste la reserva de la plaza ${plazas[idx].id}`
        );
      }
      render();
    });

    card.querySelector(".btn-liberar")?.addEventListener("click", () => {
      if(usuarioActual.rol !== "admin") return;
      manager.liberar(plazas[idx].id);
      plazas = manager.getPlazas();
      guardarPlazas(plazas);
      render();
    });

    cont.appendChild(card);
  });
}

function actualizarContador(){
  document.getElementById("totalPlazas").textContent       = plazas.length;
  document.getElementById("plazasLibres").textContent     = plazas.filter(p => p.estado === "disponible").length;
  document.getElementById("plazasReservadas").textContent = plazas.filter(p => p.estado === "reservado").length;
  document.getElementById("plazasOcupadas").textContent   = plazas.filter(p => p.estado === "ocupado").length;
}

// ========== MIS RESERVAS ==========

function renderMisReservas(){
  const usuario = JSON.parse(localStorage.getItem("usuarioActual"));
  if(!usuario) return;
  const reservas = plazas.filter(p => p.reservadoPor === usuario.email);
  const cont = document.getElementById("misReservas");
  const section = document.getElementById("misReservasSection");
  if(!cont || !section) return;

  if(reservas.length === 0){
    cont.innerHTML = "<p>No tienes reservas</p>";
  }else{
    cont.innerHTML = reservas.map(p => `
      <div class="reserva-card">
        <p><strong>Plaza #${p.id}</strong></p>
        <p>Zona: ${p.zona}</p>
        <p>Tipo: ${p.tipo}</p>
        <p class="reserva-fecha">${p.fecha || "Sin fecha asignada"}</p>
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

// ========== CATEGORÍAS DINÁMICAS HOME — ahora desde backend ==========

async function renderizarCategoriasHome() {
  const contenedor = document.getElementById("contenedorCategorias");
  if (!contenedor) return;

  // Intenta traer categorías del backend Java
  let categorias = await obtenerCategorias();

  // Si el backend falla, usa localStorage como fallback
  if (!categorias || categorias.length === 0) {
    categorias = JSON.parse(localStorage.getItem("categoriasVehiculo")) || [
      { nombre: "automovil", label: "Automóvil", icono: "🚗" },
      { nombre: "moto",      label: "Moto",       icono: "🏍️" }
    ];
    contenedor.innerHTML = categorias.map(cat => `
      <div class="categoria-card" data-tipo="${cat.nombre}">
        <div style="font-size:40px;margin-bottom:10px">${cat.icono || "🚗"}</div>
        <h3>${cat.label || cat.nombre}</h3>
      </div>
    `).join("");
  } else {
    // Backend devuelve strings simples como ["Cubierto","Motos",...]
    contenedor.innerHTML = categorias.map(cat => {
      const iconos = {
        "Cubierto": "🏠", "Descubierto": "☀️",
        "Motos": "🏍️", "Bicicletas": "🚲", "Discapacitados": "♿"
      };
      return `
        <div class="categoria-card" data-tipo="${cat.toLowerCase()}">
          <div style="font-size:40px;margin-bottom:10px">${iconos[cat] || "🚗"}</div>
          <h3>${cat}</h3>
        </div>
      `;
    }).join("");
  }

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

//modales

function configurarModales(){
  const mCrear  = document.getElementById("modalCrear");
  const mLogin  = document.getElementById("modalLogin");

  // HU13: Registro
  document.getElementById("btnCrearCuenta").onclick = async () => {
    const nombre = document.getElementById("nombreCrear").value.trim();
    const email  = document.getElementById("emailCrear").value.trim();
    const pass   = document.getElementById("passCrear").value.trim();

    if (!nombre || !email || !pass) {
      alert("Todos los campos son obligatorios");
      return;
    }

    const resultado = await registrarUsuario(nombre, email, pass);
    if (!resultado.ok) {
      alert("Error: " + resultado.error);
      return;
    }

    alert("Cuenta creada correctamente");
    mCrear.style.display = "none";
  };


  document.getElementById("btnLogin").onclick = async () => {
    const username = document.getElementById("emailLogin").value.trim(); // ← CAMBIO
    const pass  = document.getElementById("passLogin").value.trim();

    if (!username || !pass) {
      alert("Completa todos los campos");
      return;
    }

    const resultado = await loginUsuario(username, pass); // ← CAMBIO

    if (resultado.ok) {
      const usuario = JSON.parse(localStorage.getItem("usuarioActual"));
      guardarSesion(usuario);
      mLogin.style.display = "none";
      return;
    }

    alert(resultado.error || "Credenciales incorrectas");
  };

  document.getElementById("btnHeaderCrear").onclick = () => {
    mCrear.style.display = "flex";
  };

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
    asunto: "Bienvenido a ParkApp",
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
    mensaje: `Hola ${usuario.nombre}, tu reserva fue confirmada. Plaza: ${plaza.id} | Fecha: ${fecha}`,
    fechaEnvio: new Date().toLocaleString()
  };
  let bandeja = JSON.parse(localStorage.getItem("bandejaSalida")) || [];
  bandeja.push(correo);
  localStorage.setItem("bandejaSalida", JSON.stringify(bandeja));
  mostrarNotifCorreo("Correo enviado correctamente");
}

function mostrarNotifCorreo(mensaje) {
  const notif = document.getElementById("notifCorreo");
  if (!notif) return;
  notif.innerText = mensaje;
  notif.style.display = "block";
  setTimeout(() => { notif.style.display = "none"; }, 3000);
}

// ========== BANDEJA EVENTOS ==========

const btnBandeja       = document.getElementById("btnBandeja");
const modalBandeja     = document.getElementById("modalBandeja");
const cerrarBandeja    = document.getElementById("cerrarBandeja");
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