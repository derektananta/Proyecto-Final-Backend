import { expect } from "chai";
import supertest from "supertest";

const url = supertest("http://localhost:8080");

describe("Product router test", () => {
    let cookie;
    let pid;

    beforeEach(async function () {
        // Se realiza login de un usuario creado previamente en la base de datos, con el rol de administrador para no tener problemas con la authenticacion y autorizacion.
        const loginResponse = await url.post("/api/users/login").send({ email: "admin@email.com", password: "123admin" });
        const cookieResult = loginResponse.headers["set-cookie"][0];

        cookie = {
            name: cookieResult.split("=")[0],
            value: cookieResult.split("=")[1].split(";")[0]
        };
    });

    it("Test 1 - [POST] /api/products | Create product", async function () {
        const mockProduct = {
            title: "Product Test",
            description: "Product description",
            price: 50,
            thumbnail: "product-image.jpg",
            code: "P001",
            stock: 10,
            category: "Test"
        };

        const response = await url.post("/api/products").set("Cookie", `${cookie.name}=${cookie.value}`).send(mockProduct);
        pid = response._body.payload._id
        expect(response._body.payload.category).to.be.equal("Test")
        expect(response.statusCode).to.equal(201);
    });

    it("Test 2 - [GET] /api/products/ | Get all products", async function () {
        const response = await url.get(`/api/products/`).set("Cookie", `${cookie.name}=${cookie.value}`)
        expect(response.statusCode).to.equal(200);
        expect(response._body.payload.docs).to.be.an("array")
        expect(response._body.payload.totalDocs)
        expect(response._body.payload.limit)
    });

    it("Test 3 - [GET] /api/products/{pid} | Get product by id", async function () {
        const response = await url.get(`/api/products/${pid}`).set("Cookie", `${cookie.name}=${cookie.value}`)
        expect(response.statusCode).to.equal(200);
        expect(response.body).to.be.an("object");
        expect(response._body.payload.category).to.be.equal("Test")
    });

    it("Test 4 - [PUT] /api/products/{pid} | Update product by id", async function () {
        const mockUpdate = {
            title: "Product Test Updated",
            description: "Product description",
            price: 50,
            thumbnail: "product-image.jpg",
            code: "P001",
            stock: 10,
            category: "Test"
        };
        const response = await url.put(`/api/products/${pid}`).set("Cookie", `${cookie.name}=${cookie.value}`).send(mockUpdate);
        expect(response.statusCode).to.equal(200);
        expect(response.body.payload.modifiedCount).to.equal(1)
        expect(response.body.status).to.equal("success");
    });

    it("Test 5 - [DELETE] /api/products/{pid} | Delete product by id", async function () {
        const response = await url.delete(`/api/products/${pid}`).set("Cookie", `${cookie.name}=${cookie.value}`)
        expect(response.body.payload.deletedCount).to.equal(1)
        expect(response.statusCode).to.equal(200);
        expect(response.body.status).to.equal("success");
    });

});
