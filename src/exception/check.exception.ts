import HTTPError from "./http.exception.js";

class CheckError extends HTTPError {
  /**
   * Constructor
   * @param {string | string[]} responseMessages error messages (sent to client)
   * @param {string | string[]} debuggerMessages error messages (debug internal use)
   */
  constructor(responseMessages: string | string[] = [], debuggerMessages: string | string[] = []) {
    // invoke the super class's constructor
    super("Check failed.", 400, responseMessages, debuggerMessages);
    // keep the right stack trace for debugging reason
    Error.captureStackTrace(this, this.constructor);
  }
}

export default CheckError;
