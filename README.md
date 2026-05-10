# ParkApp — Sistema de Reservas de Parqueaderos

Plataforma integral para la reserva de plazas de estacionamiento con autenticacion segura, panel administrativo y disponibilidad en tiempo real.


## Demo en vivo

| Servicio | URL |
|---|---|
| Frontend | [reservasparkapp.netlify.app](https://reservasparkapp.netlify.app) |
| Backend | `http://localhost:8080` (local) |

---

## Equipo

| Integrante | Responsabilidad |
|---|---|
| Alejandra | Arquitectura HTML y Spring Security con JWT |
| Oscar | Interfaz de usuario y control de permisos |
| Juan Mario | Backend de autenticacion y API REST |
| Juan Pablo | Logica de catalogo y CRUD de productos |


---

## Tecnologias usadas

### Frontend
- HTML5, CSS3, JavaScript ES6 Modules
- Netlify para despliegue

### Backend
- Java 17 con Spring Boot
- Spring Security con JWT
- Spring Data JPA
- MySQL para persistencia principal
- MongoDB para favoritos

---

## Arquitectura del sistema

```
Frontend  <--HTTP/REST-->  Backend (Spring Boot + JWT)
HTML/CSS/JS                         |
LocalStorage              __________|__________
                          |                   |
                        MySQL             MongoDB
                  usuarios, reservas,    favoritos
                  productos, categorias
```

---

## Estructura del proyecto

```
Reservas-parqueadero/
|-- Backend/
|   |-- src/main/java/com/reservas/parqueaderos/
|       |-- controller/
|       |-- model/
|       |-- repository/
|       |-- service/
|       |-- security/
|-- Frontend/
    |-- css/
    |-- img/
    |-- js/
    |   |-- api.js
    |   |-- main.js
    |   |-- patrones.js
    |-- index.html
    |-- admin.html
    |-- galeria.html
```

---

## Endpoints del backend

### Autenticacion

| Metodo | Ruta | Acceso | Descripcion |
|---|---|---|---|
| POST | `/api/auth/registro` | Publico | Registrar usuario |
| POST | `/api/auth/login` | Publico | Login y obtencion de JWT |
| POST | `/api/auth/logout` | Publico | Cerrar sesion |
| PUT | `/api/auth/usuarios/{id}/rol` | ADMIN | Cambiar rol de usuario |

### Productos

| Metodo | Ruta | Acceso | Descripcion |
|---|---|---|---|
| GET | `/api/productos` | Publico | Listar plazas |
| POST | `/api/productos` | ADMIN | Crear producto |
| DELETE | `/api/productos/{id}` | ADMIN | Eliminar producto |
| GET | `/api/productos/categorias` | Publico | Listar categorias |
| GET | `/api/productos/caracteristicas` | Publico | Listar caracteristicas |

### Reservas

| Metodo | Ruta | Acceso | Descripcion |
|---|---|---|---|
| POST | `/api/reservas` | Autenticado | Crear reserva |
| GET | `/api/reservas/mis-reservas` | Autenticado | Ver mis reservas |
| GET | `/api/reservas/todas` | ADMIN | Ver todas las reservas |
| GET | `/api/reservas/{id}` | Autenticado | Detalle de reserva |
| PUT | `/api/reservas/{id}/cancelar` | Autenticado | Cancelar reserva |
| GET | `/api/reservas/ocupadas` | Publico | Plazas ocupadas por fecha |

### Favoritos

| Metodo | Ruta | Acceso | Descripcion |
|---|---|---|---|
| POST | `/api/favoritos/{productoId}` | Autenticado | Marcar favorito |
| DELETE | `/api/favoritos/{productoId}` | Autenticado | Desmarcar favorito |
| GET | `/api/favoritos` | Autenticado | Listar mis favoritos |

---

## Historias de usuario implementadas

### Sprint 1

| HU | Descripcion | Estado |
|---|---|---|
| HU1 | Header fijo con logo y botones | Completo |
| HU2 | Body con color de marca y secciones | Completo |
| HU4 | Visualizar productos en home | Completo |
| HU5 | Detalle del producto | Completo |
| HU6 | Galeria de imagenes con Ver mas | Completo |
| HU18 | Caracteristicas con iconos | Completo |
| HU22 | Busqueda con filtros | Completo |
| HU26 | Bloque de politicas | Completo |

### Sprint 2

| HU | Descripcion | Estado |
|---|---|---|
| HU9 | Panel de administracion | Completo |
| HU10 | Listar productos en panel | Completo |
| HU3 | Registrar producto con validaciones | Completo |
| HU12 | Categorizar productos | Completo |
| HU13 | Registrar usuario | Completo |
| HU14 | Login con JWT | Completo |
| HU15 | Cerrar sesion | Completo |
| HU16 | Identificar administrador | Completo |
| HU17 | Administrar caracteristicas | Completo |
| HU19 | Notificacion simulada de correo | Completo |
| HU23 | Disponibilidad mock | Completo |

### Sprint 3

| HU | Descripcion | Estado |
|---|---|---|
| HU30 | Seleccionar fecha y validar login | Completo |
| HU31 | Visualizar detalles de reserva | Completo |
| HU32 | Realizar reserva con registro en SQL | Completo |
| HU33 | Historial de reservas ordenado por usuario | Completo |
| HU23 | Disponibilidad real con datos de la BD | Completo |
| HU24-25 | Favoritos con MongoDB | Completo |

---

## Instrucciones de ejecucion

### Backend en IntelliJ IDEA

**Paso 1 — Configurar base de datos en MySQL Workbench**

```sql
CREATE DATABASE IF NOT EXISTS parqueadero_db;
USE parqueadero_db;
```

**Paso 2 — Configurar application.properties**

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/parqueadero_db
spring.datasource.username=root
spring.datasource.password=root
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
jwt.secret=mi_clave_super_segura_12345678901234567890
```

**Paso 3 — Ejecutar la clase principal**

```
ParqueaderosApplication.java
```

**Paso 4 — Backend disponible en**

```
http://localhost:8080
```

---

### Frontend en VS Code

**Paso 1 — Abrir carpeta Frontend en VS Code**

**Paso 2 — Click derecho en index.html y seleccionar Open with Live Server**

**Paso 3 — Abrir en el navegador**

```
http://127.0.0.1:5500
```

---

## Usuarios de prueba

| Usuario | Contrasena | Rol |
|---|---|---|
| admin | admin123 | ADMIN |
| usuario | usuario123 | USER |

---

## Patrones de diseno implementados

| Patron | Ubicacion | Descripcion |
|---|---|---|
| Strategy | ReservaService | Motor de disponibilidad de plazas |
| Repository | Todos los repositorios | Persistencia con Spring Data JPA |
| Singleton | PlazaManager frontend | Una sola instancia maneja las plazas |
| Observer | ContadorObserver, NotificacionObserver, DisponibilidadObserver | Reaccionan a cambios en plazas |
| Filter | JwtFilter | Seguridad en cada request HTTP |

---

## Base de datos

### MySQL — tablas

| Tabla | Descripcion |
|---|---|
| users | Usuarios registrados del sistema |
| products | Plazas de parqueadero disponibles |
| categories | Tipos de plaza: Cubierto, Descubierto, Motos, etc |
| features | Caracteristicas asociadas a cada plaza |
| reservas | Registro de todas las reservas realizadas |

### MongoDB — colecciones

| Coleccion | Descripcion |
|---|---|
| favoritos | Plazas marcadas como favoritas por cada usuario |

---

## Zonas disponibles

| Zona | Plazas disponibles |
|---|---|
| Aeropuerto | 2 plazas |
| Centro Comercial | 4 plazas |
| Centro Ciudad | 4 plazas |
| Aeropuerto Motos | 1 plaza |
| Centro Ciudad Motos | 1 plaza |

---

## Precios por categoria

| Categoria | Precio por hora |
|---|---|
| Cubierto | $5.000 COP |
| Descubierto | $3.000 COP |
| Motos | $2.000 COP |

---

## Panel de administracion

Accesible en `/admin.html` unicamente para usuarios con rol ADMIN.

| Seccion | Descripcion |
|---|---|
| Dashboard | KPIs en tiempo real: plazas disponibles, reservadas, ocupadas y total de usuarios |
| Plazas | Crear y eliminar plazas conectadas a la base de datos |
| Reservas | Ver historial completo de todas las reservas con opcion de cancelar |
| Usuarios | Listar usuarios, cambiar roles y eliminar cuentas |
| Caracteristicas | Crear, editar y eliminar caracteristicas asociables a plazas |
| Categorias | Administrar categorias de vehiculos con dimensiones |
| Reportes | Estadisticas de ocupacion, zona mas activa y tipo mas frecuente |

---

## Pruebas con Postman

### HU13 — Registrar usuario

```
POST http://localhost:8080/api/auth/registro
Content-Type: application/json

{
  "username": "maria",
  "email": "maria@gmail.com",
  "password": "123456"
}
```

Respuesta esperada:

```json
{"mensaje": "Usuario registrado con exito"}
```

### HU14 — Iniciar sesion

```
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

Respuesta esperada:

```json
{
  "token": "eyJhbGc...",
  "role": "ADMIN",
  "username": "admin"
}
```

### HU32 — Crear reserva

```
POST http://localhost:8080/api/reservas
Authorization: Bearer {token}
Content-Type: application/json

{
  "product": { "id": 1 },
  "startTime": "2026-06-01T08:00:00",
  "endTime": "2026-06-01T20:00:00"
}
```

Respuesta esperada:

```json
{
  "id": 1,
  "estado": "CONFIRMED",
  "startTime": "2026-06-01T08:00:00",
  "endTime": "2026-06-01T20:00:00"
}
```

### HU33 — Ver historial de reservas

```
GET http://localhost:8080/api/reservas/mis-reservas
Authorization: Bearer {token}
```

### HU24-25 — Marcar favorito

```
POST http://localhost:8080/api/favoritos/1
Authorization: Bearer {token}
```

---

## Seguridad

- Autenticacion basada en JWT (JSON Web Token)
- Roles ADMIN y USER controlados con Spring Security
- CORS configurado para Netlify y localhost
- Contrasenas encriptadas con BCrypt
- Token con expiracion automatica

---

## Flujo de trabajo en Git

```bash
# Siempre antes de subir cambios
git stash
git pull origin integracion-final --no-edit
git stash pop
git add .
git commit -m "descripcion del cambio"
git push origin integracion-final
```

---

Desarrollado por el equipo ParkApp — 2026
