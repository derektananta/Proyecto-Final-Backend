import { ticketsModel } from "../models/tickets.model.js";
import { logger } from "../../middlewares/logger/logger.js"

export default class Tickets {
    constructor() {
        this.logger = logger;
    }

    generateTicketsDAO = async (ticketData) => {
        try {
            let result = await ticketsModel.create(ticketData)
            if (!result) return null
            this.logger.info(`Ticket generated successfully with code ${ticketData.code}.`);
            return result;
        } catch (error) {
            this.logger.error(`Error while generating tickets: ${error.message}`);
            return null;
        }
    }

    getTicketsDAO = async () => {
        try {
            let result = await ticketsModel.find()
            if (!result) return null
            this.logger.info(`Ticket retrieved successfully`);
            return result;
        } catch (error) {
            this.logger.error(`Error while fetching tickets: ${error.message}`);
            return null;
        }
    }

    getTicketsByIdDAO = async (tid) => {
        try {
            let result = await ticketsModel.findById({_id: tid})
            if (!result) return null
            this.logger.info(`Ticket with id ${tid} retrieved successfully`);
            return result;
        } catch (error) {
            this.logger.error(`Error while fetching ticket with id ${tid}: ${error.message}`);
            return null;
        }
    }
}