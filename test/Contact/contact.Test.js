const chai = require(`chai`);
const request = require("supertest");
const SERVER_URL = "http://127.0.0.1:8000";
const TEST_USER = {username: "test", password: "1234"};
let authentication_token;
const should = chai.should();

describe("CON_01: Store new contacts", () => {
    let createdContact;
    before(async () => {
        let authentication = await request(SERVER_URL)
            .post("/auth/login")
            .set("content-type", "application/x-www-form-urlencoded")
            .send(TEST_USER);
        authentication_token = authentication.body.access_token;

        let res = await request(SERVER_URL)
            .delete(`/api/v1/contacts/1`)
            .set("Authorization", `Bearer ${authentication_token}`)
            .send()
    })

    it("Should create contacts successfully with all fields", async () => {
        let create = await request(SERVER_URL)
            .post("/api/v1/contacts/")
            .set("Authorization", `Bearer ${authentication_token}`)
            .send({
                "firstName": "John",
                "lastName": "Doe",
                "email": "email@email.com",
                "phone": "933123123",
                "mobile": "633123123"
            })
        create.status.should.be.equals(201);
        createdContact = create.body.id;
    });

    it("Should create contacts successfully with only mandatory fields", async () => {
        let create = await request(SERVER_URL)
            .post("/api/v1/contacts/")
            .set("Authorization", `Bearer ${authentication_token}`)
            .send({
                "firstName": "John",
                "lastName": "Doe",
            })
        create.status.should.be.equals(201);
        createdContact = create.body.id;
    });

    it("Should not create contact if surname is missing", async () => {
        let create = await request(SERVER_URL)
            .post("/api/v1/contacts/")
            .set("Authorization", `Bearer ${authentication_token}`)
            .send({
                "firstName": "John",
            })
        create.status.should.be.equals(422);
        create.body.detail[0].loc[2].should.be.equals("lastName")
        create.created.should.be.false;
        createdContact = create.body.id;
    });

    it("Should not create contact if name is missing", async () => {
        let create = await request(SERVER_URL)
            .post("/api/v1/contacts/")
            .set("Authorization", `Bearer ${authentication_token}`)
            .send({
                "lastName": "Doe",
            })
        create.status.should.be.equals(422);
        create.body.detail[0].loc[2].should.be.equals("firstName")
        create.created.should.be.false;
        createdContact = create.body.id;
    });

    afterEach(async () => {
        let res = await request(SERVER_URL)
            .delete(`/api/v1/contacts/${createdContact}`)
            .set("Authorization", `Bearer ${authentication_token}`)
            .send()
    })
});

describe("CON_02: Avoid duplicates", () => {
    let initialContactId;
    let initialContact = {firstName: "John", lastName: "Doe"};

    let createdContactId;

    before(async () => {
        let authentication = await request(SERVER_URL)
            .post("/auth/login")
            .set("content-type", "application/x-www-form-urlencoded")
            .send(TEST_USER);
        authentication_token = authentication.body.access_token;

        let initialContactRequest = await request(SERVER_URL)
            .post("/api/v1/contacts/")
            .set("Authorization", `Bearer ${authentication_token}`)
            .send(initialContact);
        initialContactId = initialContactRequest.body.id;
    })

    it("Should not allow creating a duplicate with same name and surname", async () => {
        let create = await request(SERVER_URL)
            .post("/api/v1/contacts/")
            .set("Authorization", `Bearer ${authentication_token}`)
            .send(initialContact);
        create.status.should.be.equals(400);
        create.body.detail.should.be.equals("Conflict, contact for John Doe already exists");
        createdContactId = create.body.id;
    });

    it("Should allow creating a contact with same name but different last name", async () => {
        let create = await request(SERVER_URL)
            .post("/api/v1/contacts/")
            .set("Authorization", `Bearer ${authentication_token}`)
            .send({
                "firstName": "John",
                "lastName": "Smith",
            })
        create.status.should.be.equals(201);
        createdContactId = create.body.id;
    });

    it("Should allow creating a contact with same last name but different name", async () => {
        let create = await request(SERVER_URL)
            .post("/api/v1/contacts/")
            .set("Authorization", `Bearer ${authentication_token}`)
            .send({
                "firstName": "Michael",
                "lastName": "Doe",
            })
        create.status.should.be.equals(201);
        createdContactId = create.body.id;
    });

    afterEach(async () => {
        let res = await request(SERVER_URL)
            .delete(`/api/v1/contacts/${createdContactId}`)
            .set("Authorization", `Bearer ${authentication_token}`)
            .send()
    })

    after(async () => {
        let res = await request(SERVER_URL)
            .delete(`/api/v1/contacts/${initialContactId}`)
            .set("Authorization", `Bearer ${authentication_token}`)
            .send()
    })
});


describe("CON_03: Retrieve contacts", () => {
    let createdContactId;

    before(async () => {
        let authentication = await request(SERVER_URL)
            .post("/auth/login")
            .set("content-type", "application/x-www-form-urlencoded")
            .send(TEST_USER);
        authentication_token = authentication.body.access_token;
    })

    it("Should retrieve existing contacts", async () => {
        let res = await request(SERVER_URL)
            .get("/api/v1/contacts/")
            .set("Authorization", `Bearer ${authentication_token}`)
            .send()
        res.status.should.be.equals(200);
        res.body.should.be.length(0);
    });

    it("Should retrieve existing contacts", async () => {

        let create = await request(SERVER_URL)
        .post("/api/v1/contacts/")
        .set("Authorization", `Bearer ${authentication_token}`)
        .send({
            "firstName": "Michael",
            "lastName": "Doe",
        })
    create.status.should.be.equals(201);
    createdContactId = create.body.id;

    let res = await request(SERVER_URL)
        .get("/api/v1/contacts/")
        .set("Authorization", `Bearer ${authentication_token}`)
        .send()
    res.status.should.be.equals(200);
    res.body.should.be.length(1);

});

    afterEach(async () => {
        let res = await request(SERVER_URL)
            .delete(`/api/v1/contacts/${createdContactId}`)
            .set("Authorization", `Bearer ${authentication_token}`)
            .send()
    })

});