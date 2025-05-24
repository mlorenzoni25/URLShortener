import request from "supertest";
import app from "../src/app.js";
import { CreateShortenedURLRequest } from "../src/schema/url.schema.js";
import { URL_DURATION, URL_PASSWORD } from "./utils/constants.js";

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
    expect(typeof res.body.data.shortenedId).toBe("string");
    expect(res.body.data.shortenedId).not.toHaveLength(0);

    const res2 = await request(app)
      .post(`/${res.body.data.shortenedId}`)
      .set("Accept", "application/json");

    expect(res2.status).toEqual(302);
  });

  it("Should create a fully customized shortened URL", async () => {
    // request object
    const requestData: CreateShortenedURLRequest = {
      url: "https://expressjs.com/",
      maxUses: 50,
      password: URL_PASSWORD,
      validFrom: Date.now(),
      validTo: Date.now() + URL_DURATION,
    };

    // simulate the client's request
    const res = await request(app)
      .post("/api/url")
      .send(requestData)
      .set("Accept", "application/json");

    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty(["data", "shortenedId"]);
    expect(typeof res.body.data.shortenedId).toBe("string");
    expect(res.body.data.shortenedId).not.toHaveLength(0);

    const requestData2 = {
      password: URL_PASSWORD,
    };

    const res2 = await request(app)
      .post(`/${res.body.data.shortenedId}`)
      .send(requestData2)
      .set("Accept", "application/json");

    expect(res2.status).toEqual(302);
  });
});
