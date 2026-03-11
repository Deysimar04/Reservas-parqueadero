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
   
Páginas
index.html — Página principal
Contiene todas las secciones del sistema: header, categorías, zonas, filtros, plazas, galería, características y políticas.
galeria.html — Página interna
Muestra la galería completa de imágenes de los parqueaderos con un header interno que incluye botón de regreso.

Archivos JavaScript
api.js
Genera el mock de datos de las plazas. Cada plaza tiene:
json{
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
Zonas disponibles: Aeropuerto, Centro Comercial, Centro Ciudad
Tipos de vehículo: automovil, camioneta, moto
Estados posibles: disponible, reservado, ocupado
Los extras se asignan aleatoriamente con Math.random() > 0.5

main.js
Controla toda la lógica de la aplicación. Módulos principales:
FunciónDescripcióniniciar()Carga plazas, sesión y configura todos los eventoscargarSesion()Lee usuario desde localStorageguardarSesion()Guarda usuario en localStorage y actualiza UIcerrarSesion()Elimina sesión y resetea la vistarender()Redibuja las plazas según filtros activosfiltrarPlazas()Filtra por zona y tipo de vehículomostrarPlazas()Genera las tarjetas de plaza en el DOMactualizarContador()Actualiza el contador de estadosconfigurarCategorias()Maneja selección de tipo de vehículoconfigurarBotonesZona()Maneja selección de zona de parqueoconfigurarModales()Maneja login, crear cuenta y logoutmostrarNotificacion()Muestra alertas flotantes temporales

Flujo de uso
1. El usuario entra a la página
2. Debe crear una cuenta o iniciar sesión
3. Selecciona un tipo de vehículo (Automóvil / Camioneta / Moto)
4. Selecciona una zona (Aeropuerto / Centro Comercial / Centro Ciudad)
5. Aparece el campo de fecha — debe elegir una fecha de reserva
6. Ve las plazas filtradas con sus extras
7. Hace clic en "Reservar" en una plaza disponible
8. Puede cancelar su reserva en cualquier momento

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
Botón "Volver" para resetear todos los filtros

Reservas

Fecha obligatoria antes de reservar (input type="date")
Error visible si se intenta reservar sin fecha
Al reservar: la plaza pasa a estado reservado y muestra la fecha
Al cancelar: la plaza vuelve a disponible
Plaza ocupada: muestra mensaje de error amigable al hacer clic

Tarjetas de plaza
Cada tarjeta muestra:

Número de plaza
Zona y tipo de vehículo
Estado (DISPONIBLE / RESERVADO / OCUPADO) con color
Badges de extras (Techado, Camaras, Iluminado, Accesible)
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
Colores principales:

Fondo oscuro header: #1e2a38
Azul acento: #3498db
Verde disponible: #27ae60
Amarillo reservado: #f1c40f
Rojo ocupado: #e74c3c


Cómo ejecutar
El proyecto es HTML/CSS/JS puro con módulos ES6. Requiere un servidor local para que funcionen los import:
bash# Opción 1 — VS Code
Instalar extensión "Live Server" → clic derecho en index.html → Open with Live Server

# Opción 2 — Python
python -m http.server 5500

# Opción 3 — Node
npx serve .
Luego abrir http://localhost:5500 en el navegador.

No abrir index.html directamente con doble clic — los módulos JS no funcionan con file://


Tecnologías

HTML5 semántico
CSS3 (Grid, Flexbox, variables de color)
JavaScript ES6+ (módulos, async/await, arrow functions)
localStorage para persistencia de sesión
Sin frameworks ni dependencias externas
