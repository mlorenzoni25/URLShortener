import HTTPError from "./http.exception";

class ValidationError extends HTTPError {
  /**
   * Field with error
   */
  protected _field: string = "";

  /**
   * Constructor
   * @param {string} field field name with error
   * @param {string | string[]} responseMessages error messages (sent to client)
   * @param {string | string[]} debuggerMessages error messages (debug internal use)
   */
  constructor(
      field: string,
      responseMessages: string | string[] = [],
      debuggerMessages: string | string[] = [],
  ) {
    // invoke the super class's constructor
    super(`Validation failed for param "${field}"`, 400, responseMessages, debuggerMessages);
    // set instance fields
    this._field = field;
    // keep the right stack trace for debugging reason
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Gets the field name
   * @returns {string}
   */
  get field(): string {
    return this._field;
  }
}

export default ValidationError;
