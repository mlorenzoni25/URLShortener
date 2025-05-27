class HTTPError extends Error {
  /**
   * HTTP status code to send to the client when this exception is triggered
   */
  private _statusCode: number = 500;

  /**
   * Response's error messages
   */
  protected _responseMessages: string[] = [];

  /**
   * Debugger's error messages
   */
  protected _debuggerMessages: string[] = [];

  /**
   * Constructor
   * @param {string} message exception message
   * @param {number} statusCode HTTP status code
   * @param {string | string[]} responseMessages error messages (sent to client)
   * @param {string | string[]} debuggerMessages error messages (debug internal use)
   */
  constructor(
    message: string,
    statusCode: number = 500,
    responseMessages: string | string[] = [],
    debuggerMessages: string | string[] = [],
  ) {
    super(message);

    this._statusCode = statusCode;
    this._responseMessages =
      typeof responseMessages === "string" ? [responseMessages] : responseMessages;
    this._debuggerMessages =
      typeof debuggerMessages === "string" ? [debuggerMessages] : debuggerMessages;

    // keep the right stack trace for debugging reason
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Gets the HTTP status code
   * @returns {number} current HTTP status code value
   */
  get statusCode(): number {
    return this._statusCode;
  }

  /**
   * Sets the HTTP status code
   * @param {number} statusCode new HTTP status code value
   * @returns {void}
   */
  set statusCode(statusCode: number) {
    this._statusCode = statusCode;
  }

  /**
   * Gets the response's error messages
   * @returns {string[]}
   */
  get responseErrorMessages(): string[] {
    return this._responseMessages;
  }

  /**
   * Gets the debug's error messages
   * @returns {string[]}
   */
  get debugErrorMessages(): string[] {
    return this._debuggerMessages;
  }
}

export default HTTPError;
