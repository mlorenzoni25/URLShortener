import { NextFunction, Request, Response } from "express";
import {
  CreateShortenedURLRequest,
  CreateShortenedURLRequestSchema,
} from "../schema/url.schema.js";

/**
 * Middleware to validate request body for the `shortenURL` controller (url.controller.ts)
 * @param {Request} req request
 * @param {Response} _ response
 * @param {NextFunction} next next function
 * @returns {Promise<void>}
 */
export const validateCreateShortenedURLRequest = async (
  req: Request,
  _: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const url: CreateShortenedURLRequest = await CreateShortenedURLRequestSchema.parseAsync(
      req.body,
    );
    req.body = url;
    next();
  } catch (error) {
    next(error);
  }
};
