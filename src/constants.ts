import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// charset
export const CHARSET = {
  // base62
  BASE62: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
};

// validation regex
export const REGEX = {
  // alphanumeric with . _ -
  ALPHANUM_SOFT_SPECIAL: /^[a-zA-Z0-9._-]+$/,
  // only lower case alpha
  LC_ALPHA: /[a-z]/,
  // only upper case alpha
  UC_ALPHA: /[A-Z]/,
  // only numbers
  NUMBER: /\d/,
  // special chars
  HARD_SPECIALS: /[!@#$%^&*]/,
};

// token JWT
export const JWT = {
  // supported algorithms
  ALGORITHMS: [
    "HS256",
    "HS384",
    "HS512",
    "RS256",
    "RS384",
    "RS512",
    "ES256",
    "ES384",
    "ES512",
    "PS256",
    "PS384",
    "PS512",
  ],
};

// logger
export const LOGGER = {
  // directory where store log's files
  BASE_DIRECTORY: path.join(__dirname, "..", "logs"),
};

// cache
export const CACHE = {
  // maximum number of URLs to store in cache
  URL_MAX_SIZE: 50,
  // duration in seconds of URLs in cache
  URL_SECONDS_EXPIRE: 86400,
};
