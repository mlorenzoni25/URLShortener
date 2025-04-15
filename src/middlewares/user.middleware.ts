import { NextFunction, Request, Response } from "express";
import { RegisterUserRequest, RegisterUserRequestSchema } from "../schema/user.schema.js";

/**
 * Middleware to validate request body for the `registerUser` controller (user.controller.ts)
 * @param {Request} req request
 * @param {Response} _ response
 * @param {NextFunction} next next function to invoke
 * @returns {Promise<void>}
 */
export const validateRegisterUserRequest = async (
  req: Request,
  _: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const request: RegisterUserRequest = await RegisterUserRequestSchema.parseAsync(req.body);
    req.body = request;
    next();
  } catch (error) {
    next(error);
  }
};
