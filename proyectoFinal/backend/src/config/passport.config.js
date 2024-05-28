import passport from "passport";
import passportJwt from "passport-jwt";
import { cookieExtractor } from "../utils.js";
import Users from "../dao/classes/users.dao.js";

const usersService = new Users();

const JWTStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

export const initializePassport = () => {

    passport.use(new JWTStrategy(
        {
            jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
            secretOrKey: process.env.JWT_SECRET
        },
        async (jwt_payload, done) => {
            try {
                const user = await usersService.getUserByIdDAO(jwt_payload.uid);

                if (!user) {
                    return done(null, user, { message: "User not found" })
                }
                return done(null, user)
            }
            catch (err) {
                return done(err)
            }
        }
    ));
}
