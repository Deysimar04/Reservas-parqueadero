 ParkApp — Sistema de Reservas de Parqueadero

Plataforma web para reservar plazas de parqueo en tiempo real, con filtros por zona y tipo de vehículo.

Mostrar imagen
Mostrar imagen
Mostrar imagen

📁 Estructura del proyecto
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
PáginaDescripciónindex.htmlPágina principal con header, categorías, zonas, filtros, plazas, galería, características y políticasgaleria.htmlGalería completa con header interno y botón de regreso

Archivos JavaScript
api.js
Genera el mock de datos. Cada plaza tiene esta estructura:
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
 Zonas: Aeropuerto · Centro Comercial · Centro Ciudad
Tipos: automovil · camioneta · moto
Estados: disponible · reservado · ocupado
 Extras asignados aleatoriamente con Math.random() > 0.5


main.js
Controla toda la lógica de la aplicación.
FunciónDescripcióniniciar()Carga plazas, sesión y configura todos los eventoscargarSesion()Lee usuario desde localStorageguardarSesion()Guarda usuario en localStorage y actualiza UIcerrarSesion()Elimina sesión y resetea la vistarender()Redibuja las plazas según filtros activosfiltrarPlazas()Filtra por zona y tipo de vehículomostrarPlazas()Genera las tarjetas de plaza en el DOMactualizarContador()Actualiza el contador de estadosconfigurarCategorias()Maneja selección de tipo de vehículoconfigurarBotonesZona()Maneja selección de zona de parqueoconfigurarModales()Maneja login, crear cuenta y logoutmostrarNotificacion()Muestra alertas flotantes temporales

 Flujo de uso
1. Entrar a la página
2. Crear cuenta o iniciar sesión
3. Seleccionar tipo de vehículo  →  Automóvil / Camioneta / Moto
4. Seleccionar zona              →  Aeropuerto / Centro Comercial / Centro Ciudad
5. Elegir fecha de reserva       →  Campo obligatorio
6. Ver plazas filtradas con extras
7. Clic en "Reservar" en plaza disponible
8. Cancelar reserva cuando se desee

 Funcionalidades implementadas
 Autenticación

Crear cuenta con nombre, email y contraseña
Iniciar y cerrar sesión
Datos guardados en localStorage
Sin sesión → categorías y zonas deshabilitadas visualmente

🔍 Filtros

Por tipo de vehículo (categoría)
Por zona de parqueo
Validación: no se puede filtrar zona sin seleccionar categoría primero
Botón Volver para resetear todos los filtros

📅 Reservas

Fecha obligatoria antes de reservar (input type="date")
Error visible si se intenta reservar sin fecha
Al reservar → plaza pasa a reservado y muestra la fecha elegida
Al cancelar → plaza vuelve a disponible
Plaza ocupada → mensaje de error amigable al hacer clic

🃏 Tarjetas de plaza
Cada tarjeta muestra:

Número de plaza, zona y tipo de vehículo
Estado con color: 🟢 DISPONIBLE · 🟡 RESERVADO · 🔴 OCUPADO
Badges de extras: Techado · Camaras · Iluminado · Accesible
Fecha de reserva (si aplica)
Botón de acción según estado

Galería

Vista previa en index.html: 1 imagen grande + 4 pequeñas en 2×2
Vista completa en galeria.html: grid de 3 columnas con 8 imágenes
Responsive en móvil


Estilos CSS
El archivo styles.css está organizado por secciones:
AJUSTE GLOBAL → HEADER → CATEGORIAS → ZONAS → CONTADOR
→ TARJETAS → ESTADOS → GALERIA → CARACTERISTICAS
→ POLITICAS → FOOTER → NOTIFICACION → MODAL
→ FECHA RESERVA → EXTRAS → PAGINA INTERNA
Paleta de colores:
UsoColorHeader / fondo oscuro#1e2a38Azul acento#3498dbVerde disponible#27ae60Amarillo reservado#f1c40fRojo ocupado#e74c3c


Cómo ejecutar
El proyecto usa módulos ES6 y requiere un servidor local (no funciona abriendo el .html directamente).
bash# Opción 1 — VS Code
# Instalar extensión "Live Server" → clic derecho en index.html → Open with Live Server

# Opción 2 — Python
python -m http.server 5500

# Opción 3 — Node
npx serve .
Luego abrir http://localhost:5500 en el navegador.

⚠️ No abrir index.html con doble clic — los módulos JS no funcionan con file://


🛠️ Tecnologías
TecnologíaUsoHTML5 semánticoEstructura de las páginasCSS3 (Grid + Flexbox)Diseño y responsiveJavaScript ES6+Lógica, módulos, async/awaitlocalStoragePersistencia de sesión y usuarios

Sin frameworks ni dependencias externas.


👤 Autor
Proyecto académico — ParkApp 2026
