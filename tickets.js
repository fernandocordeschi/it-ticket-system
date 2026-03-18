class TicketSystem {

    #tickets = [];


    /* =========================
            CREATE
    ========================= */

    createTicket(user, issue, priority) {

        if (!user || !issue || !priority) {
            return {
                success: false,
                error: "All fields are required"
            };
        }

        user = user.trim();
        issue = issue.trim();
        priority = priority.trim();

        if (!this.#validatePriority(priority)) {
            return {
                success: false,
                error: "Priority must be Low, Medium or High"
            };
        }

        let id;

        do {
            id = Date.now();
        }
        while (this.#findTicket(id));

        let now = this.#now();

        let ticket = {
            id,
            user,
            issue,
            priority,
            status: "Open",
            assignedTo: null,
            comments: [],
            history: [],
            created: now,
            updatedAt: now
        };

        this.#tickets.push(ticket);

        return {
            success: true,
            data: ticket
        };

    }


    /* =========================
              READ
    ========================= */

    listTickets() {

        return {
            success: true,
            count: this.#tickets.length,
            data: [...this.#tickets]
        };

    }


    getTicketById(id) {

        if (!id) {
            return {
                success: false,
                error: "Ticket id required"
            };
        }

        let ticket = this.#findTicket(id);

        if (!ticket) {
            return {
                success: false,
                error: "Ticket not found"
            };
        }

        return {
            success: true,
            data: ticket
        };

    }


    searchTicketsByUser(user) {

        if (!user) {
            return {
                success: false,
                error: "User required"
            };
        }

        user = user.trim().toLowerCase();

        let results = this.#tickets.filter(ticket =>
            ticket.user.toLowerCase().includes(user)
        );

        return {
            success: true,
            count: results.length,
            data: results
        };

    }


    getOpenTickets() {

        let results = this.#tickets.filter(ticket =>
            ticket.status !== "Closed"
        );

        return {
            success: true,
            count: results.length,
            data: results
        };

    }


    getTicketsByStatus(status) {

        if (!status) {
            return {
                success: false,
                error: "Status required"
            };
        }

        if (!this.#validateStatus(status)) {
            return {
                success: false,
                error: "Invalid status"
            };
        }

        let results = this.#tickets.filter(ticket =>
            ticket.status === status
        );

        return {
            success: true,
            count: results.length,
            data: results
        };

    }


    getTicketHistory(id) {

        if (!id) {
            return {
                success: false,
                error: "Ticket id required"
            };
        }

        let ticket = this.#findTicket(id);

        if (!ticket) {
            return {
                success: false,
                error: "Ticket not found"
            };
        }

        return {
            success: true,
            count: ticket.history.length,
            data: [...ticket.history]
        };

    }


    /* =========================
             UPDATE
    ========================= */

    updatePriority(id, priority) {

        if (!id || !priority) {
            return {
                success: false,
                error: "Id and priority required"
            };
        }

        if (!this.#validatePriority(priority)) {
            return {
                success: false,
                error: "Invalid priority"
            };
        }

        let ticket = this.#findTicket(id);

        if (!ticket) {
            return {
                success: false,
                error: "Ticket not found"
            };
        }

        if (ticket.priority === priority) {
            return {
                success: false,
                error: "Ticket already has this priority"
            };
        }

        this.#addHistory(ticket,"priority",ticket.priority,priority);

        ticket.priority = priority;

        ticket.updatedAt = this.#now();

        return {
            success: true,
            data: ticket
        };

    }


    addComment(id, author, comment) {

        if (!id || !author || !comment) {
            return {
                success: false,
                error: "Id, author and comment required"
            };
        }

        author = author.trim();
        comment = comment.trim();

        if (comment.length === 0) {
            return {
                success: false,
                error: "Comment cannot be empty"
            };
        }

        let ticket = this.#findTicket(id);

        if (!ticket) {
            return {
                success: false,
                error: "Ticket not found"
            };
        }

        let newComment = {
            author,
            text: comment,
            date: this.#now()
        };

        ticket.comments.push(newComment);

        ticket.updatedAt = this.#now();

        return {
            success: true,
            data: newComment
        };

    }


    /* =========================
             WORKFLOW
    ========================= */

    updateStatus(id, status) {

        if (!id || !status) {
            return {
                success: false,
                error: "Id and status required"
            };
        }

        if (!this.#validateStatus(status)) {
            return {
                success: false,
                error: "Invalid status"
            };
        }

        let ticket = this.#findTicket(id);

        if (!ticket) {
            return {
                success: false,
                error: "Ticket not found"
            };
        }

        if (ticket.status === status) {
            return {
                success: false,
                error: "Ticket already has this status"
            };
        }

        if (ticket.status === "Closed") {
            return {
                success: false,
                error: "Cannot modify a closed ticket"
            };
        }

        this.#addHistory(ticket,"status",ticket.status,status);

        ticket.status = status;

        ticket.updatedAt = this.#now();

        return {
            success: true,
            data: ticket
        };

    }


    closeTicket(id) {

        return this.updateStatus(id,"Closed");

    }


    reopenTicket(id){

        if(!id){
            return {
                success:false,
                error:"Ticket id required"
            };
        }

        let ticket = this.#findTicket(id);

        if(!ticket){
            return {
                success:false,
                error:"Ticket not found"
            };
        }

        if(ticket.status !== "Closed"){
            return {
                success:false,
                error:"Only closed tickets can be reopened"
            };
        }

        this.#addHistory(ticket,"status","Closed","Open");

        ticket.status = "Open";

        ticket.updatedAt = this.#now();

        return {
            success:true,
            data: ticket
        };

    }


    assignTicket(id, technician){

        if(!id || !technician){
            return {
                success:false,
                error:"Id and technician required"
            };
        }

        technician = technician.trim();

        let ticket = this.#findTicket(id);

        if(!ticket){
            return {
                success:false,
                error:"Ticket not found"
            };
        }

        if(ticket.status === "Closed"){
            return {
                success:false,
                error:"Cannot assign closed ticket"
            };
        }

        if(ticket.assignedTo === technician){
            return {
                success:false,
                error:"Ticket already assigned"
            };
        }

        this.#addHistory(ticket,"assignedTo",ticket.assignedTo,technician);

        ticket.assignedTo = technician;

        ticket.updatedAt = this.#now();

        return {
            success:true,
            data: ticket
        };

    }


    /* =========================
              DELETE
    ========================= */

    deleteTicket(id){

        if(!id){
            return {
                success:false,
                error:"Ticket id required"
            };
        }

        let index = this.#tickets.findIndex(ticket =>
            ticket.id === id
        );

        if(index === -1){
            return {
                success:false,
                error:"Ticket not found"
            };
        }

        let deleted = this.#tickets[index];

        this.#tickets.splice(index,1);

        return {
            success:true,
            data: deleted
        };

    }


    /* =========================
              METRICS
    ========================= */

    getMetrics(){

        let open = 0;
        let inProgress = 0;
        let closed = 0;

        for(let ticket of this.#tickets){

            if(ticket.status === "Open") open++;

            if(ticket.status === "In Progress") inProgress++;

            if(ticket.status === "Closed") closed++;

        }

        return {
            success:true,
            total:this.#tickets.length,
            open,
            inProgress,
            closed
        };

    }


    /* =========================
        PRIVATE HELPERS
    ========================= */

    #findTicket(id){

        return this.#tickets.find(ticket =>
            ticket.id === id
        );

    }


    #validatePriority(priority){

        return ["Low","Medium","High"]
            .includes(priority);

    }


    #validateStatus(status){

        return ["Open","In Progress","Closed"]
            .includes(status);

    }


    #now(){

        return new Date().toLocaleString();

    }


    #addHistory(ticket,field,oldValue,newValue){

        ticket.history.push({

            field,

            oldValue,

            newValue,

            date:this.#now()

        });

    }

}

    /* =========================
            DEMO / TESTING
    ========================= */

    const system = new TicketSystem();
    
    let t1 = system.createTicket("Fernando","Cannot login","High");
    
    let t2 = system.createTicket("Martin","Printer not working","Low");
    
    console.log("All tickets:");
    console.log(system.listTickets());
    
    console.log("Move to In Progress:");
    console.log(system.updateStatus(t1.data.id,"In Progress"));
    
    console.log("Add comments:");
    console.log(system.addComment(t1.data.id,"Fernando","User contacted"));
    console.log(system.addComment(t1.data.id,"Fernando","Password reset performed"));
    
    console.log("Change priority:");
    console.log(system.updatePriority(t1.data.id,"Medium"));
    
    console.log("Assign technician:");
    console.log(system.assignTicket(t1.data.id,"Martin"));
    
    console.log("Close ticket:");
    console.log(system.closeTicket(t1.data.id));
    
    console.log("Delete second ticket:");
    console.log(system.deleteTicket(t2.data.id));
    
    console.log("Ticket details:");
    console.log(system.getTicketById(t1.data.id));
    
    console.log("Search user:");
    console.log(system.searchTicketsByUser("fernando"));
    
    console.log("Open tickets:");
    console.log(system.getOpenTickets());
    
    console.log("Closed tickets:");
    console.log(system.getTicketsByStatus("Closed"));
    
    console.log("History:");
    console.log(system.getTicketHistory(t1.data.id));
    
    console.log("Metrics:");
    console.log(system.getMetrics());
    
    console.log("Reopen ticket:");
    console.log(system.reopenTicket(t1.data.id));
    
    console.log("Metrics after reopen:");
    console.log(system.getMetrics());
