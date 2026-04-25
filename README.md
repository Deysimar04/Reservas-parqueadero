# ParkApp - Sistema de Gestión de Reservas de Parqueaderos (Sprint 2)

ParkApp es una plataforma integral para la reserva de plazas de estacionamiento.  
Durante este Sprint 2, se implementó una arquitectura completa con Frontend (HTML, CSS, JS) y Backend en Java con Spring Boot, incluyendo autenticación con JWT y control de roles.

---

## Equipo y Distribución de Ingeniería

| Integrante     | Responsabilidad Técnica        | Aporte                                                                 |
|----------------|------------------------------|------------------------------------------------------------------------|
| **Alejandra**  | Arquitectura HTML & Seguridad | Diseñó la estructura del frontend y configuró Spring Security con JWT. |
| **Oscar**      | UI/UX & Roles                | Implementó la interfaz visual y control de permisos en el frontend.   |
| **Jhon Mario** | Auth & API Backend           | Desarrolló login, registro y sistema de autenticación JWT.            |
| **Juan Pablo** | Lógica de Catálogo           | Implementó CRUD de productos y validaciones.                          |
| **Ayder**      | Reservas & Notificaciones    | Programó flujo de reservas y sistema de notificaciones.               |

---

## Arquitectura del Sistema
┌─────────────────────┐ HTTP/REST ┌──────────────────────────┐
│ Frontend │ <-------------------> │ Backend │
│ HTML + CSS + JS │ JSON │ Spring Boot │
│ LocalStorage │ │ Security + JWT │
└─────────────────────┘ └──────────────────────────┘

---

## Endpoints del Backend

| Método | Ruta | Acceso | Descripción |
|--------|------|--------|------------|
| POST | /api/auth/registro | Público | Registrar usuario |
| POST | /api/auth/login | Público | Login y obtención de JWT |
| POST | /api/auth/logout | Público | Cerrar sesión |
| PUT | /api/auth/usuarios/{id}/rol | Autenticado | Cambiar rol |
| GET | /productos | Público | Listar productos |
| POST | /productos | ADMIN | Crear producto |
| GET | /productos/categorias | Público | Listar categorías |
| GET | /productos/caracteristicas | Público | Listar características |
| GET | /productos/{id}/disponibilidad | Público | Ver disponibilidad |
| GET | /api/reservas/mis-reservas | Autenticado | Ver reservas |
| PUT | /api/reservas/{id}/cancelar | Autenticado | Cancelar reserva |

---

## Gestión de Identidad y Seguridad

### Registro
- Endpoint: POST /api/auth/registro  
- Valida username, email y contraseña  
- Detecta correos duplicados  

### Login
- Endpoint: POST /api/auth/login  
- Retorna token JWT con rol  

### Logout
- El frontend elimina el token del localStorage  

### Roles
- ADMIN y USER  
- Controlados con Spring Security  

---

## Panel Administrativo y Catálogo

### Panel Admin
- Ruta: /admin.html  
- Protegido con hasRole("ADMIN")  

### Listar productos
- Endpoint: GET /productos  

### Crear producto
- Endpoint: POST /productos  
- Valida campos obligatorios y duplicados  

### Categorías
- Cubierto  
- Descubierto  
- Motos  
- Bicicletas  
- Discapacitados  

### Características
- Seguridad 24h  
- Techado  

---

## Reservas y Disponibilidad

### Notificaciones
Simulación en consola:
LOG: Enviando correo de bienvenida

### Disponibilidad
- Endpoint: GET /productos/{id}/disponibilidad  
- Implementado con patrón Strategy  

---

## Patrones de Diseño

| Patrón | Uso |
|--------|-----|
| Strategy | Manejo de disponibilidad |
| Repository | Persistencia en memoria |
| Filter (JWT) | Seguridad en cada request |

---

## Instrucciones de Ejecución

### Backend

1. Abrir en IntelliJ  
2. Ejecutar:
3. ParqueaderosApplication.java
4. 3. Acceder a:
   http://localhost:8080


---

### Frontend

1. Abrir en VS Code  
2. Ejecutar con Live Server  
3. Abrir:
   index.html
   
## Pruebas con Postman

### Login ADMIN

POST http://localhost:8080/api/auth/login

Body:
json
{
  "username": "admin",
  "password": "admin123"
}

### registrar usuario

POST http://localhost:8080/api/auth/registro

### Crear producto

POST http://localhost:8080/productos

Header:
Authorization: Bearer TOKEN

### Cambiar rol

PUT http://localhost:8080/api/auth/usuarios/2/rol

### Pruebas en el Frontend
Usuario
Registro
Ver disponibilidad
Reservar
Administrador
Acceso al panel
CRUD de productos
Gestión de usuarios
Depuración de Datos
Abrir consola del navegador (F12)
Ir a Application → Local Storage
Click derecho → Clear
Refrescar la página
