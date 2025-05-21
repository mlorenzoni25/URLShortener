/* eslint-disable no-console */
import { Algorithm } from "jsonwebtoken";
import type { StringValue } from "ms";
import constants from "node:constants";
import { accessSync, existsSync, readFileSync } from "node:fs";
import { JWT } from "../constants.js";
import CheckError from "../exception/check.exception.js";
import { isBetween } from "../helpers/number.helper.js";
import { Config, ConfigParser, Environment } from "../models/config.model.js";
import { Secret } from "../models/secret.model.js";

type ParseOptions = {
  defaultValue?: number | string;
};

type ParseNumberOptions = ParseOptions & {
  defaultValue?: number;
  minValue?: number;
  maxValue?: number;
};

type ParseFileOptions = ParseOptions & {
  defaultValue?: string;
  secret: boolean;
};

/**
 * Callback to parse optional values
 * @param {string} name param's name
 * @param {string | undefined} value param's value
 * @param {ParseNumberOptions | undefined} options parsing options
 * @returns {string} parsed value or default
 */
const parse = (name: string, value?: string, options?: ParseOptions): unknown => {
  if (!value) {
    console.warn(
      `Cannot parse "${name}" param: value is empty. Will be used default value (${options?.defaultValue || undefined})`,
    );
    return options?.defaultValue || undefined;
  }

  return value;
};

/**
 * Callback to parse required values
 * @param {string} name param's name
 * @param {string | undefined} value param's value
 * @param {ParseNumberOptions | undefined} options parsing options
 * @throws {CheckError} if value is empty
 * @returns {string} parsed value
 */
const parseRequired = (name: string, value?: string): unknown => {
  if (!value) {
    throw new CheckError(`Param "${name}" is required and cannot be empty.`);
  }

  return value;
};

/**
 * Callback to parse numeric values
 * @param {string} name param's name
 * @param {string | undefined} value param's value
 * @param {ParseNumberOptions | undefined} options parsing options
 * @throws {CheckError} if param is required and the value is empty
 * @returns {number} parsed value or default
 */
const parseNumber = (name: string, value?: string, options?: ParseNumberOptions): number => {
  // extract the options
  const { defaultValue = null, minValue, maxValue } = options || {};

  // parse the value into a number to check if it has a valid value
  const parsed = Number(value);
  if (isNaN(parsed)) {
    if (!defaultValue) {
      throw new CheckError(`Param "${name}" is required and cannot be empty.`);
    }
    console.warn(`Cannot parse "${name}" param, will be used default value (${defaultValue})`);
    return defaultValue;
  }

  // check if the value is in the interval
  if (!isBetween(parsed, minValue, maxValue, true)) {
    if (!defaultValue) {
      throw new CheckError(`Param "${name}" is required and cannot be empty.`);
    }
    return defaultValue;
  }

  return parsed;
};

/**
 * Callback to parse file values
 * @param {string} name param's name
 * @param {string | undefined} value param's value
 * @param {ParseNumberOptions | undefined} options parsing options
 * @throws {CheckError} if param is required and the value is empty
 * @returns {Secret | string} parsed value or default
 */
const parseFile = (name: string, value?: string, options?: ParseFileOptions): Secret | string => {
  // path to read
  let path = options?.defaultValue;

  // if empty use default value
  if (!value) {
    console.warn(
      `Cannot parse "${name}" param: value is empty. Will be used the default value (content of file ${options?.defaultValue})`,
    );
  } else if (!existsSync(value)) {
    // if file not exists use default value
    console.warn(
      `Cannot parse "${name}" param: path not exists. Will be used default value (content of file ${options?.defaultValue})`,
    );
  } else {
    path = value;
  }

  // if file isn't readable use default value
  try {
    accessSync(path as string, constants.R_OK);
  } catch {
    console.warn(
      `Cannot parse "${name}" param: path is not readable. Will be used default value (content of file ${options?.defaultValue})`,
    );
    return readFileSync(options?.defaultValue as string).toString();
  }

  // read the content and transform it into a string
  const strContent = readFileSync(path as string).toString();

  // return content as a secret
  if (options?.secret) {
    return new Secret(strContent);
  }

  return strContent;
};

