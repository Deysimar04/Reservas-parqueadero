# Sistema de Gestión de Parqueadero

Aplicación web desarrollada en JavaScript para la gestión de cupos de un parqueadero.  
Permite reservar y cancelar espacios dinámicamente, actualizando el estado y los contadores en tiempo real.

---

## Descripción

El sistema administra los cupos disponibles y ocupados mediante manipulación dinámica del DOM y manejo estructurado de eventos.

Se implementaron validaciones para evitar inconsistencias y se organizó el proyecto por módulos para mantener una arquitectura clara y escalable.

---

##  Funcionalidades

-  Reservar cupos disponibles  
- Cancelar cupos ocupados  
- Actualización automática de contadores  
- Validaciones antes de cambiar estados  
- Protección contra múltiples clics rápidos  
- Verificación automática de inconsistencias  
- Manejo centralizado de eventos con `addEventListener`

---

## Estados del Sistema

El sistema maneja únicamente dos estados:

- 🟢 disponible
- 🔴 ocupado

Se eliminó el estado "reservado" para evitar conflictos lógicos e inconsistencias.

---

---

##  Arquitectura

El proyecto está organizado por módulos:

- **main.js** → Inicialización del sistema  
- **api.js** → Gestión de datos  
- **ui.js** → Renderizado y actualización visual  
- **reservas.js** → Lógica de reservas y eventos  

Se separó la lógica de negocio, la manipulación del DOM y la gestión de eventos para mejorar el mantenimiento y escalabilidad.

---

##  Validaciones Implementadas

- No se puede reservar un cupo ocupado.
- No se puede cancelar un cupo disponible.
- Validación de existencia del cupo antes de modificarlo.
- Control contra múltiples clics rápidos.
- Verificación automática de estados inválidos y desincronización de contadores.

---

## Pruebas Realizadas

- Cambio correcto de estados.
- Actualización correcta de contadores.
- Intentos de acciones inválidas.
- Pruebas con múltiples clics rápidos.
- Revisión de errores en consola.

---

## Cómo ejecutar el proyecto

1. Clonar el repositorio:
2. Abrir la carpeta en Visual Studio Code.

3. Ejecutar con Live Server o abrir `index.html` en el navegador.

---

##  Roles del Proyecto

- Persona 1 – Arquitectura
- Persona 3 – API y datos
- Persona 4 – Lógica de reservas
- Persona 5 – Validaciones y testing

---

##  Estado del Proyecto

Sistema funcional  
 Arquitectura organizada  
Validaciones implementadas  
 Listo para entrega académica