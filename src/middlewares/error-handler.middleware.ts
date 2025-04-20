import { NextFunction, Request, Response } from "express";
import HTTPError from "../exception/http.exception.js";
import ValidationError from "../exception/validation.exception.js";
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

  // handle custom exceptions
  if (err instanceof HTTPError) {
    response.error.code = err.statusCode;
    response.error.messages = err.responseErrorMessages;

    // if it is a `ValidationError` class, set the relative field into the response
    if (err instanceof ValidationError) {
      response.error.field = err.field;
    }

    // if there are debug message I print them
    if (err.debugErrorMessages && err.debugErrorMessages.length) {
      err.debugErrorMessages.forEach((debugErrorMessage) => {
        req.log.debug(debugErrorMessage);
      });
    }
  }

  // log the error
  req.log.error(err);

  // send response to the client
  res.status(response.error.code).json(response);
};

export default errorHandler;
