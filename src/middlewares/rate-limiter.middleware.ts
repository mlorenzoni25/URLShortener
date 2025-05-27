import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/app.conf.js";
import AuthenticationError from "../exception/authentication.exception.js";
import CheckError from "../exception/check.exception.js";
import { todayISO } from "../helpers/date.helper.js";
import { verifyJWT } from "../helpers/security.helper.js";
import redis from "../redis.js";

interface RateLimitInfo {
  key: string;
  limit: number;
}

/**
 * Middleware to limit requests number
 * @param {Request} req request
 * @param {Response} _ response
 * @param {NextFunction} next next function
 * @returns {Promise<void>}
 */
export const rateLimiter = async (req: Request, _: Response, next: NextFunction): Promise<void> => {
  // get limit info (key and limit)
  const { key, limit } = req.headers["authorization"]
    ? getLimitInfoForAuthenticatedUser(req)
    : getLimitInfoForUnauthenticatedUser(req);

  // get the request count from redis
  const currentValue = Number(await redis.get(key));

  // if isn't a numeric value or is 0, set the expiry date
  if (isNaN(currentValue) || currentValue === 0) {
    redis.expire(key, 86400);
  }

  // if the limit is reached throw an exception
  if (!isNaN(currentValue) && currentValue >= limit) {
    throw new CheckError("Daily limit reached.", [], 429);
  }

  // `incr` method set the value to zero if not exists and increment it by one
  await redis.incr(key);

  next();
};

/**
 * Gets the limit info for authenticated users
 * @param {Request} req request
 * @throws {AuthenticationError} if the user's jwt token is expired
 * @returns {RateLimitInfo} an object with `key` e `limit` options
 */
const getLimitInfoForAuthenticatedUser = (req: Request): RateLimitInfo => {
  let payload: string | jwt.JwtPayload;
  try {
    payload = verifyJWT(req.headers["authorization"] as string) as jwt.JwtPayload;
  } catch (err) {
    throw new AuthenticationError([], [(err as Error).toString()]);
  }

  const userId = payload["sub"];

  return {
    key: `ratelimit:ip:${userId}:${todayISO(false)}`,
    limit: config.urlsPerDayLogged,
  };
};

/**
 * Gets the limit info for unauthenticated users
 * @param {Request} req request
 * @returns {RateLimitInfo} an object with `key` e `limit` options
 */
const getLimitInfoForUnauthenticatedUser = (req: Request): RateLimitInfo => {
  return {
    key: `ratelimit:ip:${req.ip}:${todayISO(false)}`,
    limit: config.urlsPerDay,
  };
};
