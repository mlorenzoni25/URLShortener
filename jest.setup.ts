import request from "supertest";
import app from "./src/app.js";
import { closeConnection } from "./src/redis.js";
import { RegisterUserRequest } from "./src/schema/user.schema.js";
import { TEST_USER_PASSWORD, TEST_USER_USERNAME } from "./test/utils/constants.js";

/**
 * Create a fake user for testing purposes
 * @returns {Promise<void>}
 */
const createTestUser = async (): Promise<void> => {
  const registerRequest: RegisterUserRequest = {
    username: TEST_USER_USERNAME,
    password: TEST_USER_PASSWORD,
    passwordConfirm: TEST_USER_PASSWORD,
  };

  await request(app).post("/api/register").send(registerRequest).set("Accept", "application/json");
};

beforeAll(async () => {
  await createTestUser();
});

afterAll(async () => {
  await closeConnection();
});
