import { NextFunction, Request, Response } from "express";
import { createDataResponse } from "../helpers/http.helper.js";
import * as UserService from "../services/user.service.js";

/**
 * Create a new user
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
