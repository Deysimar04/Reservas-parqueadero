import { obtenerPlazas } from "./api.js";

let plazas = [];
let plazasFiltradas = [];
let zonaSeleccionada = "";
let tipoSeleccionado = "";
let usuarioActual = null;

async function iniciar() {
  plazas = await obtenerPlazas();
  plazasFiltradas = [...plazas];

  cargarSesion();
  configurarBotonesZona();
  configurarCategorias();
  configurarLogo();
  configurarBotonVolver();
  configurarModales();
  actualizarEstadoUI();
  render();
}

/* ================= SESIÓN ================= */
function cargarSesion() {
  const user = localStorage.getItem("usuarioActual");
  if (user) {
    usuarioActual = JSON.parse(user);
    mostrarHeaderUsuario();
  } else {
    mostrarHeaderLogin();
  }
}

function guardarSesion(user) {
  localStorage.setItem("usuarioActual", JSON.stringify(user));
  usuarioActual = user;
  mostrarHeaderUsuario();
  actualizarEstadoUI();
  render();
}

function cerrarSesion() {
  localStorage.removeItem("usuarioActual");
  usuarioActual = null;
  mostrarHeaderLogin();
  actualizarEstadoUI();
  render();
}

function mostrarHeaderUsuario() {
  document.getElementById("headerBtns").style.display = "none";
  const headerUser = document.getElementById("headerUser");
  headerUser.style.display = "flex";
  document.getElementById("usuarioActual").textContent = `Hola, ${usuarioActual.nombre}`;
}

function mostrarHeaderLogin() {
  document.getElementById("headerBtns").style.display = "flex";
  document.getElementById("headerUser").style.display = "none";
}

/* ================= BLOQUEO VISUAL ================= */
function actualizarEstadoUI() {
  const categorias = document.querySelectorAll(".categoria-card");
  const botonesZona = document.querySelectorAll(".btn-zona");

  if (!usuarioActual) {
    categorias.forEach(c => c.classList.add("deshabilitado"));
    botonesZona.forEach(b => b.disabled = true);
  } else {
    categorias.forEach(c => c.classList.remove("deshabilitado"));
    botonesZona.forEach(b => b.disabled = false);
  }
}

/* ================= FECHA ================= */
function obtenerFecha() {
  return document.getElementById("fechaReserva").value;
}

/* ================= RENDER ================= */
function render() {
  const cont = document.getElementById("parkingContainer");
  if (!usuarioActual) {
    cont.innerHTML = "<div class='aviso-login'>Inicia sesión para ver y reservar plazas</div>";
    return;
  }

  filtrarPlazas();
  mostrarPlazas();
  actualizarContador();
}

function filtrarPlazas() {
  plazasFiltradas = [...plazas];
  if (zonaSeleccionada !== "") {
    plazasFiltradas = plazasFiltradas.filter(p => p.zona.toLowerCase() === zonaSeleccionada.toLowerCase());
  }
  if (tipoSeleccionado !== "") {
    plazasFiltradas = plazasFiltradas.filter(p => p.tipo.toLowerCase() === tipoSeleccionado.toLowerCase());
  }
}

function mostrarPlazas() {
  const cont = document.getElementById("parkingContainer");
  cont.innerHTML = "";

  if (plazasFiltradas.length === 0) {
    cont.innerHTML = `<p>No hay plazas disponibles con estos filtros.</p>`;
    return;
  }

  plazasFiltradas.forEach(p => {
    // Índice real en el array principal
    const idx = plazas.findIndex(pl => pl.id === p.id);

    const card = document.createElement("div");
    card.className = `tarjeta ${plazas[idx].estado}`;

    const etiquetas = {
      techado:        { on: "Techado",   off: "Descubierto" },
      camaras:        { on: "Camaras",   off: "Sin camaras" },
      iluminado:      { on: "Iluminado", off: "Sin luz" },
      discapacitados: { on: "Accesible", off: "" }
    };

    const extrasHtml = Object.entries(plazas[idx].extras)
      .map(([clave, valor]) => {
        const etiqueta = etiquetas[clave];
        if (!etiqueta) return "";
        if (!valor && etiqueta.off === "") return "";
        return `<span class="extra-badge ${valor ? "extra-si" : "extra-no"}">
                  ${valor ? etiqueta.on : etiqueta.off}
                </span>`;
      }).join("");

    const fechaTexto = plazas[idx].fecha
      ? `<p class="plaza-fecha">Reservado para: ${plazas[idx].fecha}</p>`
      : "";

    let btnHtml = "";
    if      (plazas[idx].estado === "disponible") btnHtml = `<button class="btn-reservar">Reservar</button>`;
    else if (plazas[idx].estado === "reservado")  btnHtml = `<button class="btn-cancelar">Cancelar</button>`;
    else                                           btnHtml = `<button class="btn-ocupada">Plaza ocupada</button>`;

    card.innerHTML = `
      <h3>Plaza ${plazas[idx].id}</h3>
      <p>Zona: ${plazas[idx].zona}</p>
      <p>Vehiculo: ${plazas[idx].tipo}</p>
      <p class="estado-texto">${plazas[idx].estado.toUpperCase()}</p>
      <div class="extras-container">${extrasHtml}</div>
      ${fechaTexto}
      ${btnHtml}
    `;

    card.querySelector(".btn-reservar")?.addEventListener("click", () => {
      const fecha = obtenerFecha();
      const errorSpan = document.getElementById("fechaError");
      if (!fecha) {
        errorSpan.classList.add("visible");
        document.getElementById("fechaReserva").focus();
        return;
      }
      errorSpan.classList.remove("visible");
      plazas[idx].estado = "reservado";
      plazas[idx].fecha  = fecha;
      mostrarNotificacion(`Reservada para el ${fecha}`);
      render();
    });

    card.querySelector(".btn-cancelar")?.addEventListener("click", () => {
      plazas[idx].estado = "disponible";
      plazas[idx].fecha  = null;
      mostrarNotificacion("Reserva cancelada");
      render();
    });

    card.querySelector(".btn-ocupada")?.addEventListener("click", () => {
      mostrarNotificacion("Esta plaza ya esta ocupada, elige otra disponible");
    });

    cont.appendChild(card);
  });
}

