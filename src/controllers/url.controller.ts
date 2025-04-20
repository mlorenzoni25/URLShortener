import { NextFunction, Request, Response } from "express";
import { createDataResponse } from "../helpers/http.helper.js";
import { createShortenedURL } from "../services/url.service.js";

/**
 * Create a shortened URL
 * @param {Request} req request
 * @param {Response} res response
 * @param {NextFunction} next next function to invoke
 * @returns {Promise<void>}
 */
export const shortenURL = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const response = await createShortenedURL(req.body);
    res.status(200).json(createDataResponse(response));
  } catch (error) {
    next(error);
  }
};
