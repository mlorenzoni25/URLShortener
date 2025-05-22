import request from "supertest";
import app from "../src/app.js";
import { closeConnection } from "../src/redis.js";
import { CreateShortenedURLRequest } from "../src/schema/url.schema.js";

describe("POST /api/url", () => {
  it("Should create a simple shortened URL", async () => {
    // request object
    const requestData: CreateShortenedURLRequest = {
      url: "https://expressjs.com/",
    };

    // simulate the client's request
    const res = await request(app)
      .post("/api/url")
      .send(requestData)
      .set("Accept", "application/json");

    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty(["data", "shortenedUrl"]);
  });
});

describe("POST /api/url", () => {
  it("Should create a simple shortened URL fully customized", async () => {
    // request object
    const requestData: CreateShortenedURLRequest = {
      url: "https://expressjs.com/",
      maxUses: 50,
      password: "!_abcDEF_4554_FEDcba_!",
      validFrom: Date.now(),
      validTo: Date.now() + 86400000,
    };

    // simulate the client's request
    const res = await request(app)
      .post("/api/url")
      .send(requestData)
      .set("Accept", "application/json");

    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty(["data", "shortenedId"]);

    const requestData2 = {
      password: "!_abcDEF_4554_FEDcba_!",
    };

    const res2 = await request(app)
      .post(`/${res.body.data.shortenedId}`)
      .send(requestData2)
      .set("Accept", "application/json");

    expect(res2.status).toEqual(302);
  });
});

afterAll(async () => {
  closeConnection();
});
