import HTTPError from "./http.exception.js";

class CheckError extends HTTPError {
  /**
   * Constructor
   * @param {string | string[]} responseMessages error messages (sent to client)
   * @param {string | string[]} debuggerMessages error messages (debug internal use)
   * @param {number} statusCode HTTP status code
   */
  constructor(
    responseMessages: string | string[] = [],
    debuggerMessages: string | string[] = [],
    statusCode: number = 400,
  ) {
    // invoke the super class's constructor
    super("Check failed.", statusCode, responseMessages, debuggerMessages);
    // keep the right stack trace for debugging reason
    Error.captureStackTrace(this, this.constructor);
  }
}

export default CheckError;