// default application's config
const configParser: ConfigParser = {
  /**
   * Parse the config's param `environment`
   * @param {string} name param's name
   * @param {string | undefined} value param's value
   * @returns {Environment} parsed param's value
   */
  environment: (name: string, value?: string): Environment => {
    // if empty use default value
    if (!value || !Object.values(Environment).includes(value as Environment)) {
      console.warn(
        `Cannot parse "${name}" param, will be used default value (${Environment.PRODUCTION})`,
      );
      return Environment.PRODUCTION;
    }

    return value as Environment;
  },
  /**
   * Parse the config's param `host`
   * @param {string} name param's name
   * @param {string | undefined} value param's value
   * @returns {string} parsed param's value
   */
  host: (name: string, value?: string): string =>
    parse(name, value, { defaultValue: "127.0.0.1" }) as string,
  /**
   * Parse the config's param `port`
   * @param {string} name param's name
   * @param {string | undefined} value param's value
   * @returns {number} parsed param's value
   */
  port: (name: string, value?: string): number =>
    parseNumber(name, value, { defaultValue: 3000, minValue: 0, maxValue: 65536 }),
  /**
   * Parse the config's param `awsProfile`
   * @param {string} name param's name
   * @param {string | undefined} value param's value
   * @throws {CheckError} if value is empty
   * @returns {string} parsed param's value
   */
  awsProfile: (name: string, value?: string): string => parseRequired(name, value) as string,
  /**
   * Parse the config's param `awsRegion`
   * @param {string} name param's name
   * @param {string | undefined} value param's value
   * @throws {CheckError} if value is empty
   * @returns {string} parsed param's value
   */
  awsRegion: (name: string, value?: string): string => parseRequired(name, value) as string,
  /**
   * Parse the config's param `jwtAlgorithm`
   * @param {string} name param's name
   * @param {string | undefined} value param's value
   * @returns {Algorithm} parsed param's value
   */
  jwtAlgorithm: (name: string, value?: string): Algorithm => {
    // if empty use default value
    if (!value || !JWT.ALGORITHMS.includes(value)) {
      console.warn(`Cannot parse "${name}" param, will be used default value (ES256)`);
      return "ES256";
    }
    return value as Algorithm;
  },
  /**
   * Parse the config's param `jwtAccessExpiry`
   * @param {string} name param's name
   * @param {string | undefined} value param's value
   * @returns {number | StringValue} parsed param's value
   */
  jwtAccessExpiry: (name: string, value?: string): number | StringValue => {
    // if empty use default value
    if (!value) {
      console.warn(`Cannot parse "${name}" param, will be used default value (15minutes)`);
      return "15minutes";
    }
    const numericValue = Number(value);
    if (!isNaN(numericValue)) {
      return numericValue;
    }
    return value as StringValue;
  },
  /**
   * Parse the config's param `jwtRefreshExpiry`
   * @param {string} name param's name
   * @param {string | undefined} value param's value
   * @returns {number | StringValue} parsed param's value
   */
  jwtRefreshExpiry: (name: string, value?: string): number | StringValue => {
    // if empty use default value
    if (!value) {
      console.warn(`Cannot parse "${name}" param, will be used default value (1day)`);
      return "1day";
    }
    const numericValue = Number(value);
    if (!isNaN(numericValue)) {
      return numericValue;
    }
    return value as StringValue;
  },
  /**
   * Parse the config's param `jwtPublicKey`
   * @param {string} name param's name
   * @param {string | undefined} value param's value
   * @returns {Secret} parsed param's value
   */
  jwtPublicKey: (name: string, value?: string): Secret =>
    parseFile(name, value, { defaultValue: "./config/keys/public.pem", secret: true }) as Secret,
  /**
   * Parse the config's param `jwtPrivateKey`
   * @param {string} name param's name
   * @param {string | undefined} value param's value
   * @returns {string} parsed param's value
   */
  jwtPrivateKey: (name: string, value?: string): Secret =>
    parseFile(name, value, { defaultValue: "./config/keys/private.pem", secret: true }) as Secret,
  /**
   * Parse the config's param `redisHost`
   * @param {string} name param's name
   * @param {string | undefined} value param's value
   * @throws {CheckError} if value is empty
   * @returns {string} parsed param's value
   */
  redisHost: (name: string, value?: string): string =>
    parse(name, value, { defaultValue: "127.0.0.1" }) as string,
  /**
   * Parse the config's param `redisPort`
   * @param {string} name param's name
   * @param {string | undefined} value param's value
   * @returns {number} parsed param's value
   */
  redisPort: (name: string, value?: string): number =>
    parseNumber(name, value, { defaultValue: 6379, minValue: 0, maxValue: 65536 }),
  /**
   * Parse the config's param `redisUser`
   * @param {string} name param's name
   * @param {string | undefined} value param's value
   * @returns {string | undefined} parsed param's value
   */
  redisUser: (name: string, value?: string): string | undefined =>
    parse(name, value, { defaultValue: undefined }) as string | undefined,
  /**
   * Parse the config's param `redisPassword`
   * @param {string} name param's name
   * @param {string | undefined} value param's value
   * @returns {Secret} parsed param's value
   */
  redisPassword: (name: string, value?: string): Secret =>
    new Secret(parse(name, value, { defaultValue: undefined }) as string),
  /**
   * Parse the config's param `urlsPerDay`
   * @param {string} name param's name
   * @param {string | undefined} value param's value
   * @returns {number} parsed param's value
   */
  urlsPerDay: (name: string, value?: string): number =>
    parseNumber(name, value, { defaultValue: 5, minValue: 0 }),
  /**
   * Parse the config's param `urlsPerDayLogged`
   * @param {string} name param's name
   * @param {string | undefined} value param's value
   * @returns {number} parsed param's value
   */
  urlsPerDayLogged: (name: string, value?: string): number =>
    parseNumber(name, value, { defaultValue: 20, minValue: 0 }),
};

