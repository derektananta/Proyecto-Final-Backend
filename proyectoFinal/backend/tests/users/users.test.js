import { expect } from "chai";
import supertest from "supertest";

const url = supertest("http://localhost:8080")

describe("User router test", () => {

    let cookie;
    let uid;

    it("Test 1 - [POST] /api/users/register | Register user", async function () {
        const mockUser = {
            first_name: "Pepe",
            last_name: "Sanchez",
            email: "pepesanchez@email.com",
            age: 18,
            password: "123",
        }
        const testUser = await url.post("/api/users/register").send(mockUser)
        uid = testUser.body.payload._id
        expect(testUser.statusCode).to.be.eql(201)
        expect(testUser.header["set-cookie"]).is.not.exist
    })

    it("Test 2 - [POST] /api/users/login | Login user (cookie)", async function () {
        const mockUser = {
            email: "pepesanchez@email.com",
            password: "123"
        }
        const testUser = await url.post("/api/users/login").send(mockUser)
        const cookieResult = testUser.headers["set-cookie"][0]

        expect(cookieResult).to.be.ok
        cookie = {
            name: cookieResult.split("=")[0],
            value: cookieResult.split("=")[1]
        }

        expect(cookie.name).to.be.ok.and.eql("authCookie")
        expect(cookie.value).to.be.ok
    })

    it("Test 3 - [GET] /api/users/profile | Profile user (current - cookie)", async function () {
        const { _body } = await url.get("/api/users/profile").set("Cookie", [`${cookie.name}=${cookie.value}`])
        expect(_body.payload.email).to.be.eql("pepesanchez@email.com")
    })

    it("Test 4 - [POST] /api/users/logout | Logout user", async function () {
        const testUser = await url.post("/api/users/logout").set("Cookie", [`${cookie.name}=${cookie.value}`])
        expect(testUser.statusCode).to.be.eql(200)

        const cookieResult = testUser.headers["set-cookie"][0]
        expect(cookieResult).to.be.ok

        cookie = {
            name: cookieResult.split("=")[0],
            value: cookieResult.split("=")[1].split(";")[0]
        }
        expect(cookie.name).to.be.ok.and.eql("authCookie")
        expect(cookie.value).to.be.empty
    })

    after(async function () {
        // Se realiza login de un usuario creado previamente en la base de datos, con el rol de administrador para no tener problemas con la authenticacion y autorizacion.
        // Se elimina el producto creado anteriormente.
        const loginResponse = await url.post("/api/users/login").send({ email: "admin@email.com", password: "123admin" });
        const cookieResult = loginResponse.headers["set-cookie"][0];

        cookie = {
            name: cookieResult.split("=")[0],
            value: cookieResult.split("=")[1].split(";")[0]
        };

        await url.delete(`/api/users/${uid}`).set("Cookie", [`${cookie.name}=${cookie.value}`] )
    })
})