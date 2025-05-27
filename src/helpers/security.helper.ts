import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../config/app.conf.js";

/**
 * Generates the hash of the password (wrap of `bcrypt.hash(...)`)
 * @param {string} plainText password to hash
 * @param {number} rounds number of rounds used to generate the salt
 * @returns {Promise<string>} a promise that will be resolve with the hashed password
 */
export const generateHashedPassword = (plainText: string, rounds = 12): Promise<string> => {
  return bcrypt.hash(plainText, rounds);
};

/**
 * Compares a plain password with an hash and returns a boolean (wrap of `bcrypt.compare(...)`)
 * @param {string} plainText plain password to check
 * @param {string} hash hash to use in comparison
 * @returns {Promise<boolean>} a promise that will be resolve with a boolean value, `true` if the password match, `false` otherwise
 */
export const comparePassword = (plainText: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(plainText, hash);
};

/**
 * Strips token's prefix
 * @param {string} token token to clean
 * @param {string} prefix prefix to strip
 * @returns {string} stripped token
 */
export const cleanAuthToken = (token: string, prefix: string): string => {
  // remove the prefix if the token starts with it
  if (token.startsWith(prefix)) {
    token = token.substring(prefix.length);
  }

  // remove the whitespace from the token
  return token.trim();
};

/**
 * Verify if the JWT token is valid
 * @param {string} token token to validate
 * @returns {string | jwt.JwtPayload} token's payload
 */
export const verifyJWT = (token: string): string | jwt.JwtPayload => {
  // remove the bearer prefix
  const accessToken = cleanAuthToken(token, "Bearer");

  // verify a token
  return jwt.verify(accessToken, config.jwtPublicKey.value);
};
