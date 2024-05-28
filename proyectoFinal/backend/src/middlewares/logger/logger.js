import winston from "winston"

const ENV = process.env.ENV

const customLevelsOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: "red",
        error: "magenta",
        warning: "yellow",
        info: "cyan",
        http: "green",
        debug: "gray"
    }
}

const devLogger = winston.createLogger({
    levels: customLevelsOptions.levels,
    transports: [
        new winston.transports.Console({
            level: "debug",
            format: winston.format.combine(
                winston.format.colorize({ colors: customLevelsOptions.colors }),
                winston.format.simple()
            )
        })
    ]
})

const prodLogger = winston.createLogger({
    levels: customLevelsOptions.levels,
    transports: [
        new winston.transports.Console({
            level: "info",
            format: winston.format.combine(
                winston.format.colorize({ colors: customLevelsOptions.colors }),
                winston.format.simple()
            )
        }),

        new winston.transports.File({
            filename: "./src/middlewares/logger/logs/errors.log",
            level: "error",
            format: winston.format.simple()
        })
    ]
})

export const logger = ENV === "PRODUCTION" ? prodLogger : devLogger;

export const middlewareLogger = (req, res, next) => {
    req.logger = logger
    req.logger.http(`${req.method} in ${req.url} at ${new Date().toLocaleTimeString()}`)
    next()
}