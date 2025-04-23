import { NextFunction, Request, Response } from "express";
import {
  CreateShortenedURLRequest,
  CreateShortenedURLRequestSchema,
  RedirectToRequest,
  RedirectToRequestSchema,
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
    const request: CreateShortenedURLRequest = await CreateShortenedURLRequestSchema.parseAsync(
      req.body,
    );
    req.body = request;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to validate request body for the `redirectTo` controller (url.controller.ts)
 * @param {Request} req request
 * @param {Response} _ response
 * @param {NextFunction} next next function
 * @returns {Promise<void>}
 */
export const validateRedirectToRequest = async (
  req: Request,
  _: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const request: RedirectToRequest = await RedirectToRequestSchema.parseAsync({
      ...req.body,
      shortenedId: req.params.shortenedId,
    });
    req.body = request;
    next();
  } catch (error) {
    next(error);
  }
};
