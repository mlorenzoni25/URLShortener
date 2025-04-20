import { URLItem, URLModel } from "../models/shortenedURLs.model.js";
import { CreateShortenedURLRequest } from "../schema/url.schema.js";

/**
 * Transforms the request object into model object
 * @param {CreateShortenedURLRequest} request url info
 * @returns {URLItem} instance for the urls table's model
 */
export const URLRequestToModel = (request: CreateShortenedURLRequest): URLItem => {
  return new URLModel({
    shortenedId: "",
    alias: request.alias,
    currentUses: 0,
    maxUses: request.maxUses,
    password: request.password,
    url: request.url,
    validFrom: request.validFrom,
    validTo: request.validTo,
  });
};
