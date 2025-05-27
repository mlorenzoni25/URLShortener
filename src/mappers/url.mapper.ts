import { generateHashedPassword } from "../helpers/security.helper.js";
import { URLItem, URLModel } from "../models/shortenedURLs.model.js";
import { CreateShortenedURLRequest } from "../schema/url.schema.js";

/**
 * Transforms the request object into model object
 * @param {CreateShortenedURLRequest} request url info
 * @returns {Promise<URLItem>} instance for the urls table's model
 */
export const URLRequestToModel = async (request: CreateShortenedURLRequest): Promise<URLItem> => {
  return new URLModel({
    shortenedId: "",
    alias: request.alias,
    currentUses: 0,
    maxUses: request.maxUses,
    password: request.password ? await generateHashedPassword(request.password) : "",
    url: request.url,
    validFrom: request.validFrom,
    validTo: request.validTo,
  });
};
