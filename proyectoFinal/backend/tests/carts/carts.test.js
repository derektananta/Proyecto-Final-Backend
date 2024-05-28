import { expect } from "chai";
import supertest from "supertest";

const url = supertest("http://localhost:8080");

describe("Cart router test for user role (purchase process)", () => {
    // Se obtiene el carrito del usuario, junto con un producto; ambos creados previamente.
    const cid = "660072fcf0223d650f853846"
    const pid = "65ff88a0e1094d8023c90480"
    let cookie;

    beforeEach(async function () {
        const loginResponse = await url.post("/api/users/login").send({ email: "user@email.com", password: "123user" });
        cookie = loginResponse.headers["set-cookie"][0];
    });


    it("Test 1 - [POST] /api/carts/:cid/product/:pid | Add product to cart", async () => {
        const response = await url.post(`/api/carts/${cid}/product/${pid}`).set("Cookie", cookie);
        expect(response.status).to.equal(200);
        expect(response.body.status).to.equal("success");
        expect(response.body.payload._id).to.equal(cid);
    });

    it("Test 2 - [POST] /api/carts/:cid/product/:pid | Add same product to cart", async () => {
        const response = await url.post(`/api/carts/${cid}/product/${pid}`).set("Cookie", cookie);
        expect(response.status).to.equal(200);
        expect(response.body.status).to.equal("success");
        expect(response.body.payload._id).to.equal(cid);
        const products = response.body.payload.products;
        const quantity = products[0].quantity;
        expect(quantity).to.be.above(1);
    });

    it("Test 3 - [PUT] /api/carts/quantity/:cid/product/:pid | Update quantity of product in cart", async () => {
        const response = await url.put(`/api/carts/quantity/${cid}/product/${pid}`).set("Cookie", cookie).send({
            quantity: 3
        });
        expect(response.status).to.equal(200);
        expect(response.body.status).to.equal("success");
        expect(response.body.payload._id).to.equal(cid);
        const products = response.body.payload.products;
        const quantity = products[0].quantity;
        expect(quantity).to.be.equal(3);
    });

    it("Test 4 - [POST] /api/carts/purchase/:cid | Purchase cart", async () => {
        const response = await url.post(`/api/carts/purchase/${cid}`).set("Cookie", cookie);
        console.log(response.body)
        expect(response.status).to.equal(200);
        expect(response.body.status).to.equal("success");
        expect(response.body.ticket)
        expect(response.body.ticket.purchaser).to.be.equal("user@email.com")
        const productsPurchased = response.body.purchasedProducts
        const productPurchasedQuantity = productsPurchased[0].quantity
        expect(productPurchasedQuantity).to.be.equal(3)
    });

    it("Test 5 - [DELETE] /api/carts/:cid | Clear cart", async () => {
        await url.post(`/api/carts/${cid}/product/${pid}`).set("Cookie", cookie);
        const response = await url.delete(`/api/carts/${cid}`).set("Cookie", cookie);
        expect(response.status).to.equal(200);
        expect(response.body.status).to.equal("success");
        expect(response.body.payload._id).to.equal(cid);
    });

    it("Test 6 - [DELETE] /api/carts/:cid/product/:pid | Delete product from cart", async () => {
        await url.post(`/api/carts/${cid}/product/${pid}`).set("Cookie", cookie);
        const response = await url.delete(`/api/carts/${cid}/product/${pid}`).set("Cookie", cookie);
        expect(response.status).to.equal(200);
        expect(response.body.status).to.equal("success");
        expect(response.body.payload._id).to.equal(cid);
    });
});