function actualizarContador() {
  document.getElementById("totalPlazas").textContent = plazas.length;
  document.getElementById("plazasLibres").textContent = plazas.filter(p => p.estado === "disponible").length;
  document.getElementById("plazasReservadas").textContent = plazas.filter(p => p.estado === "reservado").length;
  document.getElementById("plazasOcupadas").textContent = plazas.filter(p => p.estado === "ocupado").length;
}

/* ================= CATEGORIAS ================= */
function configurarCategorias() {
  const categorias = document.querySelectorAll(".categoria-card");
  categorias.forEach(card => {
    card.onclick = () => {
      if (!usuarioActual) return;
      categorias.forEach(c => c.classList.remove("activa"));
      card.classList.add("activa");
      tipoSeleccionado = card.dataset.tipo;
      mostrarNotificacion("Seleccionado: " + tipoSeleccionado);
    };
  });
}

/* ================= BOTONES DE ZONA ================= */
function configurarBotonesZona() {
  document.querySelectorAll(".btn-zona").forEach(btn => {
    btn.onclick = () => {
      if (!usuarioActual) return;
      if (tipoSeleccionado === "") {
        mostrarNotificacion("Primero selecciona un tipo de vehiculo arriba");
        return;
      }
      zonaSeleccionada = btn.closest(".zona-card").querySelector("h3").textContent;
      document.getElementById("fechaReservaContainer").style.display = "block";
      document.getElementById("btnVolver").style.display = "block";
      render();
      document.getElementById("parkingContainer").scrollIntoView({ behavior: "smooth" });
    };
  });
}

/* ================= MODALES ================= */
function configurarModales() {
  const mCrear = document.getElementById("modalCrear");
  const mLogin = document.getElementById("modalLogin");

  document.getElementById("btnHeaderCrear").onclick = () => mCrear.style.display = "flex";
  document.getElementById("btnHeaderLogin").onclick = () => mLogin.style.display = "flex";

  document.querySelectorAll(".cerrar").forEach(btn => {
    btn.onclick = () => { mCrear.style.display = "none"; mLogin.style.display = "none"; };
  });

  window.onclick = (e) => { if (e.target.classList.contains("modal")) e.target.style.display = "none"; };

  document.getElementById("btnCrearCuenta").onclick = () => {
    const nombre = document.getElementById("nombreCrear").value;
    const email  = document.getElementById("emailCrear").value;
    const pass   = document.getElementById("passCrear").value;
    if (!nombre || !email || !pass) return;

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    usuarios.push({ nombre, email, pass });
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    guardarSesion({ nombre, email });
    mCrear.style.display = "none";
  };

  document.getElementById("btnLogin").onclick = () => {
    const email = document.getElementById("emailLogin").value;
    const pass  = document.getElementById("passLogin").value;
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const user = usuarios.find(u => u.email === email && u.pass === pass);

    if (user) {
      guardarSesion(user);
      mLogin.style.display = "none";
    } else {
      mostrarNotificacion("Error en datos");
    }
  };

  document.getElementById("btnLogout").onclick = cerrarSesion;
}

function configurarLogo() {
  document.querySelector(".logo").onclick = () => location.reload();
}

function configurarBotonVolver() {
  document.getElementById("btnVolver").onclick = () => {
    zonaSeleccionada = "";
    tipoSeleccionado = "";
    document.querySelectorAll(".categoria-card").forEach(c => c.classList.remove("activa"));
    document.getElementById("btnVolver").style.display = "none";
    document.getElementById("fechaReservaContainer").style.display = "none";
    document.getElementById("fechaReserva").value = "";
    document.getElementById("fechaError").classList.remove("visible");
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
}

function mostrarNotificacion(msj) {
  const n = document.getElementById("notificacion");
  n.textContent = msj;
  n.classList.add("mostrar");
  setTimeout(() => n.classList.remove("mostrar"), 2000);
}

iniciar();