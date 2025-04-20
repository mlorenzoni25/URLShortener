import { v4 as uuidV4 } from "uuid";

// base62 charset
const BASE62_CHARSET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

/**
 * Generates a UUID v4
 * @returns {string} a string in UUID v4 format
 */
export const generateUUID = (): string => uuidV4();

/**
 * Converts a number into base62 string
 * @param {number} value number to convert
 * @returns {string} base62 string
 */
export const toBase62 = (value: number): string => {
  let result = "";

  while (value > 0) {
    result = BASE62_CHARSET[value % 62] + result;
    value = Math.floor(value / 62);
  }

  return result;
};
