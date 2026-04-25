ParkApp - Sistema de Gestión de Reservas de Parqueaderos (Sprint 2)

ParkApp es una plataforma integral para la reserva de plazas de estacionamiento.
Durante este Sprint 2, se implementó una arquitectura completa con:

Frontend: HTML, CSS, JavaScript
Backend: Java + Spring Boot
Seguridad: Spring Security + JWT
👥 Equipo y Distribución de Ingeniería
Integrante	Responsabilidad Técnica	Aporte
Alejandra	Arquitectura HTML & Seguridad	Diseñó la estructura del frontend y configuró Spring Security con JWT.
Oscar	UI/UX & Roles	Implementó interfaz visual y control de permisos en el frontend.
Jhon Mario	Auth & API Backend	Desarrolló login, registro y sistema JWT.
Juan Pablo	Lógica de Catálogo	Implementó CRUD de productos y validaciones.
Ayder	Reservas & Notificaciones	Programó flujo de reservas y sistema de notificaciones.
🏗️ Arquitectura del Sistema
┌─────────────────────┐        HTTP/REST        ┌──────────────────────────┐
│     Frontend        │  ◄───────────────────►  │        Backend           │
│  HTML + CSS + JS    │        JSON             │  Spring Boot 3.2         │
│  LocalStorage       │                         │  Security + JWT          │
└─────────────────────┘                         └──────────────────────────┘
📌 Endpoints del Backend
Método	Ruta	Acceso	Descripción
POST	/api/auth/registro	Público	Registrar usuario
POST	/api/auth/login	Público	Login y obtención de JWT
POST	/api/auth/logout	Público	Cerrar sesión
PUT	/api/auth/usuarios/{id}/rol	Autenticado	Cambiar rol
GET	/productos	Público	Listar productos
POST	/productos	ADMIN	Crear producto
GET	/productos/categorias	Público	Listar categorías
GET	/productos/caracteristicas	Público	Listar características
GET	/productos/{id}/disponibilidad	Público	Ver disponibilidad
GET	/api/reservas/mis-reservas	Autenticado	Ver reservas
PUT	/api/reservas/{id}/cancelar	Autenticado	Cancelar reserva
🔐 Gestión de Identidad y Seguridad (Auth)
✔ HU13 — Registro
Endpoint: POST /api/auth/registro
Valida:
username
email
password
Detecta correos duplicados
✔ HU14 — Login
Endpoint: POST /api/auth/login
Retorna:
Token JWT
Rol del usuario
✔ HU15 — Logout
El frontend elimina el token del localStorage
✔ HU16 — Roles
ADMIN / USER
Controlado con Spring Security
🧩 Panel Administrativo y Catálogo
✔ HU9 — Panel Admin
Ruta: /admin.html
Protegido con hasRole("ADMIN")
✔ HU10 — Listar productos
Endpoint: GET /productos
✔ HU3 — Crear producto
Endpoint: POST /productos
Validaciones:
Nombre obligatorio
No duplicados
✔ HU12 — Categorías
Categorías iniciales:
Cubierto
Descubierto
Motos
Bicicletas
Discapacitados
✔ HU17 — Características
Ejemplos:
Seguridad 24h
Techado
Gestionadas por ProductFeatureRepository
📅 Reservas y Disponibilidad
✔ HU19 — Notificaciones
Simulación:
LOG: Enviando correo de bienvenida a usuario@email.com
✔ HU23 — Disponibilidad
Endpoint:
GET /productos/{id}/disponibilidad
Implementado con patrón Strategy
🧠 Patrones de Diseño
Patrón	Uso
Strategy	Manejo de disponibilidad
Repository	Persistencia en memoria
Filter (JWT)	Seguridad en cada request
⚙️ Instrucciones de Ejecución
🔹 Backend
Abrir en IntelliJ
Ejecutar:
ParqueaderosApplication.java
URL:
http://localhost:8080
🔹 Frontend
Abrir en VS Code
Ejecutar con Live Server
Acceder a:
index.html
🧪 Pruebas con Postman
🔑 Login ADMIN
POST http://localhost:8080/api/auth/login

Body:

{
  "username": "admin",
  "password": "admin123"
}
👤 Registrar usuario
POST http://localhost:8080/api/auth/registro
🚗 Crear producto
POST http://localhost:8080/productos
Authorization: Bearer TOKEN
🔄 Cambiar rol
PUT http://localhost:8080/api/auth/usuarios/2/rol
🧪 Pruebas en el Frontend
👤 Usuario
Registro
Ver disponibilidad
Reservar
👨‍💼 Admin
Acceso a panel
CRUD de productos
Gestión de usuarios
🧹 Depuración de Datos
Abrir consola (F12)
Ir a:
Application → Local Storage
Click derecho → Clear
Refrescar página
