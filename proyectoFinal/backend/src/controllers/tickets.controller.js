import Tickets from "../dao/classes/tickets.dao.js";

const ticketsService = new Tickets()

export const getTicketsController = async (req, res) => {
    try {
        let result = await ticketsService.getTicketsDAO()
        if (!result) return res.status(404).send({ status: "error", message: "Cannot get tickets" })
        res.status(201).send({ status: "success", payload: result })
    }
    catch (error) {
        res.status(500).send(`Server error: ${error}`)
    }
};

export const getTicketsByIdController = async (req, res) => {
    try {
        let tid = req.params.tid
        let result = await ticketsService.getTicketsByIdDAO(tid)
        if (!result) return res.status(404).send({ status: "error", message: "Cannot get ticket with this id because doesn´t exists" })
        res.status(201).send({ status: "success", payload: result })
    }
    catch (error) {
        res.status(500).send(`Server error: ${error}`)
    }
};