🚗 ParkApp - Sistema de Reservas de Parqueaderos (Sprint 2)

ParkApp es una plataforma para gestionar reservas de parqueaderos con frontend y backend desacoplados.

👥 Equipo de Trabajo
Integrante	Rol	Aporte
Alejandra	Arquitectura & Seguridad	Configuración de Spring Security y JWT
Oscar	UI/UX	Diseño visual y control de roles en frontend
Jhon Mario	Backend Auth	Endpoints de login, registro y seguridad
Juan Pablo	Catálogo	CRUD de productos y validaciones
Ayder	Reservas	Flujo de reservas y cancelaciones
🏗️ Arquitectura del Sistema

Frontend (HTML, CSS, JS)
⬇️
HTTP / JSON
⬇️
Backend (Spring Boot + JWT)

🔐 Autenticación
Funcionalidad	Método	Endpoint
Registrar usuario	POST	/api/auth/registro
Login	POST	/api/auth/login
Logout	POST	/api/auth/logout
Cambiar rol	PUT	/api/auth/usuarios/{id}/rol
🛠️ Gestión de Productos
Funcionalidad	Método	Endpoint	Acceso
Listar productos	GET	/productos	Público
Crear producto	POST	/productos	ADMIN
Categorías	GET	/productos/categorias	Público
Características	GET	/productos/caracteristicas	Público
📅 Reservas
Funcionalidad	Método	Endpoint
Ver mis reservas	GET	/api/reservas/mis-reservas
Cancelar reserva	PUT	/api/reservas/{id}/cancelar
Ver disponibilidad	GET	/productos/{id}/disponibilidad
🧠 Patrones de Diseño
Strategy → disponibilidad
Repository → manejo de datos
Filter → seguridad JWT
⚙️ Ejecución del Backend
cd Backend
.\mvnw.cmd clean install
java -jar target/Parqueaderos-0.0.1-SNAPSHOT.jar

Servidor disponible en:
👉 http://localhost:8080

🌐 Frontend

Abrir index.html con Live Server en VS Code.

🧪 Pruebas con Postman
🔐 Login
POST http://localhost:8080/api/auth/login
{
  "username": "admin",
  "password": "admin123"
}
🚗 Crear producto (ADMIN)
POST http://localhost:8080/productos
Authorization: Bearer TOKEN
{
  "name": "Parqueadero Norte",
  "description": "Cubierto",
  "category": "Cubierto"
}
🧹 Reinicio de datos

Frontend:
F12 → Application → LocalStorage → Clear

Backend:
Reiniciar aplicación

🚀 Estado del Proyecto
Backend funcional ✅
Seguridad con JWT ✅
CRUD completo ✅
Frontend conectado ✅
