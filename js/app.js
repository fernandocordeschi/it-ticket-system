import { TicketSystem } from './TicketSystem.js';

const system = new TicketSystem();
const log = document.getElementById('log');

function print(obj) {
    log.textContent += JSON.stringify(obj, null, 2) + "\n\n";
}

// Eventos de botones
document.getElementById('create').addEventListener('click', () => {
    const ticket = system.createTicket("Fernando", "Cannot login", "High");
    print(ticket);
});

document.getElementById('list').addEventListener('click', () => {
    print(system.listTickets());
});

document.getElementById('close').addEventListener('click', () => {
    const openTickets = system.getOpenTickets().data;
    if(openTickets.length > 0){
        print(system.closeTicket(openTickets[0].id));
    } else {
        print({error: "No open tickets"});
    }
});

document.getElementById('reopen').addEventListener('click', () => {
    const closedTickets = system.getTicketsByStatus("Closed").data;
    if(closedTickets.length > 0){
        print(system.reopenTicket(closedTickets[0].id));
    } else {
        print({error: "No closed tickets"});
    }
});
