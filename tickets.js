let tickets = [];

function createTicket(user, issue, priority){

    let ticket = {
        id: tickets.length + 1,
        user: user,
        issue: issue,
        priority: priority,
        status: "Open",
        created: new Date().toLocaleDateString()
    };

    tickets.push(ticket);

    console.log("Ticket created:", ticket);
}

function listTickets(){

    if(tickets.length === 0){
        console.log("No tickets found");
        return;
    }

    tickets.forEach(ticket => {
        console.log(ticket);
    });

}

function closeTicket(id){

    let ticket = tickets.find(ticket => ticket.id === id);

    if(ticket){
        ticket.status = "Closed";
        console.log("Ticket closed:", ticket);
    }
    else{
        console.log("Ticket not found");
    }

}

function deleteTicket(id){

    let initialLength = tickets.length;

    tickets = tickets.filter(ticket => ticket.id !== id);

    if(tickets.length < initialLength){
        console.log("Ticket deleted");
    }
    else{
        console.log("Ticket not found");
    }

}

/* TESTING AREA */

createTicket("Fernando","Cannot login","High");
createTicket("Martin","Printer not working","Low");

listTickets();

closeTicket(1);

listTickets();

deleteTicket(2);

listTickets();
