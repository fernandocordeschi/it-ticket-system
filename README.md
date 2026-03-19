# 🎫 Ticket System - JavaScript Mini Project

Este proyecto implementa un sistema de gestión de tickets en **JavaScript**, ideal para prácticas de OOP y manejo de workflows básicos de soporte técnico.

## 📖 Descripción

La clase `TicketSystem` permite:

- 🆕 Crear tickets con usuario, descripción del problema y prioridad.
- 🔄 Actualizar estado, prioridad y asignación de tickets.
- 💬 Agregar comentarios a los tickets.
- 🔓 Reabrir tickets cerrados.
- 📊 Consultar métricas y el historial de cambios de cada ticket.
- 🔍 Buscar tickets por usuario o estado.
- 🗂 Mantener historial de cambios y control de errores en validaciones.

Es un proyecto **mini**, pensado como ejemplo práctico de gestión de tickets y seguimiento de workflows.

## ⚙️ Instalación / Uso

Clona este repositorio y abre en tu entorno de desarrollo:

```bash

git clone https://github.com/FernandoCordeschi/ticket-system-js
cd ticket-system-js

```javascript
const system = new TicketSystem();

// 🆕 Crear tickets
let t1 = system.createTicket("Fernando", "Cannot login", "High");
let t2 = system.createTicket("Martin", "Printer not working", "Low");

// 🔍 Consultar tickets
console.log(system.listTickets());

// 🔄 Actualizar estado
system.updateStatus(t1.data.id, "In Progress");

// 💬 Agregar comentario
system.addComment(t1.data.id, "Fernando", "User contacted");

// ⚡ Cambiar prioridad
system.updatePriority(t1.data.id, "Medium");

// 🔒 Cerrar ticket
system.closeTicket(t1.data.id);

// 🔓 Reabrir ticket
system.reopenTicket(t1.data.id);

// 👤 Asignar ticket
system.assignTicket(t1.data.id, "Martin");

// 📊 Consultar métricas
console.log(system.getMetrics());

```
