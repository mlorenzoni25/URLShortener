import request from "supertest";
import app from "../src/app.js";
import { LoginRequest, RegisterUserRequest } from "../src/schema/user.schema.js";
import {
  NEW_USER_PASSWORD,
  NEW_USER_USERNAME,
  TEST_USER_PASSWORD,
  TEST_USER_USERNAME,
} from "./utils/constants.js";

const loginUser = async (username: string, password: string): Promise<void> => {
  // request object
  const loginRequest: LoginRequest = {
    password,
    username,
  };

  // simulate the client's request
  const loginResponse = await request(app)
    .post("/api/login")
    .send(loginRequest)
    .set("Accept", "application/json");

  expect(loginResponse.status).toEqual(200);

  // get cookies from response's headers
  let cookies = loginResponse.get("Set-Cookie");

  // default array to avoid typescript's errors
  if (!cookies) {
    cookies = [];
  }

  expect(Array.isArray(cookies)).toBe(true);

  expect(cookies).toBeDefined();
  expect(cookies.length).toBeGreaterThanOrEqual(2);

  // search access e refresh tokens indexes
  const accessTokenIndex = cookies.findIndex((cookie) => cookie.startsWith("accessToken="));
  const refreshTokenIndex = cookies.findIndex((cookie) => cookie.startsWith("refreshToken="));

  expect(accessTokenIndex).toBeGreaterThan(-1);
  expect(refreshTokenIndex).toBeGreaterThan(-1);

  expect(cookies[accessTokenIndex]).toMatch(/HttpOnly/);
  expect(cookies[accessTokenIndex]).toMatch(/SameSite=Strict/);

  expect(cookies[refreshTokenIndex]).toMatch(/HttpOnly/);
  expect(cookies[refreshTokenIndex]).toMatch(/SameSite=Strict/);
};

describe("POST /api/register", () => {
  it("Should register a new user", async () => {
    // request object
    const registerRequest: RegisterUserRequest = {
      password: NEW_USER_PASSWORD,
      passwordConfirm: NEW_USER_PASSWORD,
      username: NEW_USER_USERNAME,
    };

    // simulate the client's request
    const registerResponse = await request(app)
      .post("/api/register")
      .send(registerRequest)
      .set("Accept", "application/json");

    expect(registerResponse.status).toEqual(200);
    expect(registerResponse.body).toHaveProperty(["data", "created"]);
    // expect(registerResponse.body.data.created).toBe(true);

    // try to login with user's credentials
    await loginUser(NEW_USER_USERNAME, NEW_USER_PASSWORD);
  });

  it("Should try to register a new user that already exists", async () => {
    // request object
    const registerRequest: RegisterUserRequest = {
      password: TEST_USER_PASSWORD,
      passwordConfirm: TEST_USER_PASSWORD,
      username: TEST_USER_USERNAME,
    };

    // simulate the client's request
    const registerResponse = await request(app)
      .post("/api/register")
      .send(registerRequest)
      .set("Accept", "application/json");

    expect(registerResponse.status).toEqual(200);
    expect(registerResponse.body).toHaveProperty(["data", "exists"]);
    expect(registerResponse.body.data.exists).toBe(true);

    // try to login with user's credentials
    await loginUser(NEW_USER_USERNAME, NEW_USER_PASSWORD);
  });
});
