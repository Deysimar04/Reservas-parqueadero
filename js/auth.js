export const authLogic = {
    // Recuperar usuarios de LocalStorage o empezar con lista vacía
    usuarios: JSON.parse(localStorage.getItem("usuarios")) || [],

    registrar(email, password) {
        if (this.usuarios.find(u => u.email === email)) {
            alert("❌ Este correo ya está registrado.");
            return false;
        }
        this.usuarios.push({ email, password });
        localStorage.setItem("usuarios", JSON.stringify(this.usuarios));
        alert("✅ Registro exitoso. Ahora puedes iniciar sesión.");
        return true;
    },

    login(email, password) {
        const usuario = this.usuarios.find(u => u.email === email && u.password === password);
        if (usuario) {
            localStorage.setItem("usuario_sesion", email); // Sesión persistente
            alert(` ¡Bienvenido de nuevo, ${email}!`);
            location.reload(); 
            return true;
        }
        alert("❌ Correo o contraseña incorrectos.");
        return false;
    },

    estaLogueado() {
        return localStorage.getItem("usuario_sesion") !== null;
    },

    cerrarSesion() {
        localStorage.removeItem("usuario_sesion");
        location.reload();
    }
};