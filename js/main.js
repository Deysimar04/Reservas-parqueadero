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

/* ================= ROLES ================= */
function esAdmin() {
  return usuarioActual && usuarioActual.email === "admin@admin.com";
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

  // 🔥 Mostrar panel admin
  const btnAdmin = document.getElementById("btnAdmin");
  if (btnAdmin) {
    btnAdmin.style.display = esAdmin() ? "inline-block" : "none";
  }
}

function mostrarHeaderLogin() {
  document.getElementById("headerBtns").style.display = "flex";
  document.getElementById("headerUser").style.display = "none";
}

/* ================= BLOQUEO ================= */
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

/* ================= RENDER ================= */
function render() {
  const cont = document.getElementById("parkingContainer");

  if (!usuarioActual) {
    cont.innerHTML = "<div class='aviso-login'>Inicia sesión para ver plazas</div>";
    return;
  }

  filtrarPlazas();
  mostrarPlazas();
  actualizarContador();
}

/* ================= FILTRO POR ROL ================= */
function filtrarPlazas() {
  plazasFiltradas = [...plazas];

  // 🔥 CLIENTE SOLO VE DISPONIBLES Y SUYAS
  if (!esAdmin()) {
    plazasFiltradas = plazasFiltradas.filter(p =>
      p.estado === "disponible" || p.usuario === usuarioActual.email
    );
  }

  if (zonaSeleccionada !== "") {
    plazasFiltradas = plazasFiltradas.filter(p => p.zona === zonaSeleccionada);
  }

  if (tipoSeleccionado !== "") {
    plazasFiltradas = plazasFiltradas.filter(p => p.tipo === tipoSeleccionado);
  }
}

/* ================= MOSTRAR PLAZAS ================= */
function mostrarPlazas() {
  const cont = document.getElementById("parkingContainer");
  cont.innerHTML = "";

  plazasFiltradas.forEach(p => {

    const idx = plazas.findIndex(pl => pl.id === p.id);

    const card = document.createElement("div");
    card.className = `tarjeta ${plazas[idx].estado}`;

    let botones = "";

    if (plazas[idx].estado === "disponible") {
      botones = `<button class="btn-reservar">Reservar</button>`;
    }

    if (plazas[idx].usuario === usuarioActual.email) {
      botones += `<button class="btn-cancelar">Cancelar</button>`;
    }

    // 🔥 SOLO ADMIN
    if (esAdmin()) {
      botones += `<button class="btn-liberar">Liberar plaza</button>`;
    }

    card.innerHTML = `
      <h3>Plaza ${plazas[idx].id}</h3>
      <p>${plazas[idx].zona}</p>
      <p>${plazas[idx].tipo}</p>
      <p>${plazas[idx].estado}</p>
      ${botones}
    `;

    // RESERVAR
    card.querySelector(".btn-reservar")?.addEventListener("click", () => {
      plazas[idx].estado = "reservado";
      plazas[idx].usuario = usuarioActual.email;
      render();
    });

    // CANCELAR
    card.querySelector(".btn-cancelar")?.addEventListener("click", () => {
      plazas[idx].estado = "disponible";
      plazas[idx].usuario = null;
      render();
    });

    // 🔥 LIBERAR (ADMIN)
    card.querySelector(".btn-liberar")?.addEventListener("click", () => {
      plazas[idx].estado = "disponible";
      plazas[idx].usuario = null;
      render();
    });

    cont.appendChild(card);
  });
}

/* ================= CONTADOR ================= */
function actualizarContador() {
  document.getElementById("totalPlazas").textContent = plazas.length;
  document.getElementById("plazasLibres").textContent = plazas.filter(p => p.estado === "disponible").length;
  document.getElementById("plazasReservadas").textContent = plazas.filter(p => p.estado === "reservado").length;
  document.getElementById("plazasOcupadas").textContent = plazas.filter(p => p.estado === "ocupado").length;
}

/* ================= RESTO IGUAL ================= */

function configurarCategorias() {
  const categorias = document.querySelectorAll(".categoria-card");
  categorias.forEach(card => {
    card.onclick = () => {
      if (!usuarioActual) return;
      categorias.forEach(c => c.classList.remove("activa"));
      card.classList.add("activa");
      tipoSeleccionado = card.dataset.tipo;
    };
  });
}

function configurarBotonesZona() {
  document.querySelectorAll(".btn-zona").forEach(btn => {
    btn.onclick = () => {
      if (!usuarioActual) return;
      zonaSeleccionada = btn.closest(".zona-card").querySelector("h3").textContent;
      render();
    };
  });
}

function configurarModales() {
  const mCrear = document.getElementById("modalCrear");
  const mLogin = document.getElementById("modalLogin");

  document.getElementById("btnHeaderCrear").onclick = () => mCrear.style.display = "flex";
  document.getElementById("btnHeaderLogin").onclick = () => mLogin.style.display = "flex";

  document.getElementById("btnCrearCuenta").onclick = () => {
    const nombre = document.getElementById("nombreCrear").value;
    const email  = document.getElementById("emailCrear").value;
    const pass   = document.getElementById("passCrear").value;

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
    render();
  };
}

iniciar();