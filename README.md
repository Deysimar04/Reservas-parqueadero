# ParkApp - Sistema de Gestión de reservas de parqueaderos (Sprint 2)

ParkApp es una plataforma integral para la reserva de plazas de estacionamiento. Durante este **Sprint 2**, hemos transformado una interfaz estática en una aplicación web dinámica que simula un ecosistema completo (**Frontend + Backend en memoria**), cumpliendo con estándares del historial de usuario .

---

##  Equipo y Distribución de Ingeniería


| Integrante    | Responsabilidad Técnica   | Aporte al Negocio                                                                 |
|-------------- |--------------------------|-----------------------------------------------------------------------------------|
| **Alejandra** | Arquitectura HTML        | Diseñó la base semántica y estructural de las vistas de usuario y administración.  |
| **Oscar**     | UI/UX & Roles            | Implementó el sistema visual responsive y la lógica de visibilidad basada en permisos. |
| **Jhon Mario**| Auth & API Mock          | Desarrolló el motor de autenticación, gestión de categorías y la simulación de persistencia. |
| **Juan Pablo**| Lógica de Catálogo       | Creó el CRUD de plazas, validaciones de integridad y motor de búsqueda de productos. |
| **Ayder**     | Notificaciones & Flujo   | Programó el sistema de reservas y la bandeja de mensajes (comunicación asíncrona). |

---

## Cumplimiento Técnico de Historias de Usuario (HU)

### 1. Gestión de Identidad y Seguridad (Auth)
- **HU13, HU14 & HU15 (Registro, Login, Logout):**
	- Implementamos un sistema de autenticación que valida campos obligatorios y formatos (email, fortaleza de contraseña).
	- La sesión se mantiene mediante localStorage y se invalida de forma segura al cerrar sesión.
- **HU16 (Roles):**
	- El sistema distingue entre Cliente y Administrador.
	- Los permisos están protegidos: un cliente no puede ver el botón ni acceder a la URL del panel administrativo.

### 2. Panel Administrativo y Catálogo (CRUD)
- **HU9 & HU10 (Panel y Listado):**
	- Se creó `/admin.html` que expone una tabla dinámica con todas las plazas del sistema en tiempo real.
- **HU3 (Registro de Productos):**
	- Formulario avanzado que incluye validación de duplicados (ID único) y carga simulada de imágenes.
- **HU12, HU21 & HU29 (Categorización Dinámica):**
	- El administrador puede crear nuevas categorías (ej. "Camiones").
	- El sistema bloquea la eliminación de una categoría si tiene plazas asociadas para evitar inconsistencias de datos.
- **HU17 (Características):**
	- Implementamos un sistema de "Tags" o características (Vigilancia, Techado) que se vinculan dinámicamente a cada producto en memoria.

### 3. Experiencia de Usuario y Mock de Backend
- **HU19 (Sistema de Notificaciones):**
	- Al registrarse o reservar, el sistema genera un "Email" simulado.
	- Esto se visualiza en una Bandeja de Entrada con un punto de notificación rojo en el header que indica mensajes no leídos.
- **HU23 (Visualización de Disponibilidad):**
	- Motor de filtrado que permite al usuario elegir una fecha y tipo de vehículo, devolviendo únicamente las plazas libres (Mock de disponibilidad basado en rangos de fecha).

---

##  Patrones de Diseño Aplicados

- **Patrón Observer:**
	- **¿Cómo funciona?** El PlazaManager actúa como el "Sujeto". Cuando una plaza cambia su estado (ej. de Disponible a Reservada), notifica automáticamente a los "Observadores" (el contador de la página, la bandeja de notificaciones y el mapa de plazas).
- **Patrón Repository / Manager (Singleton):**
	- **¿Cómo funciona?** Centralizamos toda la manipulación del localStorage en un solo lugar. Esto permite que si mañana cambiamos de LocalStorage a una API de Firebase o un Backend en Java, solo debamos editar un archivo.

---


## Instrucciones de Ejecución y Pruebas

Para visualizar y testear el sistema correctamente, siga estos pasos:

### 1. Requisitos Previos
- Navegador web moderno (Chrome, Edge o Firefox).
- Se recomienda el uso de la extensión **Live Server** (VS Code) para evitar problemas de permisos con módulos de JavaScript (`type="module"`).

### 2. Puesta en Marcha
- Clonar/Descargar el repositorio en su máquina local.
- Abrir la carpeta del proyecto en su editor de código.
- Ejecutar el archivo `index.html` mediante Live Server.
- El sistema inicializará automáticamente el Backend en Memoria (Local Storage) con los datos pre-sembrados de plazas y categorías.

### 3. Guía de Pruebas por Rol
#### A. Flujo de Cliente (Usuario Estándar):
- **Registro:** Vaya a "Crear cuenta" y regístrese con el rol Cliente.
- **Validación:** Revise la Bandeja de Mensajes (icono superior); debería ver su correo de bienvenida.
- **Reserva:** Seleccione un tipo de vehículo, una zona de parqueo y una fecha. Elija una plaza disponible y confirme. La burbuja de notificación se actualizará automáticamente.

#### B. Flujo de Administrador:
- **Acceso:** Regístrese o inicie sesión con una cuenta de rol Administrador.
- **Gestión:** Notará que aparece el botón "Panel Admin" en el header.
- **Control Total:** Ingrese al panel para:
	- **Categorías:** Crear o editar tipos de vehículos (esto actualizará los filtros de la página principal).
	- **Plazas:** Agregar nuevas plazas de parqueo o liberar plazas ocupadas manualmente.
	- **Seguridad:** Intente acceder a la URL de administración con una cuenta de Cliente; el sistema debería denegar el acceso o redirigirlo.

###  Depuración de Datos
Si desea reiniciar el sistema a su estado original (limpiar todas las reservas y usuarios creados):

1. Abra la consola del navegador (F12).
2. Vaya a la pestaña Application -> Local Storage.
3. Haga clic derecho y elija "Clear".
4. Refresque la página (F5).

---
