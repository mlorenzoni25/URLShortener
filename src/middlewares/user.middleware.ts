import { NextFunction, Request, Response } from "express";
import {
  LoginRequest,
  LoginRequestSchema,
  RegisterUserRequest,
  RegisterUserRequestSchema,
} from "../schema/user.schema.js";

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

/**
 * Middleware to validate request body for the `login` controller (user.controller.ts)
 * @param {Request} req request
 * @param {Response} _ response
 * @param {NextFunction} next next function
 * @returns {Promise<void>}
 */
export const validateLoginRequest = async (
  req: Request,
  _: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const request: LoginRequest = LoginRequestSchema.parse(req.body);
    req.body = request;
    next();
  } catch (error) {
    next(error);
  }
};
