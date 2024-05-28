import express from "express"
import cookieParser from "cookie-parser"
import mongoose from "mongoose"
import passport from "passport"
import { middlewareLogger } from "./middlewares/logger/logger.js"
import { initializePassport } from "./config/passport.config.js"
import { router as usersRouter } from "./routes/users.router.js"
import { router as productsRouter } from "./routes/products.router.js"
import { router as cartsRouter } from "./routes/carts.router.js"
import { router as ticketsRouter } from "./routes/tickets.router.js"
import swaggerJsdoc from "swagger-jsdoc"
import swaggerUiExpress from "swagger-ui-express"
import cors from "cors"

const app = express()

app.use(express.json())
app.use(cors({credentials: true, origin: "http://localhost:5173"}))
app.use(express.urlencoded({ extended: true }))
app.use(middlewareLogger)
app.use(cookieParser(process.env.COOKIE_SIGN))
initializePassport()
app.use(passport.initialize())

app.use("/api/users", usersRouter)
app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)
app.use("/api/tickets", ticketsRouter)

mongoose.connect(process.env.ENV === "DEVELOPMENT" ? process.env.MONGO_URL_TEST : process.env.MONGO_URL)
    .then(() => {
        console.log("Connected to the database");
    })
    .catch((error) => {
        console.error("Error connecting to the database: " + error);
        process.exit(1);
    });

const swaggerOptions = {
    definition: {
        openapi: "3.0.1",
        info: {
            title: "Ecommerce API",
            description: "APIrestful developed during the backend programming course at coderhouse"
        }
    },
    apis: [`${process.cwd()}/src/docs/**/*.yaml`]
}

const specs = swaggerJsdoc(swaggerOptions)
app.use("/api/docs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs, {
    swaggerOptions: {
        supportedSubmitMethods: []
    }
}))

app.listen(process.env.PORT || 8080, () => console.log(`Server running`))