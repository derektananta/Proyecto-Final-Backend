import { productsModel } from "../models/products.model.js";
import { logger } from "../../middlewares/logger/logger.js"

export default class Products {

    constructor() {
        this.logger = logger;
    }

    getProductsDAO = async (query, options) => {
        try {
            let result = await productsModel.paginate(query, options);
            this.logger.info('Products successfully retrieved.');
            return result;
        } catch (error) {
            this.logger.error(`Error while fetching products: ${error.message}`);
            return null;
        }
    }

    getProductsByIdDAO = async (pid) => {
        try {
            let result = await productsModel.findById(pid);
            if (!result) {
                this.logger.info(`Product with ID ${pid} don´t found.`);
                return null
            }
            this.logger.info(`Product with ID ${pid} successfully retrieved.`);
            return result;
        } catch (error) {
            this.logger.error(`Error while fetching product with ID ${pid}: ${error.message}`);
            return null;
        }
    }

    createProductsDAO = async (productData) => {
        try {
            let result = await productsModel.create(productData);
            this.logger.info(`Product "${productData.title}" created successfully.`);
            return result;
        } catch (error) {
            this.logger.error(`Error while creating product: ${error.message}`);
            return null;
        }
    }

    updateProductsDAO = async (pid, productReplace) => {
        try {
            let result = await productsModel.updateOne({ _id: pid }, productReplace);
            this.logger.info(`Product with ID ${pid} updated successfully.`);
            return result;
        } catch (error) {
            this.logger.error(`Error while updating product with ID ${pid}: ${error.message}`);
            return null;
        }
    }

    deleteProductsDAO = async (pid) => {
        try {
            let result = await productsModel.deleteOne({ _id: pid });
            this.logger.info(`Product deleted successfully.`);
            return result;
        } catch (error) {
            this.logger.error(`Error while deleting product with ID ${pid}: ${error.message}`);
            return null;
        }
    }

    updateProductsStockDAO = async (pid, quantity) => {
        try {
            let product = await this.getProductsByIdDAO(pid)
            if (!product) return null
            if (product.stock < quantity) {
                this.logger.error(`Product stock is not enough`);
                return null
            }
            product.stock -= quantity
            let result = await product.save()
            this.logger.info(`Product stock updated successfully.`);
            return result;
        } catch (error) {
            this.logger.error(`Error updating stock of the product with ID ${pid}: ${error.message}`);
            return null;
        }
    }
}