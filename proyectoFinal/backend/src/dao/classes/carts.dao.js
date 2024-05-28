import { cartsModel } from "../models/carts.model.js"
import { logger } from "../../middlewares/logger/logger.js"

export default class Carts {

    constructor() {
        this.logger = logger;
    }

    createCartsDao = async (cartData) => {
        try {
            let result = await cartsModel.create(cartData)
            this.logger.info(`Cart with id ${result._id} created successfully`)
            return result;
        }
        catch (error) {
            this.logger.error(`Error while creating cart: ${error.message}`)
            return null;
        }
    }

    getCartsDAO = async () => {
        try {
            let result = await cartsModel.find()
            this.logger.info(`Carts successfully retrieved`)
            return result;
        }
        catch (error) {
            this.logger.error(`Error while fetching carts: ${error.message}`)
            return null;
        }
    }

    getCartsByIdDAO = async (cid) => {
        try {
            let result = await cartsModel.findById({ _id: cid }).populate('products.product');
            if (!result) {
                this.logger.info(`Cart with id ${cid} don´t found`)
                return null
            }
            this.logger.info(`Cart with id ${cid} successfully retrieved`)
            return result;
        }
        catch (error) {
            this.logger.error(`Error while fetching cart: ${error.message}`)
            return null;
        }
    }

    deleteCartsDAO = async (cid) => {
        try {
            let result = await cartsModel.deleteOne({ _id: cid })
            this.logger.info(`Cart deleted successfully`)
            return result;
        }
        catch (error) {
            this.logger.error(`Error while deleting cart with id ${cid}: ${error.message}`)
            return null;
        }
    }

    updateProductQuantityInCartDAO = async (cid, pid, newQuantity) => {
        try {
            let cart = await this.getCartsByIdDAO(cid);

            if (!cart) {
                return res.status(404).send({ status: "error", message: "Cart not found" });
            }

            const existingProductIndex = cart.products.findIndex((p) => p.product.equals(pid));

            if (existingProductIndex !== -1) {
                if (newQuantity !== undefined) {
                    cart.products[existingProductIndex].quantity = newQuantity;
                } else {
                    cart.products[existingProductIndex].quantity += 1;
                }

                if (newQuantity <= 0) {
                    return null;
                }
            }
            else {
                cart.products.push({ product: pid, quantity: 1 });
            }

            let result = await cart.save();
            this.logger.info(`Cart with ID ${cid} updated quantity successfully`);
            return result;
        } catch (error) {
            this.logger.error(`Error while updating product quantity in cart: ${error.message}`);
            return null;
        }
    }

    updateCartsDAO = async (cid, productsUpdate) => {
        try {
            let result = await cartsModel.findByIdAndUpdate(
                cid,
                {
                    $set: {
                        'products': productsUpdate,
                    },
                },
                { new: true }
            ).populate('products.product');
            this.logger.info(`Cart with ID ${cid} updated successfully`);
            return result;
        } catch (error) {
            this.logger.error(`Error while updating cart with ID ${cid}: ${error.message}`);
            return null;
        }
    };

    deleteProductFromCartDAO = async (cid, pid) => {
        try {
            let result = await cartsModel.findOneAndUpdate(
                { _id: cid, 'products.product': pid },
                { $pull: { 'products': { product: pid } } },
                { new: true }
            );
            if (!result) return null;
            this.logger.info(`Product with ID ${pid} removed from cart with ID ${cid}`);
            return result;
        } catch (error) {
            this.logger.error(`Error while removing product with ID ${pid} from cart with ID ${cid}: ${error.message}`);
            return null;
        }
    }

    clearCartDAO = async (cid) => {
        try {
            let cart = await this.getCartsByIdDAO(cid)
            if (!cart) {
                return res.status(404).send({ status: "error", message: "Cart not found" });
            }
            cart.products = []
            let result = await cart.save()
            this.logger.info(`Cart with ID ${cid} successfully clear`);
            return result;
        } catch (error) {
            this.logger.error(`Error while clearing cart with ID ${cid}: ${error.message}`);
            return null;
        }
    }

    removeProductsFromCartDAO = async (cid, productsToRemove) => {
        try {
            let cart = await this.getCartsByIdDAO(cid);

            if (!cart) {
                return null;
            }
            cart.products = cart.products.filter(product => {
                return !productsToRemove.find(item => item.pid.toString() === product.product._id.toString());
            });
            let result = await cart.save();
            this.logger.info(`Products removed from cart with ID ${cid}`);
            return result;
        } catch (error) {
            this.logger.error(`Error while removing products from cart with ID ${cid}: ${error.message}`);
            return null;
        }
    }

}