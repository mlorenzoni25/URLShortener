import { Request } from "express";
import jwt, { Algorithm, JwtPayload } from "jsonwebtoken";
import { config } from "../config/app.conf.js";
import AuthenticationError from "../exception/authentication.exception.js";
import { comparePassword, generateHashedPassword } from "../helpers/security.helper.js";
import { generateUUID } from "../helpers/string.helper.js";
import { registerUserRequestToModel } from "../mappers/user.mapper.js";
import { AuthToken } from "../models/token.model.js";
import { UserModel } from "../models/user.model.js";
import { LoginRequest, RegisterUserRequest } from "../schema/user.schema.js";

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

/**
 * Login user
 * @param {Request} req request
 * @param {LoginRequest} data custom request
 * @returns {Promise<AuthToken>} object with `accessToken` e `refreshToken`
 */
export const loginUser = async (req: Request, data: LoginRequest): Promise<AuthToken> => {
  // search the user on database
  const users = await UserModel.query("Username")
    .eq(data.username)
    .using("UsernameIndex")
    .limit(1)
    .exec();

  // if anyone user match return an error
  if (!users || users.length === 0) {
    throw new AuthenticationError([], "Login failed: username not found in the database.");
  }

  // check if the password is the same
  const isEquals = await comparePassword(data.password, users[0].password);
  if (!isEquals) {
    throw new AuthenticationError([], "Login failed: incorrect password.");
  }

  // create the base url of the app
  const baseURL = `${req.protocol}://${req.get("host")}/`;

  // generate the jwt access token for the user
  const accessToken = generateAccessToken(`${baseURL}/`, `${baseURL}/api`, users[0].userId, {
    admin: false,
    username: users[0].username,
  });

  // generate the jwt refresh token for the user
  const refreshToken = generateRefreshToken(`${baseURL}/`, users[0].userId, {
    username: users[0].username,
  });

  return { accessToken, refreshToken };
};

/**
 * Refresh the access token of the user
 * @param {Request} req request
 * @param {JwtPayload} user request's jwt payload
 * @returns {Promise<AuthToken>} new user's tokens
 */
export const refreshUser = async (req: Request, user: JwtPayload): Promise<AuthToken> => {
  // create the base url of the app
  const baseURL = `${req.protocol}://${req.get("host")}`;

  // generate the jwt access token for the user
  const accessToken = generateAccessToken(`${baseURL}/`, `${baseURL}/api`, user.userId, {
    admin: false,
    username: user.username,
  });

  // generate the jwt refresh token for the user
  const refreshToken = generateRefreshToken(`${baseURL}/`, user.userId, {
    username: user.username,
  });

  return { accessToken, refreshToken };
};

/**
 * Generate an access token
 * @param {string} iss token's issuer
 * @param {string} aud token's audience
 * @param {string} sub token's subject
 * @param {string | object} payload token's payload
 * @returns {string} refresh token
 */
const generateAccessToken = (
  iss: string,
  aud: string,
  sub: string,
  payload: string | object,
): string => {
  return jwt.sign(payload, config.jwtPrivateKey, {
    algorithm: config.jwtAlgorithm as Algorithm,
    audience: aud,
    issuer: iss,
    subject: sub,
    jwtid: generateUUID(),
    expiresIn: config.jwtAccessExpiry,
    notBefore: 0,
  });
};

/**
 * Generate a refresh token
 * @param {string} iss token's issuer
 * @param {string} sub token's subject
 * @param {string | object} payload token's payload
 * @returns {string} refresh token
 */
const generateRefreshToken = (iss: string, sub: string, payload: string | object): string => {
  return jwt.sign(payload, config.jwtPrivateKey, {
    algorithm: config.jwtAlgorithm,
    issuer: iss,
    subject: sub,
    jwtid: generateUUID(),
    expiresIn: config.jwtRefreshExpiry,
  });
};
