import { NextFunction, Request, Response } from "express";
import { ErrorBaseResponse } from "../models/response.model.js";

/**
 * Error handler middleware
 * @param {Error} err exception
 * @param {Request} req request
 * @param {Response} res response
 * @param {NextFunction} __ next function to invoke
 * @returns {void}
 */
const errorHandler = (err: Error, req: Request, res: Response, __: NextFunction): void => {
  // default errror response
  const response: ErrorBaseResponse = {
    status: false,
    error: {
      code: 500,
      messages: ["Generic error"],
    },
  };

  // log the error
  req.log.error(err);

  // send response to the client
  res.status(response.error.code).json(response);
};

export default errorHandler;
