const chai = require(`chai`);
const request = require("supertest");
const SERVER_URL = "http://127.0.0.1:8000";
const TEST_USER = { username: "test", password: "1234" };

const should = chai.should();

describe("AUTH_01: The user can authenticate to the system", () => {
  it("Should check the status of the service", async () => {
    let res = await request(SERVER_URL).get("/health").send();
    chai.expect(res.status).to.equal(200);
    chai.expect(res.body).to.be.deep.equal({
      pid: 8,
      rss_bytes: 32026624,
      num_connections: 2,
      cpu_percent: "0.2",
      db_status_ok: true,
      num_users: 1,
    });
  });
  it("Should login successfully with valid credentials", async () => {
    let res = await request(SERVER_URL)
      .post("/auth/login")
      .set("content-type", "application/x-www-form-urlencoded")
      .send(TEST_USER);
    res.status.should.be.equals(200);
    res.body.should.haveOwnProperty("access_token");
    res.body.should.haveOwnProperty("token_type");
  });

  it("Should reject login request with invalid credentials", async () => {
    let res = await request(SERVER_URL)
      .post("/auth/login")
      .set("content-type", "application/x-www-form-urlencoded")
      .send({ username: "test", password: "1235" });
    res.status.should.be.equals(422);
  });

  it("Should reject login request with missing credentials", async () => {
    let res = await request(SERVER_URL)
      .post("/auth/login")
      .set("content-type", "application/x-www-form-urlencoded")
      .send({ password: "1234" });
    res.status.should.be.equals(422);
    res.body.detail[0].loc.should.be.length(2);
  });
});

describe("AUTH_02: The user can validate if they are authenticated", () => {
  it("Should notify a non authenticated user", async () => {
    let res = await request(SERVER_URL)
      .get("/auth/me")
      .set("content-type", "application/x-www-form-urlencoded")
      .send();
    res.status.should.be.equals(401);
    res.body.detail.should.be.equals("Not authenticated");
  });
  it("Should notify an authenticated user", async () => {
    let authentication = await request(SERVER_URL)
      .post("/auth/login")
      .set("content-type", "application/x-www-form-urlencoded")
      .send(TEST_USER);

    let res = await request(SERVER_URL)
      .get("/auth/me")
      .set("content-type", "application/x-www-form-urlencoded")
      .set("Authorization", `Bearer ${authentication.body.access_token}`)
      .send();
    res.status.should.be.equals(200);
    res.body.should.be.deep.equals({
      id: 1,
      username: "test",
      full_name: "User test",
      email: "test@example.org",
      disabled: false,
    });
  });
});

describe("AUTH_03: The user can logout", () => {
  it("Should notify a non authenticated user", async () => {
    let res = await request(SERVER_URL)
      .get("/auth/logout")
      .set("content-type", "application/x-www-form-urlencoded")
      .send();
    res.status.should.be.equals(401);
    res.body.detail.should.be.equals("Not authenticated");
  });
  it("Should logout an authenticated user", async () => {
    let authentication = await request(SERVER_URL)
      .post("/auth/login")
      .set("content-type", "application/x-www-form-urlencoded")
      .send(TEST_USER);

    let res = await request(SERVER_URL)
      .get("/auth/logout")
      .set("content-type", "application/x-www-form-urlencoded")
      .set("Authorization", `Bearer ${authentication.body.access_token}`)
      .send();
    res.status.should.be.equals(200);
  });
});
