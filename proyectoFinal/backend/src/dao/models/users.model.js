import mongoose from "mongoose";

const usersCollection = "users"

const usersSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    role: {
        type: String,
        default: "user"
    },
    carts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "carts"
        }
    ],
    password: {
        type: String,
        required: true
    },
    last_connection: String
})

export const usersModel = mongoose.model(usersCollection, usersSchema)