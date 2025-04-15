import bcrypt from "bcrypt";

/**
 * Generete the hash of the password (wrap of `bcrypt.hash(...)`)
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
