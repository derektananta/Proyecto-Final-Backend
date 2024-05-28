import { Router } from "express"
import { createCartsController, deleteCartsController, getCartsByIdController, getCartsController, addProductInCartController, clearCartController, deleteProductFromCartController, updateQuantityProductsInCartsController, purchaseCartController, updateCartsController} from "../controllers/carts.controller.js"
import { authenticateJWTAndRole } from "../middlewares/auth/auth.JWT.Role.js"

export const router = Router()

router.post("/", authenticateJWTAndRole(["admin"]), createCartsController)
router.post("/:cid/product/:pid", authenticateJWTAndRole(["user", "premium"]), addProductInCartController)
router.post("/purchase/:cid", authenticateJWTAndRole(["user", "premium"]), purchaseCartController)

router.get("/", authenticateJWTAndRole(["admin"]), getCartsController)
router.get("/:cid", authenticateJWTAndRole(["user", "premium", "admin"]), getCartsByIdController)

router.put(":/cid", authenticateJWTAndRole(["admin"]), updateCartsController)
router.put("/quantity/:cid/product/:pid", authenticateJWTAndRole(["user", "premium"]), updateQuantityProductsInCartsController)

router.delete("/:cid", authenticateJWTAndRole(["user", "premium"]), clearCartController)
router.delete("/:cid/product/:pid", authenticateJWTAndRole(["user", "premium"]), deleteProductFromCartController)
router.delete("/remove/:cid", authenticateJWTAndRole(["admin"]), deleteCartsController)