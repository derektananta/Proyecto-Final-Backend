import mongoose from "mongoose"

const ticketsCollection = "tickets"

const ticketsSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    purchase_datetime: {
        type: Date,
        required: true
    },
    amount: {
        type: Number,
        default: 0
    },
    purchaser: {
        type: String
    }
})

export const ticketsModel = mongoose.model(ticketsCollection, ticketsSchema)