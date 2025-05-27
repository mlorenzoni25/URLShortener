import { NextFunction, Request, Response } from "express";
import { createBaseResponse, createDataResponse } from "../helpers/http.helper.js";
import * as UserService from "../services/user.service.js";

/**
 * Controller for /register route
 * @param {Request} req request
 * @param {Response} res response
 * @param {NextFunction} next next function to invoke
 * @returns {Promise<void>}
 */
export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const response = await UserService.registerUser(req.body);
    res.status(200).json(createDataResponse(response));
  } catch (error) {
    next(error);
  }
};

/**
 * Controller for /login route
 * @param {Request} req request
 * @param {Response} res response
 * @param {NextFunction} next next function
 * @returns {Promise<void>}
 */
export const loginUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { accessToken, refreshToken } = await UserService.loginUser(req, req.body);
    setCookieForTokens(res, accessToken, refreshToken);
    res.status(200).json(createBaseResponse());
  } catch (error) {
    next(error);
  }
};

/**
 * Controller for /refresh route
 * @param {Request} req request
 * @param {Response} res response
 * @param {NextFunction} next next function
 * @returns {Promise<void>}
 */
export const refreshUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { accessToken, refreshToken } = await UserService.refreshUser(req, {
      user: req.body.__user,
    });
    setCookieForTokens(res, accessToken, refreshToken);
    res.status(200).json(createBaseResponse());
  } catch (error) {
    next(error);
  }
};

/**
 * Sets the headers to send to client to set the token's cookies
 * @param {Response} res response
 * @param {string} accessToken access token
 * @param {string} refreshToken refresh token
 * @returns {void}
 */
const setCookieForTokens = (res: Response, accessToken: string, refreshToken: string): void => {
  res
    .cookie("accessToken", accessToken, { httpOnly: true, sameSite: "strict" })
    .cookie("refreshToken", refreshToken, { httpOnly: true, sameSite: "strict" });
};
