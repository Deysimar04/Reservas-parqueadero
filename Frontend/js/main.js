import {
  obtenerPlazas, guardarPlazas, obtenerDisponibilidad,
  registrarUsuario, loginUsuario, logoutUsuario,
  obtenerCategorias, obtenerCaracteristicas,
  crearReservaBackend, cancelarReservaBackend,
  obtenerReservasPorFecha, obtenerMisReservas,
  sesionValida, obtenerFavoritos, marcarFavorito, desmarcarFavorito
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
let favoritosIds = new Set();
let busquedaTexto = "";
let homePlazasOrden = [];

const manager = new PlazaManager();

// ========== INIT ==========
async function iniciar() {
  localStorage.removeItem("plazas");
  plazas = await obtenerPlazas();
  homePlazasOrden = plazas.slice().sort(() => Math.random() - 0.5).map(p => p.id);
  manager.suscribir(new ContadorObserver());
  manager.suscribir(new NotificacionObserver());
  manager.suscribir(new DisponibilidadObserver());
  manager.setPlazas(plazas);
  cargarSesion();
  configurarBotonesZona();
  await renderizarCategoriasHome();
  configurarBuscadorPlazas();
  configurarModalDetallePlaza();
  configurarLogo();
  configurarBotonVolver();
  configurarModales();
  actualizarEstadoUI();
  render();
}

// ========== SESIÓN ==========

function cargarSesion(){
  const user = localStorage.getItem("usuarioActual");
  if(user && sesionValida()){
    usuarioActual = JSON.parse(user);
    mostrarHeaderUsuario();
    actualizarBurbujaBandeja();
  }else{
    localStorage.removeItem("usuarioActual");
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
  await cargarFavoritos();
  mostrarPlazas();
  actualizarContador();
  renderMisReservas();
}

async function cargarFavoritos(){
  const favoritos = await obtenerFavoritos();
  favoritosIds = new Set(favoritos.map(f => Number(f.productoId)));
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
    const texto = [
      p.nombre,
      p.zona,
      p.tipo,
      p.category?.name,
      ...(p.features || []).map(f => f.name)
    ].join(" ").toLowerCase();
    const busquedaOk = busquedaTexto === "" || texto.includes(busquedaTexto);
    return zonaOk && tipoOk && busquedaOk;
  });

  if (!zonaSeleccionada && !tipoSeleccionado && !busquedaTexto) {
    plazasFiltradas = plazasFiltradas
      .slice()
      .sort((a, b) => homePlazasOrden.indexOf(a.id) - homePlazasOrden.indexOf(b.id))
      .slice(0, 10);
  }
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
    const esFavorito = favoritosIds.has(Number(plazaFiltrada.id));

    const fechaTexto = plazaFiltrada.fecha
      ? `<p class="plaza-fecha">Reservado para: ${plazaFiltrada.fecha}</p>`
      : "";
    const featuresHtml = renderFeatures(plazaFiltrada).slice(0, 3).map(f =>
      `<span class="plaza-feature">${f.icono} ${f.nombre}</span>`
    ).join("");

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
      <button class="btn-favorito ${esFavorito ? "activo" : ""}" title="${esFavorito ? "Quitar de favoritos" : "Marcar como favorito"}" aria-label="${esFavorito ? "Quitar de favoritos" : "Marcar como favorito"}">
        ${esFavorito ? "♥" : "♡"}
      </button>
      <h3>${plazaFiltrada.nombre || "Plaza #" + plazaFiltrada.id}</h3>
      <p>Zona: ${plazaFiltrada.zona}</p>
      <p>Tipo: ${plazaFiltrada.tipo}</p>
      <div class="plaza-features">${featuresHtml}</div>
      <p class="estado-texto">${estadoReal.toUpperCase()}</p>
      <p class="plaza-precio">💰 $${(plazaFiltrada.precioPorHora || 5000).toLocaleString("es-CO")}/hora</p>
      ${fechaTexto}
      <button class="btn-detalle" type="button">Ver detalle</button>
      ${btnHtml}
    `;

    // ✅ RESERVAR
    card.querySelector(".btn-favorito")?.addEventListener("click", async () => {
      const estabaMarcado = favoritosIds.has(Number(plazaFiltrada.id));
      const resultado = estabaMarcado
        ? await desmarcarFavorito(plazaFiltrada.id)
        : await marcarFavorito(plazaFiltrada.id);

      if (!resultado.ok) {
        alert("Error con favorito: " + resultado.error);
        return;
      }

      if (estabaMarcado) {
        favoritosIds.delete(Number(plazaFiltrada.id));
      } else {
        favoritosIds.add(Number(plazaFiltrada.id));
      }

      mostrarPlazas();
    });

    card.querySelector(".btn-detalle")?.addEventListener("click", () => {
      abrirDetallePlaza(plazaFiltrada, estadoReal);
    });

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

function renderFeatures(plaza) {
  const features = (plaza.features || []).map(f => ({
    nombre: f.name || f.nombre || "Caracteristica",
    icono: iconoFeature(f.name || f.nombre || "")
  }));

  if (features.length) return features;

  return [
    { nombre: plaza.extras?.techado ? "Cubierta" : "Exterior", icono: plaza.extras?.techado ? "T" : "A" },
    { nombre: plaza.extras?.camaras ? "Vigilancia" : "Iluminada", icono: plaza.extras?.camaras ? "V" : "L" },
    { nombre: "Acceso 24h", icono: "24" }
  ];
}

function iconoFeature(nombre) {
  const n = nombre.toLowerCase();
  if (n.includes("camar") || n.includes("vigil")) return "V";
  if (n.includes("tech") || n.includes("cub")) return "T";
  if (n.includes("ilumin")) return "L";
  if (n.includes("acces") || n.includes("discap")) return "A";
  if (n.includes("elect")) return "E";
  return "P";
}

function configurarBuscadorPlazas() {
  const input = document.getElementById("buscarPlaza");
  const btnBuscar = document.getElementById("btnBuscarPlaza");
  const btnLimpiar = document.getElementById("btnLimpiarBusqueda");
  if (!input || !btnBuscar || !btnLimpiar) return;

  const aplicarBusqueda = async () => {
    busquedaTexto = input.value.trim().toLowerCase();
    if (busquedaTexto) document.getElementById("btnVolver").style.display = "block";
    await render();
    document.getElementById("parkingContainer").scrollIntoView({ behavior: "smooth" });
  };

  input.addEventListener("input", () => actualizarSugerencias(input.value));
  input.addEventListener("keydown", e => {
    if (e.key === "Enter") aplicarBusqueda();
  });
  btnBuscar.onclick = aplicarBusqueda;
  btnLimpiar.onclick = async () => {
    input.value = "";
    busquedaTexto = "";
    await render();
  };
}

function actualizarSugerencias(valor) {
  const datalist = document.getElementById("sugerenciasPlazas");
  if (!datalist) return;
  const filtro = valor.trim().toLowerCase();
  const opciones = new Set();

  plazas.forEach(p => {
    [p.nombre, p.zona, p.tipo, p.category?.name].forEach(v => {
      if (v && (!filtro || String(v).toLowerCase().includes(filtro))) opciones.add(v);
    });
    (p.features || []).forEach(f => {
      const nombre = f.name || f.nombre;
      if (nombre && (!filtro || nombre.toLowerCase().includes(filtro))) opciones.add(nombre);
    });
  });

  datalist.innerHTML = [...opciones].slice(0, 8).map(v => `<option value="${v}"></option>`).join("");
}

function configurarModalDetallePlaza() {
  const modal = document.getElementById("modalDetallePlaza");
  const cerrar = document.getElementById("cerrarDetallePlaza");
  if (!modal || !cerrar) return;

  cerrar.onclick = () => modal.style.display = "none";
  modal.addEventListener("click", e => {
    if (e.target === modal) modal.style.display = "none";
  });
}

function abrirDetallePlaza(plaza, estado) {
  const modal = document.getElementById("modalDetallePlaza");
  const cont = document.getElementById("detallePlazaContenido");
  if (!modal || !cont) return;

  const features = renderFeatures(plaza).map(f => `
    <div class="detalle-feature"><span>${f.icono}</span><strong>${f.nombre}</strong></div>
  `).join("");

  cont.innerHTML = `
    <div class="detalle-header">
      <div>
        <p class="detalle-eyebrow">${plaza.zona || "Zona general"}</p>
        <h2>${plaza.nombre || "Plaza #" + plaza.id}</h2>
      </div>
      <span class="detalle-estado ${estado}">${estado.toUpperCase()}</span>
    </div>
    <div class="detalle-grid">
      <div class="detalle-imagen"></div>
      <div class="detalle-info">
        <p>${plaza.description || "Plaza disponible para reservas por dia, con horario operativo de 08:00 a 20:00."}</p>
        <p><strong>Tipo:</strong> ${plaza.tipo || plaza.category?.name || "General"}</p>
        <p><strong>Precio:</strong> $${(plaza.precioPorHora || 5000).toLocaleString("es-CO")}/hora</p>
        <div class="detalle-features">${features}</div>
      </div>
    </div>
    <div class="detalle-politicas">
      <h3>Politicas de reserva</h3>
      <div>
        <p><strong>Horario:</strong> disponible 24/7 para consulta y reservas de 08:00 a 20:00.</p>
        <p><strong>Cancelacion:</strong> puedes cancelar desde tu historial si la reserva es tuya.</p>
        <p><strong>Seguridad:</strong> ingreso sujeto a disponibilidad y validacion de la reserva.</p>
      </div>
    </div>
  `;
  modal.style.display = "flex";
}

async function renderMisReservas(){
  const usuario = JSON.parse(localStorage.getItem("usuarioActual"));
  if(!usuario) return;

  const cont    = document.getElementById("misReservas");
  const section = document.getElementById("misReservasSection");
  if(!cont || !section) return;

  // FIX: cargar reservas reales del backend
  const reservas = await obtenerMisReservas();

  if(!reservas || reservas.length === 0){
    cont.innerHTML = "<p style='color:#aaa;font-style:italic'>No tienes reservas activas</p>";
  }else{
    cont.innerHTML = reservas
      .filter(r => r.estado !== "CANCELLED")
      .map((r, idx) => `
        <div class="reserva-card">
          <div class="reserva-header" style="display:flex;justify-content:space-between;align-items:center;">
            <span><strong>${r.product?.name || "Plaza #" + r.product?.id}</strong></span>
            <button class="toggle-detalle" data-idx="${idx}" style="background:none;border:none;color:#007bff;cursor:pointer;font-size:16px;">Detalles ▼</button>
          </div>
          <div class="reserva-detalle" id="detalle-reserva-${idx}" style="display:none;margin-top:8px;">
            <p>Zona: ${r.product?.zona || "—"}</p>
            <p>Tipo: ${r.product?.category?.name || "—"}</p>
            <p class="reserva-fecha">📅 ${r.startTime?.split("T")[0] || "Sin fecha"}</p>
            <p style="font-size:12px;color:#888">Estado: ${r.estado}</p>
            <button class="btn-cancelar-reserva" data-id="${r.id}" style="background:#e74c3c;color:#fff;border:none;padding:6px 12px;border-radius:4px;cursor:pointer;margin-top:8px;">Cancelar</button>
          </div>
        </div>
      `).join("");
    // Eventos toggle detalle
    cont.querySelectorAll('.toggle-detalle').forEach(btn => {
      btn.addEventListener('click', function() {
        const idx = this.getAttribute('data-idx');
        const detalle = document.getElementById('detalle-reserva-' + idx);
        if(detalle.style.display === 'none'){
          detalle.style.display = 'block';
          this.textContent = 'Detalles ▲';
        }else{
          detalle.style.display = 'none';
          this.textContent = 'Detalles ▼';
        }
      });
    });
    // Evento cancelar reserva
    cont.querySelectorAll('.btn-cancelar-reserva').forEach(btn => {
      btn.addEventListener('click', async function() {
        if(!confirm('¿Seguro que deseas cancelar esta reserva?')) return;
        const reservaId = this.getAttribute('data-id');
        const reserva = reservas.find(r => r.id == reservaId);
        if(!reserva) return;
        const res = await cancelarReservaBackend(reserva.id);
        if(res.ok){
          guardarNotificacion('Reserva cancelada ❌', `Cancelaste la reserva de la plaza ${reserva.product?.name || reserva.product?.id}`);
          await renderMisReservas();
        }else{
          alert('Error al cancelar: ' + (res.error || 'Error desconocido'));
        }
      });
    });
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
    busquedaTexto = "";
    const buscarPlaza = document.getElementById("buscarPlaza");
    if (buscarPlaza) buscarPlaza.value = "";
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
    const usuarioOEmail = document.getElementById("emailLogin").value.trim();
    const pass     = document.getElementById("passLogin").value.trim();

    if (!usuarioOEmail || !pass) {
      alert("Completa todos los campos");
      return;
    }

    const resultado = await loginUsuario(usuarioOEmail, pass);
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
