import { obtenerReserva } from "./api.js";
import { generarCupos, generarDatosAleatorios } from "./ui.js";
import { authLogic } from "./auth.js";

document.addEventListener("DOMContentLoaded", async () => {
    const info = document.getElementById("info-vehiculo"); 
    const inputLugar = document.getElementById("input-lugar");
    const contenedorParqueadero = document.getElementById("parqueadero");
    const authContainer = document.getElementById("auth-container");
    const servicesContainer = document.getElementById("services-container");

    // Variable para rastrear qué tipo de vehículo está buscando el usuario
    let tipoVehiculoActual = "carro"; 

    // --- 1. SESIÓN ---
    if (authLogic.estaLogueado()) {
        const btnLogin = document.getElementById("btn-login-main");
        if (btnLogin) {
            btnLogin.innerText = "Cerrar Sesión";
            btnLogin.onclick = () => authLogic.cerrarSesion();
        }
        const btnReg = document.getElementById("btn-register-main");
        if (btnReg) btnReg.style.display = "none";
    }

    // --- 2. MODALES ---
    const mostrarForm = (tipo) => {
        authContainer.classList.remove("hidden");
        let html = "";
        if (tipo === 'login') {
            html = `<h2>Iniciar Sesión</h2>
                    <input type="email" id="auth-email" placeholder="Correo">
                    <input type="password" id="auth-pass" placeholder="Contraseña">
                    <button id="btn-auth-exec">Ingresar</button>
                    <p><a href="#" id="link-olvido" style="font-size:12px;">¿Olvidaste tu contraseña?</a></p>`;
        } else if (tipo === 'register') {
            html = `<h2>Crear Cuenta</h2>
                    <input type="email" id="auth-email" placeholder="Correo">
                    <input type="password" id="auth-pass" placeholder="Contraseña">
                    <button id="btn-auth-exec">Registrar</button>`;
        }
        document.getElementById("auth-content").innerHTML = html;
        
        document.getElementById("btn-auth-exec").onclick = () => {
            const e = document.getElementById("auth-email").value;
            const p = document.getElementById("auth-pass").value;
            if (tipo === 'login') authLogic.login(e, p);
            else if (tipo === 'register') { if(authLogic.registrar(e,p)) mostrarForm('login'); }
        };
    };

    document.getElementById("btn-login-main")?.addEventListener("click", () => mostrarForm('login'));
    document.getElementById("btn-register-main")?.addEventListener("click", () => mostrarForm('register'));
    document.getElementById("close-auth")?.addEventListener("click", () => authContainer.classList.add("hidden"));
    document.querySelector(".btn-vermas")?.addEventListener("click", () => servicesContainer.classList.remove("hidden"));
    document.getElementById("close-services")?.addEventListener("click", () => servicesContainer.classList.add("hidden"));

    // --- 3. CATEGORÍAS Y BUSCADOR ---
    const caracteristicas = {
        carro: "<h3>🚗 Carros</h3><p>Dimensiones: 2.5m x 5m. Niveles 1 y 2.</p>",
        moto: "<h3>🏍️ Motos</h3><p>Dimensiones: 1.2m x 2.5m. Zona preferencial.</p>",
        camion: "<h3>🚚 Camiones</h3><p>Dimensiones: 3.5m x 10m. Zona exterior.</p>",
        electrico: "<h3>⚡ Eléctricos</h3><p>Carga rápida disponible para tu vehículo.</p>"
    };

    document.querySelectorAll(".categoria").forEach(cat => {
        cat.addEventListener("click", () => {
            const tipo = cat.dataset.tipo;
            tipoVehiculoActual = tipo; // Actualizamos el tipo global
            if (info) info.innerHTML = caracteristicas[tipo];
            
            // Opcional: poner el texto en el buscador automáticamente
            if(inputLugar) {
                inputLugar.value = tipo;
                inputLugar.dispatchEvent(new Event('input'));
            }
        });
    });

    inputLugar?.addEventListener("input", () => {
        const f = inputLugar.value.toLowerCase().trim();
        
        // Detectar si el usuario escribe "electrico" o usa el filtro
        if(f.includes("electri")) tipoVehiculoActual = "electrico";
        else if(f.includes("moto")) tipoVehiculoActual = "moto";
        else if(f.includes("camion")) tipoVehiculoActual = "camion";
        else if(f !== "") tipoVehiculoActual = "carro";

        document.querySelectorAll(".cupo").forEach(c => {
            const match = c.textContent.toLowerCase().includes(f) || c.className.toLowerCase().includes(f);
            c.classList.toggle("no-relevante", f !== "" && !match);
            c.classList.toggle("resaltado", f !== "" && match);
        });
    });

    
    contenedorParqueadero?.addEventListener("click", (e) => {
        const btn = e.target;
        const cupo = btn.closest(".cupo");
        if (!cupo) return;
        const nCupo = cupo.querySelector("h3").innerText;

        if (btn.classList.contains("btn-reservar")) {
            if (!authLogic.estaLogueado()) {
                alert("⚠️ Inicia sesión para reservar.");
                mostrarForm('login');
                return;
            }
            
            let msg = ` ¡Reserva Exitosa!\nHas reservado el ${nCupo}.`;
            
            // OFERTA AUTOMÁTICA: Si el usuario seleccionó "Eléctrico" en categorías o buscador
            if (tipoVehiculoActual === "electrico") {
                if (confirm(msg + "\n\nDetectamos que tu vehículo es Eléctrico. ¿Deseas activar carga rápida por $5.000?")) {
                    alert("⚡ Servicio de carga vinculado a tu reserva.");
                } else {
                    alert(msg);
                }
            } else { 
                alert(msg + "\nRecuerda: Tiempo máximo 8 horas."); 
            }

            cupo.classList.replace("disponible", "reservado");
            cupo.querySelector(".estado-texto").innerText = "RESERVADO";
            btn.innerText = "Cancelar";
            btn.className = "btn-cancelar";
            actualizarContadores();
        } 
        
        else if (btn.classList.contains("btn-cancelar")) {
            if (cupo.classList.contains("ocupado")) {
                alert("🚫 No se puede cancelar, el vehículo ya está en el sitio.");
                return;
            }
            if (confirm(`¿Cancelar reserva del ${nCupo}?`)) {
                cupo.classList.remove("reservado");
                cupo.classList.add("disponible");
                cupo.querySelector(".estado-texto").innerText = "DISPONIBLE";
                btn.innerText = "Reservar";
                btn.className = "btn-reservar";
                actualizarContadores();
            }
        }
    });

    function actualizarContadores() {
        document.getElementById("disponibles").innerText = document.querySelectorAll(".cupo.disponible").length;
        document.getElementById("ocupados").innerText = document.querySelectorAll(".cupo.ocupado, .cupo.reservado").length;
    }

    // --- INICIO ---
    try {
        const data = await obtenerReserva();
        generarCupos(data?.reservations || generarDatosAleatorios());
    } catch {
        generarCupos(generarDatosAleatorios());
    }
    actualizarContadores();
});