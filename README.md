 ParkApp - Sistema de Gestión de Reservas de Parqueaderos (Sprint 2)

ParkApp es una plataforma para la reserva de plazas de estacionamiento.

En este Sprint 2 se implementó:

Frontend (HTML, CSS, JS)
Backend con Spring Boot
Seguridad con JWT
Arquitectura basada en patrones
 Equipo
Integrante	Rol	Aporte
Alejandra	Arquitectura & Seguridad	JWT y estructura backend
Oscar	UI/UX	Interfaz y control de roles
Jhon Mario	Backend Auth	Login, registro y seguridad
Juan Pablo	Catálogo	CRUD productos
Ayder	Reservas	Flujo de reservas
 Arquitectura
Frontend (HTML/JS)
        ↓
     HTTP/JSON
        ↓
Backend (Spring Boot + JWT)
 Autenticación
Función	Endpoint	Método
Registro	/api/auth/registro	POST
Login	/api/auth/login	POST
Logout	/api/auth/logout	POST
Cambiar rol	/api/auth/usuarios/{id}/rol	PUT
🛠️ Productos
Función	Endpoint	Método	Acceso
Listar	/productos	GET	Público
Crear	/productos	POST	ADMIN
Categorías	/productos/categorias	GET	Público
Características	/productos/caracteristicas	GET	Público
 Reservas
Función	Endpoint	Método
Mis reservas	/api/reservas/mis-reservas	GET
Cancelar	/api/reservas/{id}/cancelar	PUT
Disponibilidad	/productos/{id}/disponibilidad	GET
 Patrones
Strategy → disponibilidad
Repository → datos en memoria
Filter → JWT
 Ejecutar Backend
cd Backend
.\mvnw.cmd clean install
java -jar target/Parqueaderos-0.0.1-SNAPSHOT.jar

 URL:

http://localhost:8080
🌐 Frontend
Abrir index.html con Live Server
 Pruebas en Postman
Login
POST http://localhost:8080/api/auth/login
{
  "username": "admin",
  "password": "admin123"
}
Crear producto
POST http://localhost:8080/productos
Authorization: Bearer TOKEN
{
  "name": "Parqueadero Norte",
  "description": "Cubierto",
  "category": "Cubierto"
}
 Reset

Frontend:
F12 → Application → LocalStorage → Clear

Backend:
Reiniciar app

 Estado
Backend funcional ✅
JWT funcionando ✅
CRUD completo ✅
Frontend conectado ✅
