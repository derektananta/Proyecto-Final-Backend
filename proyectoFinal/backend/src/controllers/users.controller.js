import Users from "../dao/classes/users.dao.js";
import UserProfileDTO from "../dto/user.dto.js";
import jwt from "jsonwebtoken";
import { createHash, isValidPassword } from "../utils.js";
import Carts from "../dao/classes/carts.dao.js";
import moment from "moment"
import { transporter } from "../services/mail/mailing.js";

const usersService = new Users()
const cartsService = new Carts()

export const registerUserController = async (req, res) => {
    try {
        let { first_name, last_name, email, age, password } = req.body;

        if (!first_name || !last_name || !email || !age || !password) {
            return res.status(400).send({ status: "error", message: "Incomplete fields" });
        }

        if (typeof first_name !== "string" || typeof last_name !== "string" || typeof email !== "string" || typeof age !== "number" || typeof password !== "string") {
            return res.status(400).send({ status: "error", message: "Invalid data fields" });
        }

        const userExists = await usersService.getUserByEmailDAO(email)
        if (userExists) return res.status(409).send({ status: "error", message: "User with this email already exists" });


        const userData = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password)
        }

        let result = await usersService.createUserDAO(userData);

        if (result) {
            const userCart = await cartsService.createCartsDao()
            result.carts.push(userCart._id)
            await result.save()
        } else {
            return res.status(400).send({ status: "error", message: "Cannot create user" })
        }

        res.status(201).send({ status: "success", payload: result })
    }
    catch (err) {
        res.status(500).send("Server error " + err);
    }
}

export const loginUserController = async (req, res) => {
    try {
        let { email, password } = req.body

        if (!email || !password) {
            return res.status(400).send({ status: "error", message: "Incomplete fields" });
        }

        if (typeof email !== "string" || typeof password !== "string") {
            return res.status(400).send({ status: "error", message: "Invalid data fields" });
        }

        const user = await usersService.getUserByEmailDAO(email)
        if (!isValidPassword(user, password)) {
            return res.status(401).send({ status: "error", message: "Invalid Credentials" })
        }

        const token = jwt.sign({ uid: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        if (!token) {
            return res.status(400).send({ status: "error", message: "Cannot login user" })
        }

        res.cookie("authCookie", token, { signed: true, httpOnly: true });
        req.logger.info(`User with email ${email} logged successfully`)
        await usersService.updateUserConnectionDAO(user._id)
        return res.status(200).send({ message: "Login successful", payload: token });
    }
    catch (err) {
        res.status(500).send("Server error " + err);
    }
}

export const getUserProfile = async (req, res) => {
    try {
        const uid = req.user._id;
        const user = await usersService.getUserByIdDAO(uid);
        if (!user) {
            return res.status(404).send({ status: "error", message: "User not found" });
        }
        let result = new UserProfileDTO(req.user)
        if (!result) return res.status(404).send({ status: "error", message: "Cannot fetch user" })
        return res.status(200).send({ status: "success", payload: result });
    }
    catch (err) {
        res.status(500).send("Server error " + err);
    }
}

export const updateUserController = async (req, res) => {
    try {
        const uid = req.params.uid
        const userReplace = req.body.user
        if (!userReplace) return res.status(404).send({ status: "error", error: "User fields to replace not found" })
        if (!userReplace.email || !userReplace.first_name || !userReplace.last_name || !userReplace.age) return res.status(400).send({ status: "error", error: "Incomplete values" })
        const user = await usersService.getUserByIdDAO(uid);
        if (!user) {
            return res.status(404).send({ status: "error", message: "User not found" });
        }
        let result = await usersService.updateUserDAO(uid, userReplace)
        if (!result) return res.status(404).send({ status: "error", message: "The user with this Id cannot be updated because it does not exist" })
        return res.status(200).send({ status: "success", payload: result });
    }
    catch (err) {
        res.status(500).send("Server error " + err);
    }
}

export const getUsersController = async (req, res) => {
    try {
        const users = await usersService.getUsersDAO()
        if (!users) return res.status(404).send({ status: "error", message: "Cannot fetch users" })

        let result = users.map(user => new UserProfileDTO(user))
        return res.status(200).send({ status: "success", payload: result });
    }
    catch (err) {
        res.status(500).send("Server error " + err);
    }
}

export const deleteUserController = async (req, res) => {
    try {
        let uid = req.params.uid
        const user = await usersService.getUserByIdDAO(uid)
        const cid = user.carts[0]
        let result = await usersService.deleteUserDAO(uid)
        await cartsService.deleteCartsDAO(cid)
        if (!result) return res.status(404).send({ status: "error", message: `Cannot delete user with id ${uid}` })
        return res.status(200).send({ status: "success", payload: result });
    }
    catch (err) {
        res.status(500).send("Server error " + err);
    }
}

export const logoutUserController = async (req, res) => {
    try {
        const uid = req.user._id
        const user = await usersService.getUserByIdDAO(uid);
        if (!user) {
            return res.status(404).send({ status: "error", message: "User not found" });
        }
        res.clearCookie("authCookie");
        req.logger.info("User logout")
        return res.status(200).send({ status: "success", message: "Logout successful" });
    } catch (err) {
        return res.status(500).send({ status: "error", message: "Server error: " + err });
    }
}

export const clearUsersController = async (req, res) => {
    try {
        const twoDaysAgo = moment().subtract(2, 'days');

        const users = await usersService.getUsersDAO();

        const inactiveUsers = users.filter(user => {
            return moment(user.last_connection).isBefore(twoDaysAgo);
        });

        if (inactiveUsers.length === 0) {
            return res.status(400).send({ status: "error", message: "There are no inactive users" });
        }

        for (const user of inactiveUsers) {
            await usersService.deleteUserDAO(user._id);
            const mailOptions = {
                from: process.env.MAIL_USER,
                to: user.email,
                subject: 'Deleted account | BACKEND ECOMMERCE',
                text: `Your account has been deleted due to inactivity, you spent 2 days without any connection.`,
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    req.logger.error("Error sending mail" + error);
                    return res.status(500).json({ status: 'error', message: 'Error to send email.' });
                }
                req.logger.info('Email sent: ' + info.response);
                res.status(200).send({ status: 'success', message: 'Email sended succefully.' });
            });
        }

        return res.status(200).send({ status: "success", message: "Inactive users cleared successfully", usersDeleted: inactiveUsers });
    } catch (err) {
        return res.status(500).send({ status: "error", message: "Server error: " + err });
    }
}

