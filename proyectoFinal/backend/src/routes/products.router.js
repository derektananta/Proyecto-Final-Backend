import { Router } from "express"
import { getProductsController, getProductsByIdController, createProductsController, updateProductsController, deleteProductsController } from "../controllers/products.controller.js"
import { authenticateJWTAndRole } from "../middlewares/auth/auth.JWT.Role.js"

export const router = Router()

router.post("/", authenticateJWTAndRole(["premium", "admin"]), createProductsController)

router.get("/", getProductsController)
router.get("/:pid", authenticateJWTAndRole(["admin"]), getProductsByIdController)

router.put("/:pid", authenticateJWTAndRole(["premium", "admin"]), updateProductsController)

router.delete("/:pid", authenticateJWTAndRole(["premium", "admin"]), deleteProductsController)