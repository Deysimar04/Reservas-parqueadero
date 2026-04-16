import { obtenerPlazas, guardarPlazas } from "./api.js";
import { PlazaManager, ContadorObserver, NotificacionObserver } from "./patrones.js";


//
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

  const usuarios =
  JSON.parse(localStorage.getItem("usuarios")) || [];

  return usuarios.some(u => u.email === email);

}

function validarLogin(email, pass){

  if(!email || !pass){
    alert("Completa todos los campos");
    return null;
  }

  const usuarios =
  JSON.parse(localStorage.getItem("usuarios")) || [];

  const usuario = usuarios.find(u =>
    u.email === email && u.pass === pass
  );

  if(!usuario){
    alert("Credenciales incorrectas");
    return null;
  }

  return usuario;

}

function validarFecha(fecha){

  if(!fecha){
    return false;
  }

  const hoy = new Date().toISOString().split("T")[0];

  if(fecha < hoy){
    alert("No puedes usar fechas pasadas");
    return false;
  }

  return true;

}

// evitar doble reserva misma plaza + fecha
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

// Singleton
const manager = new PlazaManager();

// ========== INIT ==========
async function iniciar() {

  plazas = await obtenerPlazas();

  manager.suscribir(new ContadorObserver());
  manager.suscribir(new NotificacionObserver());

  manager.setPlazas(plazas);

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

function cargarSesion(){

  const user = localStorage.getItem("usuarioActual");

  if(user){
    usuarioActual = JSON.parse(user);
    mostrarHeaderUsuario();
  }else{
    mostrarHeaderLogin();
  }

}

function guardarSesion(user){

  localStorage.setItem("usuarioActual", JSON.stringify(user));

  usuarioActual = user;

  mostrarHeaderUsuario();

  actualizarEstadoUI();

  render();
  renderMisReservas();

}

function cerrarSesion(){

  localStorage.removeItem("usuarioActual");

  usuarioActual = null;

  mostrarHeaderLogin();

  actualizarEstadoUI();

  render();

}

function mostrarHeaderUsuario(){

  document.getElementById("headerBtns").style.display = "none";

  const headerUser = document.getElementById("headerUser");

  headerUser.style.display = "flex";

  const nombre = usuarioActual.nombre;

  const iniciales = nombre
  .split(" ")
  .map(n => n[0])
  .join("")
  .toUpperCase();

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

/* ================= BLOQUEO VISUAL ================= */

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

/* ================= FECHA ================= */

function obtenerFecha(){

  return document.getElementById("fechaReserva").value;

}

/* ================= RENDER ================= */

function render(){

  const cont = document.getElementById("parkingContainer");

  if(!usuarioActual){

    cont.innerHTML =
    "<div class='aviso-login'>Inicia sesión para ver y reservar plazas</div>";

    return;

  }

  filtrarPlazas();

  mostrarPlazas();

  actualizarContador();

  renderMisReservas();

}

function filtrarPlazas(){

  plazasFiltradas = [...plazas];

  if(zonaSeleccionada !== ""){

    plazasFiltradas = plazasFiltradas.filter(p =>
      p.zona.toLowerCase() === zonaSeleccionada.toLowerCase()
    );

  }

  if(tipoSeleccionado !== ""){

    plazasFiltradas = plazasFiltradas.filter(p =>
      p.tipo.toLowerCase() === tipoSeleccionado.toLowerCase()
    );

  }

}

function mostrarPlazas(){

  const cont = document.getElementById("parkingContainer");

  cont.innerHTML = "";

  if(plazasFiltradas.length === 0){

    cont.innerHTML =
    `<p>No hay plazas disponibles con estos filtros.</p>`;

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

        btnHtml =
        `<button class="btn-liberar">Liberar plaza</button>`;

      }else{

        btnHtml =
        `<button class="btn-ocupada">Plaza ocupada</button>`;

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

  //  SIN FECHA
  if(!fecha){
    errorSpan.classList.add("visible");
    document.getElementById("fechaReserva").focus();
    return;
  }

  errorSpan.classList.remove("visible");

  //  FECHA PASADA
  const hoy = new Date().toISOString().split("T")[0];
  if(fecha < hoy){
    alert("No puedes reservar en una fecha pasada");
    return;
  }

  //  PLAZA YA NO DISPONIBLE
  if(plazas[idx].estado !== "disponible"){
    alert("Esta plaza ya fue reservada");
    return;
  }

  //  USUARIO YA TIENE RESERVA ESE DÍA
  const yaTiene = plazas.some(p =>
    p.reservadoPor === usuarioActual.email &&
    p.fecha === fecha
  );

  if(yaTiene){
    alert("Ya tienes una reserva para esa fecha");
    return;
  }

  if(reservaDuplicada(plazas[idx].id, fecha)){
  alert("Esta plaza ya está reservada para esa fecha");
  return;
  }

  //  RESERVAR
  plazas[idx].reservadoPor = usuarioActual.email;

  manager.reservar(plazas[idx].id, fecha);

  plazas = manager.getPlazas();

  guardarPlazas(plazas);

  

  // Guardar quien reservó
      plazas[idx].reservadoPor = usuarioActual.email;

      manager.reservar(plazas[idx].id, fecha);

      plazas = manager.getPlazas();

    

      render();

});

card.querySelector(".btn-cancelar")?.addEventListener("click", () => {

  const esAdmin = usuarioActual.rol === "admin";
  const esDueno = plazas[idx].reservadoPor === usuarioActual.email;

  // Validación de permisos
  if (!esAdmin && !esDueno) {
    alert("No puedes cancelar una reserva que no es tuya");
    return;
  }

  // Notificación según quién cancela
if (esAdmin && !esDueno) {
  const dueno = plazas[idx].reservadoPor || "usuario desconocido";
  alert(`Reserva de ${dueno} cancelada por el administrador`);
} else {
  alert("Tu reserva ha sido cancelada correctamente");
}
  manager.cancelar(plazas[idx].id);
  plazas = manager.getPlazas();
  guardarPlazas(plazas);
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

  document.getElementById("totalPlazas").textContent =
  plazas.length;

  document.getElementById("plazasLibres").textContent =
  plazas.filter(p => p.estado === "disponible").length;

  document.getElementById("plazasReservadas").textContent =
  plazas.filter(p => p.estado === "reservado").length;

  document.getElementById("plazasOcupadas").textContent =
  plazas.filter(p => p.estado === "ocupado").length;

}

/* ================= MIS RESERVAS ================= */

function renderMisReservas(){

  const usuario = JSON.parse(localStorage.getItem("usuarioActual"));

  if(!usuario) return;

  const reservas = plazas.filter(
    p => p.reservadoPor === usuario.email
  );

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
        <p class="reserva-fecha"> ${p.fecha || "Sin fecha asignada"}</p>
      </div>
    `).join("");

  }

  section.style.display = "block";

}

/* ================= CATEGORIAS ================= */

function configurarCategorias(){

  const categorias =
  document.querySelectorAll(".categoria-card");

  categorias.forEach(card => {

    card.onclick = () => {

      if(!usuarioActual) return;

      categorias.forEach(c => c.classList.remove("activa"));

      card.classList.add("activa");

      tipoSeleccionado = card.dataset.tipo;

    };

  });

}

/* ================= BOTONES ZONA ================= */

function configurarBotonesZona(){

  document.querySelectorAll(".btn-zona").forEach(btn => {

    btn.onclick = () => {

      if(!usuarioActual) return;

      if(tipoSeleccionado === ""){

        alert("Primero selecciona un tipo de vehículo");

        return;

      }

      zonaSeleccionada =
      btn.closest(".zona-card")
      .querySelector("h3")
      .textContent;

      document.getElementById("fechaReservaContainer").style.display = "block";

      document.getElementById("btnVolver").style.display = "block";

      render();

      document
      .getElementById("parkingContainer")
      .scrollIntoView({behavior:"smooth"});

    };

  });

}

/* ================= LOGO ================= */

function configurarLogo(){

  document.querySelector(".logo").onclick =
  () => location.reload();

}

/* ================= BOTON VOLVER ================= */

function configurarBotonVolver(){

  document.getElementById("btnVolver").onclick = () => {

    zonaSeleccionada = "";

    tipoSeleccionado = "";

    document
    .querySelectorAll(".categoria-card")
    .forEach(c => c.classList.remove("activa"));

    document.getElementById("btnVolver").style.display = "none";

    document.getElementById("fechaReservaContainer").style.display = "none";

    document.getElementById("fechaReserva").value = "";

    document.getElementById("fechaError").classList.remove("visible");

    render();

    window.scrollTo({top:0,behavior:"smooth"});

  };

}

/* ================= MODALES ================= */

function configurarModales(){

  const mCrear = document.getElementById("modalCrear");

  const mLogin = document.getElementById("modalLogin");

  // ===== CREAR CUENTA =====
document.getElementById("btnCrearCuenta").onclick = () => {

  const nombre = document.getElementById("nombreCrear").value.trim();
  const email = document.getElementById("emailCrear").value.trim();
  const pass = document.getElementById("passCrear").value.trim();
  const rol = document.getElementById("rolCrear").value;

  if(!nombre || !email || !pass){
    alert("Todos los campos son obligatorios");
    return;
  }

  if(pass.length < 4){
    alert("La contraseña debe tener al menos 4 caracteres");
    return;
  }

  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  const existe = usuarios.find(u => u.email === email);

  if(existe){
    alert("Este correo ya está registrado");
    return;
  }

  const nuevoUsuario = { nombre, email, pass, rol };

  usuarios.push(nuevoUsuario);

  localStorage.setItem("usuarios", JSON.stringify(usuarios));

  alert("Cuenta creada correctamente");

  mCrear.style.display = "none";
};


// ===== LOGIN =====
document.getElementById("btnLogin").onclick = () => {

  const email = document.getElementById("emailLogin").value.trim();
  const pass = document.getElementById("passLogin").value.trim();

  if(!email || !pass){
    alert("Completa todos los campos");
    return;
  }

  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  const usuario = usuarios.find(u => u.email === email && u.pass === pass);

  if(!usuario){
    alert("Correo o contraseña incorrectos");
    return;
  }

  guardarSesion(usuario);

  mLogin.style.display = "none";
};

document.getElementById("btnHeaderCrear").onclick = () => {
  document.getElementById("nombreCrear").value = "";
  document.getElementById("emailCrear").value = "";
  document.getElementById("passCrear").value = "";
  document.getElementById("rolCrear").value = "usuario";

  mCrear.style.display = "flex";
};
document.getElementById("btnHeaderLogin").onclick =
  () => mLogin.style.display = "flex";

document.querySelectorAll(".cerrar").forEach(btn => {
  btn.addEventListener("click", () => {
    mCrear.style.display = "none";
    mLogin.style.display = "none";
  });
});

window.addEventListener("click", (e) => {
  if (e.target === mCrear) mCrear.style.display = "none";
  if (e.target === mLogin) mLogin.style.display = "none";
});
  document.getElementById("btnLogout").onclick =
  cerrarSesion;

}

iniciar();