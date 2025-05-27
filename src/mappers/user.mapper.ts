import { UserItem, UserModel } from "../models/user.model.js";
import { RegisterUserRequest } from "../schema/user.schema.js";

/**
 * Transforms the request object into model object
 * @param {RegisterUserRequest} request user info
 * @returns {UserItem} instance for the users table's model
 */
export const registerUserRequestToModel = (request: RegisterUserRequest): UserItem => {
  return new UserModel({
    userId: "",
    password: request.password,
    username: request.username,
  });
};