export const getUserCartController = async (req, res) => {
    try {
        let cid = req.user.carts[0]
        let result = await cartsService.getCartsByIdDAO(cid)
        if (!result) return res.status(404).send({ status: "error", message: "Cannot get cart with this id because doesn´t exists" })
        res.status(200).send({ status: "success", payload: result })
    } catch (err) {
        res.status(500).send("Server error: " + err)
    }
}

export const getUserCurrentController = async (req, res) => {
    try {
        let uid = req.user._id
        let result = await usersService.getUserByIdDAO(uid)
        if (!result) return res.status(404).send({ status: "error", message: "Cannot get user" })
        res.status(200).send({ status: "success", payload: result })
    } catch (err) {
        res.status(500).send("Server error: " + err)
    }
}

export const deleteUserByEmailController = async (req, res) => {
    try {
        let email = req.params.email
        const current = req.user.email
        const user = await usersService.getUserByEmailDAO(email)
        if(current === email) return res.status(400).send({status: "error", message: "Cannot delete yourself"})
        const cid = user.carts[0]
        let result = await usersService.deleteUserByEmailDAO(email)
        await cartsService.deleteCartsDAO(cid)
        if (!result) return res.status(404).send({ status: "error", message: `Cannot delete user with email ${email}` })
        return res.status(200).send({ status: "success", payload: result });
    }
    catch (err) {
        res.status(500).send("Server error " + err);
    }
}

export const updateUserRoleByEmailController = async (req, res) => {
    try {
        let email = req.params.email
        const role = req.body.role
        if(role !== "admin" && role !== "premium" && role !== "user") return res.status(400).send({status: "error", message: "Role not allowed"})
        const current = req.user.email
        if(current === email) return res.status(400).send({status: "error", message: "Cannot update yourself"})
        let result = await usersService.updateUserRoleByEmailDAO(email, role)
        if (!result) return res.status(404).send({ status: "error", message: `Cannot update user role with email ${email}` })
        return res.status(200).send({ status: "success", payload: result });
    }
    catch (err) {
        res.status(500).send("Server error " + err);
    }
}