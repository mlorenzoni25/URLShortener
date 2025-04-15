import { generateHashedPassword } from "../helpers/security.helper.js";
import { generateUUID } from "../helpers/string.helper.js";
import { registerUserRequestToModel } from "../mappers/user.mapper.js";
import { UserModel } from "../models/user.model.js";
import { RegisterUserRequest } from "../schema/user.schema.js";

/**
 * Register a new user
 * @param {RegisterUserRequest} data user info
 * @returns {Promise<{}>} empty object
 */
export const registerUser = async (data: RegisterUserRequest): Promise<object> => {
  // check if the user already exists
  const users = await UserModel.query("Username")
    .eq(data.username)
    .using("UsernameIndex")
    .limit(1)
    .exec();

  // if there is a record with the same username send an error
  if (users && users.length > 0) {
    return {
      created: false,
      exists: true,
    };
  }

  // create the object to use for the saving
  const user = registerUserRequestToModel(data);

  // generate a unique identifier for the user
  user.userId = generateUUID();

  // hash the password to store it in a safety way
  user.password = await generateHashedPassword(user.password);

  // register the user's information on database
  await user.save();

  return {
    created: true,
    exists: false,
  };
};
