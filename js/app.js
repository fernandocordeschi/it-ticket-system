import { TicketSystem } from './TicketSystem.js';

const system = new TicketSystem();

// Contenedores
const log = document.getElementById('log');
const ticketContainer = document.getElementById('ticket-container');

// Función para imprimir en log (opcional)
function print(obj) {
    if(log){
        log.textContent += JSON.stringify(obj, null, 2) + "\n\n";
    }
}

// ============================
// Renderizar tickets en tarjetas
// ============================
function renderTickets(){
    ticketContainer.innerHTML = "";
    const tickets = system.listTickets().data;

    tickets.forEach(ticket => {
        const card = document.createElement('div');
        card.className = 'ticket-card';
        card.innerHTML = `
            <strong>${ticket.user}</strong> - ${ticket.issue} [${ticket.priority}]
            <p>Estado: ${ticket.status}</p>
            <button class="close-btn">Cerrar</button>
            <button class="reopen-btn">Reabrir</button>
        `;

        // Cerrar ticket
        card.querySelector('.close-btn').addEventListener('click', () => {
            const result = system.closeTicket(ticket.id);
            print(result);
            renderTickets();
        });

        // Reabrir ticket
        card.querySelector('.reopen-btn').addEventListener('click', () => {
            const result = system.reopenTicket(ticket.id);
            print(result);
            renderTickets();
        });

        ticketContainer.appendChild(card);
    });
}

// ============================
// Eventos de botones de demo
// ============================

// Crear ticket dinámico con inputs
document.getElementById('create')?.addEventListener('click', () => {
    const userInput = document.getElementById('user')?.value || "";
    const issueInput = document.getElementById('issue')?.value || "";
    const priorityInput = document.getElementById('priority')?.value || "Low";

    const ticket = system.createTicket(userInput, issueInput, priorityInput);
    
    if(ticket.success){
        renderTickets();
        document.getElementById('user').value = "";
        document.getElementById('issue').value = "";
    } else {
        alert(ticket.error);
    }
});

// Listar tickets en log
document.getElementById('list')?.addEventListener('click', () => {
    print(system.listTickets());
});

// Cerrar primer ticket abierto
document.getElementById('close')?.addEventListener('click', () => {
    const openTickets = system.getOpenTickets().data;
    if(openTickets.length > 0){
        print(system.closeTicket(openTickets[0].id));
        renderTickets();
    } else {
        print({error: "No open tickets"});
    }
});

// Reabrir primer ticket cerrado
document.getElementById('reopen')?.addEventListener('click', () => {
    const closedTickets = system.getTicketsByStatus("Closed").data;
    if(closedTickets.length > 0){
        print(system.reopenTicket(closedTickets[0].id));
        renderTickets();
    } else {
        print({error: "No closed tickets"});
    }
});

// ============================
// Demo inicial: crear tickets de ejemplo
// ============================
const t1 = system.createTicket("Fernando", "Cannot login", "High");
const t2 = system.createTicket("Martin", "Printer not working", "Low");
renderTickets();
print(t1);
print(t2);

// Consultar métricas
print(system.getMetrics());
