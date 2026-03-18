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

createTicket("Fernando","Cannot login","High");
createTicket("Martin","Printer not working","Low");

listTickets();
