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

1. HU13 — Registrar usuario

Método: POST
URL: http://localhost:8080/api/auth/registro
Body → raw → JSON:

json{
  "username": "maria",
  "email": "maria@gmail.com",
  "password": "123456"
}

Respuesta esperada:

json{"mensaje": "Usuario registrado con éxito"}

2. HU14 — Login

Método: POST
URL: http://localhost:8080/api/auth/login
Body → raw → JSON:

json{
  "username": "admin",
  "password": "admin123"
}

Respuesta esperada:

json{
  "token": "eyJhbGc...",
  "role": "ADMIN",
  "username": "admin"
}
⚠️ Copia el token, lo necesitas para las pruebas siguientes

3. HU16 — Cambiar rol

Método: PUT
URL: http://localhost:8080/api/auth/usuarios/2/rol
Headers:

Authorization    Bearer <token>

Body → raw → JSON:

json{
  "role": "ADMIN"
}

Respuesta esperada:

json{"mensaje": "Rol actualizado a ADMIN"}

4. HU15 — Logout

Método: POST
URL: http://localhost:8080/api/auth/logout
No necesita body ni token
Respuesta esperada:

json{"mensaje": "Sesión cerrada correctamente"}

5. HU3 — Crear producto

Método: POST
URL: http://localhost:8080/productos
Headers:

Authorization    Bearer <token>

Body → raw → JSON:

json{
  "name": "Parqueadero Norte",
  "description": "Parqueadero cubierto",
  "category": "Cubierto",
  "images": [],
  "features": []
}

Respuesta esperada:

json{"mensaje": "Producto registrado con éxito"}

6. HU3 — Validar duplicado

Mismo método y URL que el anterior
Envía el mismo nombre de nuevo:

json{
  "name": "Parqueadero Norte",
  "description": "Otro",
  "category": "Motos",
  "images": [],
  "features": []
}

Respuesta esperada:

json{"error": "Error: Ya existe un producto con ese nombre"}

7. HU10 — Listar productos

Método: GET
URL: http://localhost:8080/productos
No necesita token ni body
Respuesta esperada:

json[
  {
    "id": 1,
    "name": "Parqueadero Norte",
    "description": "Parqueadero cubierto",
    "category": "Cubierto",
    "images": [],
    "features": []
  }
]

8. HU12 — Listar categorías

Método: GET
URL: http://localhost:8080/productos/categorias
No necesita token
Respuesta esperada:

json["Cubierto","Descubierto","Motos","Bicicletas","Discapacitados"]

9. HU17 — Listar características

Método: GET
URL: http://localhost:8080/productos/caracteristicas
No necesita token
Respuesta esperada:

json[
  {"id": 1, "name": "Seguridad 24h", "icon": "shield"},
  {"id": 2, "name": "Techado", "icon": "roof"}
]

10. HU23 — Disponibilidad mock

Método: GET
URL: http://localhost:8080/productos/1/disponibilidad
No necesita token
Respuesta esperada:

json{
  "productId": 1,
  "disponible": true,
  "rangosOcupados": []
}

11. HU9 — Ver mis reservas

Método: GET
URL: http://localhost:8080/api/reservas/mis-reservas
Headers:

Authorization    Bearer <token>

Respuesta esperada:

json[]

12. HU9 — Cancelar reserva (validación de seguridad)

Método: PUT
URL: http://localhost:8080/api/reservas/1/cancelar
Headers:

Authorization    Bearer <token>

Respuesta esperada si la reserva no es tuya:

json{"error": "No tienes permiso para cancelar esta reserva"}


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
