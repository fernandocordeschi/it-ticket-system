let tickets = [];

function createTicket(user, issue, priority){

    // Validate required fields
    if(!user || !issue || !priority){
        return { error: "All fields are required" };
    }

    // Normalize input
    user = user.trim();
    issue = issue.trim();
    priority = priority.trim();

    // Validate priority values
    const validPriorities = ["Low","Medium","High"];

    if(!validPriorities.includes(priority)){
        return { error: "Priority must be Low, Medium or High" };
    }

    // Generate unique ID (defensive programming)
    let id;

    do{
        id = Date.now();
    } 
    while(tickets.find(ticket => ticket.id === id));

    let ticket = {
        id: id,
        user: user,
        issue: issue,
        priority: priority,
        status: "Open",
        created: new Date().toLocaleDateString()
    };

    tickets.push(ticket);

    return ticket;
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
