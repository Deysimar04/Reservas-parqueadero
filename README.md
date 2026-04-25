ParkApp - Sistema de Gestión de Reservas de Parqueaderos (Sprint 2)

ParkApp es una plataforma integral para la reserva de plazas de estacionamiento.
En este Sprint 2 se desarrolló un ecosistema completo con:

Frontend estático (HTML, CSS, JS)
Backend en Java con Spring Boot
Seguridad con JWT
Arquitectura basada en patrones de diseño
Equipo y Distribución de Ingeniería
Integrante	Responsabilidad Técnica	Aporte
Alejandra	Arquitectura HTML & Backend Security	Diseño de vistas y configuración de Spring Security con JWT
Oscar	UI/UX & Roles	Lógica visual y control de permisos en frontend
Jhon Mario	Auth & API Backend	Endpoints de autenticación y seguridad JWT
Juan Pablo	Lógica de Catálogo	CRUD de productos y motor de búsqueda
Ayder	Reservas & Notificaciones	Sistema de reservas y validación de cancelaciones
 Arquitectura del Sistema
┌─────────────────────┐        HTTP/REST        ┌──────────────────────────┐
│     Frontend        │  ◄──────────────────►  │       Backend Java       │
│  HTML + CSS + JS    │      JSON Responses     │     Spring Boot 3.2     │
│  LocalStorage       │                        │  Spring Security + JWT  │
└─────────────────────┘                        └──────────────────────────┘
El frontend consume APIs REST
Autenticación con JWT
Token almacenado en localStorage

Header usado:

Authorization: Bearer <token>
Gestión de Identidad y Seguridad (Auth)
HU	Funcionalidad	Endpoint	Descripción
HU13	Registrar usuario	POST /api/auth/registro	Valida datos y evita duplicados
HU14	Login	POST /api/auth/login	Retorna JWT con rol
HU15	Logout	POST /api/auth/logout	El frontend elimina el token
HU16	Rol ADMIN	PUT /api/auth/usuarios/{id}/rol	Cambia roles (protegido)
🛠️ Panel Administrativo y Catálogo
HU	Funcionalidad	Endpoint	Acceso
HU9	Panel admin	/admin.html	ADMIN
HU10	Listar productos	GET /productos	Público
HU3	Crear producto	POST /productos	ADMIN
HU12	Categorías	GET /productos/categorias	Público
HU17	Características	GET /productos/caracteristicas	Público
Reservas y Disponibilidad
HU	Funcionalidad	Endpoint	Descripción
HU19	Notificación	Console log	Simula envío de correo
HU23	Disponibilidad	GET /productos/{id}/disponibilidad	Datos mock
 Patrones de Diseño
🔹 Strategy
AvailabilityStrategy
Permite cambiar lógica sin modificar controllers
🔹 Repository
Persistencia en memoria
Facilita migración a base de datos real
🔹 Filter (JWT)
JwtFilter
Intercepta peticiones y valida tokens
Endpoints del Backend
Método	Ruta	Acceso	Descripción
POST	/api/auth/registro	Público	Registrar usuario
POST	/api/auth/login	Público	Login
POST	/api/auth/logout	Público	Logout
PUT	/api/auth/usuarios/{id}/rol	Autenticado	Cambiar rol
GET	/productos	Público	Listar productos
POST	/productos	ADMIN	Crear producto
GET	/productos/categorias	Público	Categorías
GET	/productos/caracteristicas	Público	Características
GET	/productos/{id}/disponibilidad	Público	Disponibilidad
GET	/api/reservas/mis-reservas	Autenticado	Ver reservas
PUT	/api/reservas/{id}/cancelar	Autenticado	Cancelar reserva
⚙️ Instrucciones de Ejecución
🔧 Requisitos
Java 21
Maven
IntelliJ IDEA
Postman
VS Code + Live Server
Backend
cd Backend
.\mvnw.cmd clean install
java -jar target/Parqueaderos-0.0.1-SNAPSHOT.jar

Disponible en:

http://localhost:8080
Frontend
Abrir carpeta en VS Code
Ejecutar index.html con Live Server
Pruebas con Postman
Login ADMIN
POST http://localhost:8080/api/auth/login
{
  "username": "admin",
  "password": "admin123"
}
 Registrar usuario
POST http://localhost:8080/api/auth/registro
{
  "username": "maria",
  "email": "maria@gmail.com",
  "password": "123456"
}
Crear producto
POST http://localhost:8080/productos
Authorization: Bearer <token>
{
  "name": "Parqueadero Norte",
  "description": "Cubierto",
  "category": "Cubierto"
}
 Uso del Frontend
Cliente
Registro
Ver disponibilidad
Crear reservas
Administrador
Acceso a /admin.html
Crear productos
Gestionar usuarios
🧹 Depuración
Frontend
F12 → Application → LocalStorage → Clear
Backend
Reiniciar aplicación
