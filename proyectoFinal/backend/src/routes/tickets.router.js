import { Router } from "express"
import { getTicketsByIdController, getTicketsController } from "../controllers/tickets.controller.js"

export const router = Router()

router.get("/", getTicketsController)
router.get("/:tid", getTicketsByIdController)