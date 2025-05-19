import util from "util";

export class Secret {
  /**
   * Secret content
   */
  public readonly value: string | undefined;

  /**
   * Constructor
   * @param {string} value secret
   * @returns {Readonly<Secret>} an instance in readonly mode of this class
   */
  constructor(value: string | undefined) {
    this.value = value;
    return Object.freeze(this);
  }

  toString(): string {
    return "**********";
  }

  [util.inspect.custom](): string {
    return this.toString();
  }
}
