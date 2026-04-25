ParkApp - Sistema de Gestión de Reservas de Parqueaderos (Sprint 2)
ParkApp es una plataforma integral para la reserva de plazas de estacionamiento. Durante este Sprint 2, hemos construido un ecosistema completo con Frontend estático (HTML/CSS/JS) y un Backend real en Java con Spring Boot, cumpliendo con los estándares definidos en las historias de usuario.

Equipo y Distribución de Ingeniería
IntegranteResponsabilidad TécnicaAporteAlejandraArquitectura HTML & Backend SecurityDiseñó la base semántica de las vistas y configuró Spring Security con JWT para control de acceso por roles.OscarUI/UX & RolesImplementó el sistema visual y la lógica de visibilidad basada en permisos en el frontend.Jhon MarioAuth & API BackendDesarrolló los endpoints de autenticación (registro, login, logout), gestión de categorías y la capa de seguridad JWT.Juan PabloLógica de CatálogoCreó el CRUD de productos, validaciones de integridad, motor de búsqueda y el endpoint de características.AyderNotificaciones & Flujo de ReservasProgramó el sistema de reservas, la bandeja de mensajes simulada y la validación de cancelación por usuario.

Arquitectura del Sistema
┌─────────────────────┐         HTTP/REST         ┌──────────────────────────┐
│   Frontend          │ ◄─────────────────────►   │   Backend Java           │
│   HTML + CSS + JS   │      JSON Responses        │   Spring Boot 3.2        │
│   LocalStorage      │                            │   Spring Security + JWT  │
└─────────────────────┘                            └──────────────────────────┘
El frontend consume los endpoints REST del backend. La autenticación se maneja con tokens JWT que el frontend guarda en localStorage y envía en cada petición con el header Authorization: Bearer <token>.

Cumplimiento Técnico de Historias de Usuario (HU)
1. Gestión de Identidad y Seguridad (Auth)
HU13 — Registrar usuario

Endpoint: POST /api/auth/registro
Valida campos obligatorios: username, email y contraseña.
Detecta emails duplicados y retorna error claro.
Simula envío de correo de bienvenida via System.out.println (HU19).

HU14 — Login

Endpoint: POST /api/auth/login
Retorna token JWT con rol embebido (ADMIN o USER).
Maneja errores: usuario no encontrado (401) y contraseña incorrecta (401).

HU15 — Cerrar sesión

Endpoint: POST /api/auth/logout
El frontend elimina el token de localStorage.
El backend confirma con respuesta 200.

HU16 — Identificar administrador

Endpoint: PUT /api/auth/usuarios/{id}/rol
Permite asignar o quitar el rol ADMIN a cualquier usuario.
Protegido por Spring Security: solo accesible con token válido.
El frontend oculta el botón "Panel Admin" si el rol no es ADMIN.

2. Panel Administrativo y Catálogo (CRUD)
HU9 — Panel de administración

Ruta frontend: /admin.html
El backend protege todas las rutas de escritura con hasRole("ADMIN").
Responde con 403 Forbidden en JSON si un usuario sin permisos intenta acceder.

HU10 — Listar productos

Endpoint: GET /productos
Devuelve todos los productos en memoria.
Público: no requiere token.

HU3 — Registrar producto

Endpoint: POST /productos
Requiere token de ADMIN.
Valida que el nombre no esté vacío y que no exista un producto duplicado.
Retorna error descriptivo si hay duplicado.

HU12 — Categorizar productos

Endpoint: GET /productos/categorias
Categorías pre-sembradas en memoria: Cubierto, Descubierto, Motos, Bicicletas, Discapacitados.
El campo category del producto se asigna al crear o editar.

HU17 — Administrar características de producto

Endpoint: GET /productos/caracteristicas
Características pre-sembradas: Seguridad 24h (shield), Techado (roof).
Gestionadas por ProductFeatureRepository con soporte para agregar nuevas.

3. Reservas y Disponibilidad
HU19 — Notificación de registro

Al registrarse, AuthService imprime en consola:
LOG: Enviando correo de bienvenida a <email>
Simula una cola de notificaciones asíncrona lista para conectar a un servicio real en Sprint 3.

HU23 — Visualizar disponibilidad

