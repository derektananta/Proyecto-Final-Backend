import { Router } from "express"
import { registerUserController, loginUserController, getUserProfile, updateUserController, getUsersController, deleteUserController, logoutUserController, clearUsersController, getUserCartController, getUserCurrentController, deleteUserByEmailController, updateUserRoleByEmailController } from "../controllers/users.controller.js";
import { authenticateJWTAndRole } from "../middlewares/auth/auth.JWT.Role.js";

export const router = Router()

router.post("/register", registerUserController);
router.post("/login", loginUserController)
router.post("/logout", authenticateJWTAndRole(["user", "premium", "admin"]), logoutUserController)
router.get("/profile", authenticateJWTAndRole(["user", "premium", "admin"]), getUserProfile)
router.put("/:uid", authenticateJWTAndRole(["admin"]), updateUserController)
router.get("/", authenticateJWTAndRole(["admin"]), getUsersController)
router.delete("/:uid", authenticateJWTAndRole(["admin"]), deleteUserController)
router.delete("/", authenticateJWTAndRole(["admin"]), clearUsersController)
router.get("/cart", authenticateJWTAndRole(["user"]), getUserCartController)
router.get("/current", authenticateJWTAndRole(["user", "premium", "admin"]), getUserCurrentController)
router.delete("/email/:email", authenticateJWTAndRole(["admin"]), deleteUserByEmailController)
router.put("/role/:email", authenticateJWTAndRole("admin"), updateUserRoleByEmailController)
