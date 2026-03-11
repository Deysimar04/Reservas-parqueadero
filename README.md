ParkApp — Sistema de Reservas de Parqueadero
Plataforma web para reservar plazas de parqueo en tiempo real, con filtros por zona y tipo de vehículo.

Estructura del proyecto
ParkApp/
├── index.html
├── galeria.html
├── css/
│   └── styles.css
├── js/
│   ├── main.js
│   └── api.js
└── img/

## Páginas

| Página | Descripción |
|---|---|
| `index.html` | Página principal con header, categorías, zonas, filtros, plazas, galería, características y políticas |
| `galeria.html` | Galería completa con header interno y botón de regreso |


## Archivos JavaScript

### api.js

Genera el mock de datos. Cada plaza tiene esta estructura:
```json
{
  "id": 1,
  "zona": "Aeropuerto",
  "tipo": "automovil",
  "estado": "disponible",
  "extras": {
    "techado": true,
    "camaras": false,
    "iluminado": true,
    "discapacitados": false
  }
}
Genera 10 plazas aleatorias al cargar la página
Zonas: Aeropuerto · Centro Comercial · Centro Ciudad
Tipos: automovil · camioneta · moto
Estados: disponible · reservado · ocupado
Extras asignados aleatoriamente con Math.random() > 0.5
main.js
Controla toda la lógica de la aplicación.

Función	Descripción
iniciar()	Carga plazas, sesión y configura todos los eventos
cargarSesion()	Lee usuario desde localStorage
guardarSesion()	Guarda usuario en localStorage y actualiza UI
cerrarSesion()	Elimina sesión y resetea la vista
render()	Redibuja las plazas según filtros activos
filtrarPlazas()	Filtra por zona y tipo de vehículo
mostrarPlazas()	Genera las tarjetas de plaza en el DOM
actualizarContador()	Actualiza el contador de estados
configurarCategorias()	Maneja selección de tipo de vehículo
configurarBotonesZona()	Maneja selección de zona de parqueo
configurarModales()	Maneja login, crear cuenta y logout
mostrarNotificacion()	Muestra alertas flotantes temporales
Flujo de uso
1. Entrar a la página
2. Crear cuenta o iniciar sesión
3. Seleccionar tipo de vehículo  →  Automóvil / Camioneta / Moto
4. Seleccionar zona              →  Aeropuerto / Centro Comercial / Centro Ciudad
5. Elegir fecha de reserva       →  Campo obligatorio
6. Ver plazas filtradas con sus extras
7. Clic en "Reservar" en una plaza disponible
8. Cancelar reserva cuando se desee
Funcionalidades implementadas
Autenticación
Crear cuenta con nombre, email y contraseña
Iniciar y cerrar sesión
Datos guardados en localStorage
Sin sesión: categorías y zonas deshabilitadas visualmente
Filtros
Por tipo de vehículo (categoría)
Por zona de parqueo
Validación: no se puede filtrar zona sin seleccionar categoría primero
Botón Volver para resetear todos los filtros
Reservas
Fecha obligatoria antes de reservar (input type="date")
Error visible si se intenta reservar sin fecha
Al reservar: plaza pasa a reservado y muestra la fecha elegida
Al cancelar: plaza vuelve a disponible
Plaza ocupada: mensaje de error amigable al hacer clic
Tarjetas de plaza
Cada tarjeta muestra:

Número de plaza, zona y tipo de vehículo
Estado con color: DISPONIBLE · RESERVADO · OCUPADO
Badges de extras: Techado · Camaras · Iluminado · Accesible
Fecha de reserva si está reservada
Botón de acción según estado
Galería
Vista previa en index.html: 1 imagen grande + 4 pequeñas en 2x2
Vista completa en galeria.html: grid de 3 columnas con 8 imágenes
Responsive en móvil
Estilos CSS
El archivo styles.css está organizado por secciones con comentarios:

AJUSTE GLOBAL → HEADER → CATEGORIAS → ZONAS → CONTADOR
→ TARJETAS → ESTADOS → GALERIA → CARACTERISTICAS
→ POLITICAS → FOOTER → NOTIFICACION → MODAL
→ FECHA RESERVA → EXTRAS → PAGINA INTERNA
Paleta de colores:

Uso	Color
Header / fondo oscuro	#1e2a38
Azul acento	#3498db
Verde disponible	#27ae60
Amarillo reservado	#f1c40f
Rojo ocupado	#e74c3c
Cómo ejecutar
El proyecto usa módulos ES6 y requiere un servidor local. No funciona abriendo el .html directamente con doble clic.

# Opción 1 — VS Code
# Instalar extensión "Live Server" → clic derecho en index.html → Open with Live Server

# Opción 2 — Python
python -m http.server 5500

# Opción 3 — Node
npx serve .
Luego abrir http://localhost:5500 en el navegador.

Tecnologías
Tecnología	Uso
HTML5 semántico	Estructura de las páginas
CSS3 (Grid + Flexbox)	Diseño y responsive
JavaScript ES6+	Lógica, módulos, async/await
localStorage	Persistencia de sesión y usuarios
Sin frameworks ni dependencias externas.

Autor
Proyecto académico — ParkApp 2026