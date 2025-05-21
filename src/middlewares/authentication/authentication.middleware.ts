import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../../config/app.conf.js";
import AuthenticationError from "../../exception/authentication.exception.js";
import { cleanAuthToken, verifyJWT } from "../../helpers/security.helper.js";

/**
 * Middleware to check if the user is logged
 * @param {Request} req request
 * @param {Response} _ response
 * @param {NextFunction} next next function
 * @returns {Promise<void>}
 */
export const authenticated = async (
  req: Request,
  _: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // check if there is a token in request's headers
    if (!req.headers["authorization"]) {
      throw new AuthenticationError([], "Access token not found.");
    }

    // verify a token
    try {
      if (!req.body) {
        req.body = {};
      }
      req.body.__user = verifyJWT(req.headers["authorization"]);
    } catch (err) {
      throw new AuthenticationError([], [(err as Error).toString()]);
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to check if the user can refresh the access token
 * @param {Request} req request
 * @param {Response} _ response
 * @param {NextFunction} next next function
 * @returns {Promise<void>}
 */
export const refreshable = async (req: Request, _: Response, next: NextFunction): Promise<void> => {
  try {
    // check if there is a token in request's headers
    if (!req.cookies["refreshToken"]) {
      throw new AuthenticationError([], "Refresh token not found.");
    }

    // remove the bearer prefix
    const refreshToken = cleanAuthToken(req.cookies["refreshToken"], "Bearer");

    // verify a token
    try {
      if (!req.body) {
        req.body = {};
      }
      req.body.__user = jwt.verify(refreshToken, config.jwtPublicKey.value);
    } catch (err) {
      throw new AuthenticationError([], [(err as Error).toString()]);
    }

    next();
  } catch (error) {
    next(error);
  }
};
