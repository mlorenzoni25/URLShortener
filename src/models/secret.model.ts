import util from "util";

export class Secret {
  /**
   * Secret content
   */
  public readonly value: string = "";

  /**
   * Constructor
   * @param {string} value secret
   * @returns {Readonly<Secret>} an instance in readonly mode of this class
   */
  constructor(value: string) {
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
