import AuthenticationError from "../exception/authentication.exception.js";
import CheckError from "../exception/check.exception.js";
import ValidationError from "../exception/validation.exception.js";
import * as DateHelper from "../helpers/date.helper.js";
import { comparePassword } from "../helpers/security.helper.js";
import { generateUUID, toBase62 } from "../helpers/string.helper.js";
import { URLRequestToModel } from "../mappers/url.mapper.js";
import { URLItem, URLModel } from "../models/shortenedURLs.model.js";
import { incrementUsesCounter } from "../repository/shortened-urls.repository.js";
import { CreateShortenedURLRequest, RedirectToRequest } from "../schema/url.schema.js";

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
  const item = await URLRequestToModel(data);

  // generate a unique identifier for the url
  item.shortenedId = await shortenedIdGenerator;

  // register the url's information on database
  await item.save();

  return { shortenedUrl: `http://localhost:3000/${item.shortenedId}` };
};

/**
 * Gets the information needed to redirect the user at the URL
 * @param {RedirectToRequest} data data to access the URL
 * @returns {Promise<string>} a promise that will be resolve with the real URL
 */
export const getRedirectToInfo = async (data: RedirectToRequest): Promise<string> => {
  const url = await URLModel.get(data.shortenedId);
  if (!url) {
    throw new CheckError("ShortenedId not found.");
  }

  // if the url needs password and the user not send it, I redirect it to a page with a text box to insert the password
  if (url.password && !data.password) {
    throw new AuthenticationError("URL requires a password.");
  }

  // check if the url can be used
  const usable = await canBeUsed(url, data.password);
  if (!usable) {
    throw new Error();
  }

  // increment the uses counter
  await incrementUsesCounter(url);

  return url.url;
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

/**
 * Checks if the url can be used
 * @param {URLItem} url url object to check
 * @param {string | undefined} password user's password
 * @throws {CheckError} if the URL is expired or it has reached the uses limit
 * @throws {AuthenticationError} if the URL requires a password and the provided password is empty or wrong
 * @returns {Promise<boolean>} a promise that will be resolve with a boolean value, `true` if the URL can be used, `false` otherwise
 */
const canBeUsed = async (url: URLItem, password?: string): Promise<boolean> => {
  // check if is temporal valid
  const { minDateError, maxDateError } = DateHelper.isBetween(
    new Date(),
    url.validFrom,
    url.validTo,
    true,
  );

  // check if the min date has an error
  if (minDateError) {
    throw new CheckError("This URL is not active yet.");
  }

  // check if the max date has an error
  if (maxDateError) {
    throw new CheckError("This URL has expired.");
  }

  // check if the uses limit is already reached
  if (url.maxUses && url.currentUses >= url.maxUses) {
    throw new CheckError("This URL has reached its usage limit.");
  }

  // check the password
  if (url.password) {
    if (!password) {
      throw new AuthenticationError("This URL requires a password.");
    }

    const isEquals = await comparePassword(password, url.password);
    if (!isEquals) {
      throw new AuthenticationError("The provided password is incorrect.");
    }
  }

  return true;
};
