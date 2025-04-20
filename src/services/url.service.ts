import ValidationError from "../exception/validation.exception.js";
import { generateUUID, toBase62 } from "../helpers/string.helper.js";
import { URLRequestToModel } from "../mappers/url.mapper.js";
import { URLModel } from "../models/shortenedURLs.model.js";
import { CreateShortenedURLRequest } from "../schema/url.schema.js";

/**
 * Create a new shortened URL
 * @param {URLRequest} data url info
 * @returns {Promise<{shortenedUrl: string}>} object
 */
export const createShortenedURL = async (
  data: CreateShortenedURLRequest,
): Promise<{ shortenedUrl: string }> => {
  // choose the right callback to generate the shortened id
  const shortenedIdGenerator = data.alias
    ? generateShortenedIdFromAlias(data.alias)
    : generateShortenedId();

  // create the object to use for the saving
  const item = URLRequestToModel(data);

  // generate a unique identifier for the url
  item.shortenedId = await shortenedIdGenerator;

  // register the url's information on database
  await item.save();

  return { shortenedUrl: `http://localhost:3000/${item.shortenedId}` };
};

/**
 * Generates an id using the user's alias
 * @param {string} alias url's alias
 * @throws {ValidationError} if alias already exists
 * @returns {Promise<string>} shortened url
 */
const generateShortenedIdFromAlias = async (alias: string): Promise<string> => {
  // if already exists the alias I reject it
  const exists = await URLModel.get(alias);
  if (exists) {
    throw new ValidationError(
      "alias",
      "Alias is not available.",
      "Shortened URL generation failed: alias already used.",
    );
  }

  // alias not exists, so i can use it as shortened id
  return alias;
};

/**
 * Generates a random id
 * @returns {Promise<string>} shortened url
 */
const generateShortenedId = async (): Promise<string> => {
  let shortenedId = "";
  let exists = true;

  while (exists) {
    // generate a shortened value
    shortenedId = generateUniqueId();
    // check if it is unique
    exists = !!(await URLModel.get(shortenedId));
  }

  return shortenedId;
};

/**
 * Generates a unique ID to store the url's information
 * @returns {string} unique ID corresponding to shortened url
 */
const generateUniqueId = (): string => {
  // generate a unique identifier (uuid v4)
  const uuid = generateUUID();

  // convert it string (the first 6 chars) to a numeric format
  let hashInt = 0;
  for (let i = 0; i < 6; i++) {
    hashInt = (hashInt << 8) + parseInt(uuid[i].toString(), 16);
  }

  // convert to base62 to shorten the length
  return toBase62(hashInt);
};