Endpoint: GET /productos/{id}/disponibilidad
Implementado con el patrón Strategy (AvailabilityStrategy).
MockAvailabilityService devuelve rangos de disponibilidad simulados por producto.


Patrones de Diseño Aplicados
Patrón Strategy — Disponibilidad

La interfaz AvailabilityStrategy define el contrato de verificación.
MockAvailabilityService implementa la lógica simulada para Sprint 2.
En Sprint 3 se reemplazará por una implementación real con base de datos sin tocar el Controller.

Patrón Repository — Persistencia en memoria

Cada entidad tiene su propio Repository (ProductRepository, UserRepository, ReservaRepository, CategoryRepository, ProductFeatureRepository).
Toda la manipulación de datos pasa por el Repository, lo que permite migrar a SQL/NoSQL en Sprint 3 editando solo esa capa.

Patrón Filter (Spring Security) — JWT

JwtFilter intercepta cada petición antes de llegar al Controller.
Extrae y valida el token, inyecta el usuario y su rol en el contexto de seguridad.
SecurityConfig define qué rutas son públicas y cuáles requieren rol ADMIN.


Endpoints del Backend
MétodoRutaAccesoDescripciónPOST/api/auth/registroPúblicoRegistrar nuevo usuarioPOST/api/auth/loginPúblicoLogin, retorna JWTPOST/api/auth/logoutPúblicoCerrar sesiónPUT/api/auth/usuarios/{id}/rolAutenticadoCambiar rol de usuarioGET/productosPúblicoListar todos los productosPOST/productosADMINRegistrar nuevo productoGET/productos/categoriasPúblicoListar categoríasGET/productos/caracteristicasPúblicoListar característicasGET/productos/{id}/disponibilidadPúblicoDisponibilidad mockGET/api/reservas/mis-reservasAutenticadoVer mis reservasPUT/api/reservas/{id}/cancelarAutenticadoCancelar reserva propia

Instrucciones de Ejecución
Requisitos Previos

Java 21
Maven
IntelliJ IDEA (recomendado)
Postman (para probar el backend)
Navegador moderno con extensión Live Server (para el frontend)

Puesta en Marcha del Backend

Abrir la carpeta Backend en IntelliJ IDEA.
Esperar a que Maven descargue las dependencias.
Ejecutar ParqueaderosApplication.java con el botón Run.
Verificar en consola: Started ParqueaderosApplication in X seconds.
El backend queda disponible en http://localhost:8080.

Puesta en Marcha del Frontend

Abrir la carpeta del frontend en VS Code.
Ejecutar index.html con la extensión Live Server.
El frontend se conecta automáticamente al backend en http://localhost:8080.


Guía de Pruebas
Con Postman (Backend)
Login como ADMIN:
POST http://localhost:8080/api/auth/login
Body: { "username": "admin", "password": "admin123" }
Copia el token de la respuesta y úsalo en las siguientes peticiones con:
Authorization: Bearer <token>
Registrar usuario:
POST http://localhost:8080/api/auth/registro
Body: { "username": "maria", "email": "maria@gmail.com", "password": "123456" }
Crear producto (requiere token ADMIN):
POST http://localhost:8080/productos
Authorization: Bearer <token>
Body: { "name": "Parqueadero Norte", "description": "Cubierto", "category": "Cubierto" }
Cambiar rol de usuario:
PUT http://localhost:8080/api/auth/usuarios/2/rol
Authorization: Bearer <token>
Body: { "role": "ADMIN" }
Con el Navegador (Frontend)
Flujo Cliente:

Ir a index.html y crear una cuenta con rol Cliente.
Revisar la bandeja de mensajes para ver el correo de bienvenida simulado.
Seleccionar fecha, tipo de vehículo y confirmar una reserva.

Flujo Administrador:

Iniciar sesión con rol Administrador.
Verificar que aparece el botón "Panel Admin" en el header.
Desde el panel: crear categorías, agregar plazas y gestionar usuarios.
Intentar acceder a /admin.html con cuenta de Cliente — el sistema debe denegar el acceso.

Depuración de Datos
Para reiniciar el frontend a su estado original:

Abrir consola del navegador (F12).
Ir a Application → Local Storage.
Clic derecho → Clear.
Refrescar la página (F5).

Para reiniciar el backend simplemente detén y vuelve a ejecutar la aplicación en IntelliJ — los datos en memoria se limpian automáticamente.
