import { usersModel } from "../models/users.model.js";
import { logger } from "../../middlewares/logger/logger.js";

export default class Users {
    constructor() {
        this.logger = logger;
    }

    createUserDAO = async (userData) => {
        try {
            let result = await usersModel.create(userData)
            if (!result) return null
            this.logger.info("User created successfully")
            return result;
        }
        catch (err) {
            this.logger.error(`Error creating user: ${err.message}`)
            return null;
        }
    }

    getUserByIdDAO = async (uid) => {
        try {
            let result = await usersModel.findById({ _id: uid })
            if (!result) return null
            this.logger.info(`User with id ${uid} retrieved successfully`)
            return result;
        }
        catch (err) {
            this.logger.error(`Error retrieving user with id ${uid}: ${err.message}`)
            return null;
        }
    }

    getUserByEmailDAO = async (email) => {
        try {
            let result = await usersModel.findOne({ email: email })
            if (!result) return null
            this.logger.info(`User with email ${email} retrieved successfully`)
            return result;
        }
        catch (err) {
            this.logger.error(`Error retrieving user with this email ${email}: ${err.message}`)
            return null;
        }

    }

    updateUserDAO = async (uid, userReplace) => {
        try {
            let result = await usersModel.updateOne({ _id: uid }, userReplace)
            if (!result) return null
            this.logger.info(`User with id ${uid} updated successfully`)
            return result;
        }
        catch (err) {
            this.logger.error(`Error updating user with id ${uid}: ${err.message}`)
            return null;
        }
    }

    getUsersDAO = async () => {
        try {
            let result = await usersModel.find()
            if (!result) return null
            this.logger.info(`Users retrieved successfully`)
            return result;
        }
        catch (err) {
            this.logger.error(`Error retrieving users: ${err.message}`)
            return null;
        }
    }

    deleteUserDAO = async (uid) => {
        try {
            let result = await usersModel.deleteOne({ _id: uid })
            if (!result) return null
            this.logger.info(`User deleted successfully`)
            return result;
        }
        catch (err) {
            this.logger.error(`Error deleting user with id ${uid}: ${err.message}`)
            return null;
        }
    }

    updateUserConnectionDAO = async (uid) => {
        try {
            let result = await usersModel.findByIdAndUpdate(uid, { last_connection: new Date().toUTCString() })
            if (!result) return null
            this.logger.info(`User connection updated successfully`)
            return result;
        }
        catch (err) {
            this.logger.error(`Error updating user with id ${uid} connection: ${err.message}`)
            return null;
        }
    }

    deleteUserByEmailDAO = async (email) => {
        try {
            let result = await usersModel.deleteOne({ email: email })
            if (!result) return null
            this.logger.info(`User deleted successfully`)
            return result;
        }
        catch (err) {
            this.logger.error(`Error deleting user with email ${email}: ${err.message}`)
            return null;
        }
    }

    updateUserRoleByEmailDAO = async (email, role) => {
        try {
            let user = await this.getUserByEmailDAO(email)
            if (!user) {
                return res.status(404).send({ status: "error", message: "user not found" });
            }
            let result = await usersModel.updateOne({ email: email }, {$set: {role: role}})
            if (!result) return null
            this.logger.info(`User deleted successfully`)
            return result;
        }
        catch (err) {
            this.logger.error(`Error deleting user with email ${email}: ${err.message}`)
            return null;
        }
    }
}