import HTTPError from "./http.exception.js";

class AuthenticationError extends HTTPError {
  /**
   * Constructor
   * @param {string | string[]} responseMessages error messages (sent to client)
   * @param {string | string[]} debuggerMessages error messages (debug internal use)
   */
  constructor(responseMessages: string | string[] = [], debuggerMessages: string | string[] = []) {
    // invoke the super class's constructor
    super("Authentication failed.", 401, responseMessages, debuggerMessages);
    // keep the right stack trace for debugging reason
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AuthenticationError;