// application's config
export const config: Config = {
  // environment
  environment: configParser.environment("ENVIRONMENT", process.env.ENVIRONMENT),
  // server
  host: configParser.host("HOST", process.env.HOST),
  port: configParser.port("PORT", process.env.PORT),
  // aws
  awsProfile: configParser.awsProfile("AWS_PROFILE", process.env.AWS_PROFILE),
  awsRegion: configParser.awsRegion("AWS_REGION", process.env.AWS_REGION),
  // jwt
  jwtAlgorithm: configParser.jwtAlgorithm("JWT_ALGORITHM", process.env.JWT_ALGORITHM),
  jwtAccessExpiry: configParser.jwtAccessExpiry("JWT_ACCESS_EXPIRY", process.env.JWT_ACCESS_EXPIRY),
  jwtRefreshExpiry: configParser.jwtRefreshExpiry(
    "JWT_REFRESH_EXPIRY",
    process.env.JWT_REFRESH_EXPIRY,
  ),
  jwtPublicKey: configParser.jwtPublicKey("JWT_PUBLIC_KEY_PATH", process.env.JWT_PUBLIC_KEY_PATH),
  jwtPrivateKey: configParser.jwtPrivateKey(
    "JWT_PRIVATE_KEY_PATH",
    process.env.JWT_PRIVATE_KEY_PATH,
  ),
  // redis
  redisHost: configParser.redisHost("REDIS_HOST", process.env.REDIS_HOST),
  redisPort: configParser.redisPort("REDIS_PORT", process.env.REDIS_PORT),
  redisUser: configParser.redisUser("REDIS_USER", process.env.REDIS_USER),
  redisPassword: configParser.redisPassword("REDIS_PASSWORD", process.env.REDIS_PASSWORD),
  // urls
  urlsPerDay: configParser.urlsPerDay("URLS_PER_DAY", process.env.URLS_PER_DAY),
  urlsPerDayLogged: configParser.urlsPerDayLogged(
    "URLS_PER_DAY_LOGGED",
    process.env.URLS_PER_DAY_LOGGED,
  ),
};

/**
 * Gets a boolean flag for production environment
 * @returns {boolean} `true` if is a production environment, `false` otherwise
 */
export const isProduction = (): boolean =>
  [Environment.PROD, Environment.PRODUCTION].includes(config.environment);

/**
 * Gets a boolean flag for test environment
 * @returns {boolean} `true` if is a test environment, `false` otherwise
 */
export const isTest = (): boolean => config.environment === Environment.TEST;
