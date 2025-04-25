/* eslint-disable no-console */
import { Algorithm } from "jsonwebtoken";
import type { StringValue } from "ms";
import constants from "node:constants";
import { accessSync, existsSync, readFileSync } from "node:fs";
import CheckError from "../exception/check.exception.js";
import { Config, ConfigParser, Environment } from "../models/config.model.js";

const JWT_ALGORITHMS: string[] = [
  "HS256",
  "HS384",
  "HS512",
  "RS256",
  "RS384",
  "RS512",
  "ES256",
  "ES384",
  "ES512",
  "PS256",
  "PS384",
  "PS512",
];

// default application's config
const configParser: ConfigParser = {
  /**
   * Parse the config's param `environment`
   * @param {string} name param's name
   * @param {string | undefined} value param's value
   * @returns { } parsed param's value
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
   * Parse the config's param `port`
   * @param {string} name param's name
   * @param {string | undefined} value param's value
   * @returns {number} parsed param's value
   */
  port: (name: string, value?: string): number => {
    const parsed = Number(value);
    if (isNaN(parsed) || parsed < 0 || parsed > 65536) {
      console.warn(`Cannot parse "${name}" param, will be used default value (3000)`);
      return 3000;
    }
    return parsed;
  },
  /**
   * Parse the config's param `awsProfile`
   * @param {string} name param's name
   * @param {string | undefined} value param's value
   * @throws {CheckError} if value is empty
   * @returns {string} parsed param's value
   */
  awsProfile: (name: string, value?: string): string => {
    // if empty generate an exception
    if (!value) {
      throw new CheckError(`Param "${name}" is required and cannot be empty.`);
    }
    return value;
  },
  /**
   * Parse the config's param `awsRegion`
   * @param {string} name param's name
   * @param {string | undefined} value param's value
   * @throws {CheckError} if value is empty
   * @returns {string} parsed param's value
   */
  awsRegion: (name: string, value?: string): string => {
    // if empty generate an exception
    if (!value) {
      throw new CheckError(`Param "${name}" is required and cannot be empty.`);
    }
    return value;
  },
  /**
   * Parse the config's param `jwtAlgorithm`
   * @param {string} name param's name
   * @param {string | undefined} value param's value
   * @returns {Algorithm} parsed param's value
   */
  jwtAlgorithm: (name: string, value?: string): Algorithm => {
    // if empty use default value
    if (!value || !JWT_ALGORITHMS.includes(value)) {
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
   * @returns {string} parsed param's value
   */
  jwtPublicKey: (name: string, value?: string): string => {
    const defaultValue = "./config/keys/public.pem";

    // if empty use default value
    if (!value) {
      console.warn(
        `Cannot parse "${name}" param: value is empty. Will be used the default value (content of file ${defaultValue})`,
      );
      return readFileSync(defaultValue).toString();
    }

    // if file not exists use default value
    if (!existsSync(value)) {
      console.warn(
        `Cannot parse "${name}" param: path not exists. Will be used default value (content of file ${defaultValue})`,
      );
      return readFileSync(defaultValue).toString();
    }

    // if file isn't readable use default value
    try {
      accessSync(value, constants.R_OK);
    } catch {
      console.warn(
        `Cannot parse "${name}" param: path is not readable. Will be used default value (content of file ${defaultValue})`,
      );
      return readFileSync(defaultValue).toString();
    }

    return readFileSync(defaultValue).toString();
  },
  /**
   * Parse the config's param `jwtPrivateKey`
   * @param {string} name param's name
   * @param {string | undefined} value param's value
   * @returns {string} parsed param's value
   */
  jwtPrivateKey: (name: string, value?: string): string => {
    const defaultValue = "./config/keys/private.pem";

    // if empty use default value
    if (!value) {
      console.warn(
        `Cannot parse "${name}" param: value is empty. Will be used the default value (content of file ${defaultValue})`,
      );
      return readFileSync(defaultValue).toString();
    }

    // if file not exists use default value
    if (!existsSync(value)) {
      console.warn(
        `Cannot parse "${name}" param: path not exists. Will be used default value (content of file ${defaultValue})`,
      );
      return readFileSync(defaultValue).toString();
    }

    // if file isn't readable use default value
    try {
      accessSync(value, constants.R_OK);
    } catch {
      console.warn(
        `Cannot parse "${name}" param: path is not readable. Will be used default value (content of file ${defaultValue})`,
      );
      return readFileSync(defaultValue).toString();
    }

    return readFileSync(defaultValue).toString();
  },
  /**
   * Parse the config's param `redisHost`
   * @param {string} name param's name
   * @param {string | undefined} value param's value
   * @throws {CheckError} if value is empty
   * @returns {string} parsed param's value
   */
  redisHost: (name: string, value?: string): string => {
    // if empty generate an exception
    if (!value) {
      throw new CheckError(`Param "${name}" is required and cannot be empty.`);
    }
    return value;
  },
  /**
   * Parse the config's param `redisPort`
   * @param {string} name param's name
   * @param {string | undefined} value param's value
   * @returns {number} parsed param's value
   */
  redisPort: (name: string, value?: string): number => {
    const parsed = Number(value);
    if (isNaN(parsed) || parsed < 0 || parsed > 65536) {
      console.warn(`Cannot parse "${name}" param, will be used default value (3000)`);
      return 6379;
    }
    return parsed;
  },
  /**
   * Parse the config's param `redisPassword`
   * @param {string} name param's name
   * @param {string | undefined} value param's value
   * @throws {CheckError} if value is empty
   * @returns {string} parsed param's value
   */
  redisPassword: (name: string, value?: string): string => {
    // if empty generate an exception
    if (!value) {
      throw new CheckError(`Param "${name}" is required and cannot be empty.`);
    }
    return value;
  },
};

// application's config
export const config: Config = {
  // environment
  environment: configParser.environment("ENVIRONMENT", process.env.ENVIRONMENT),
  // server
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
  redisPassword: configParser.redisPassword("REDIS_PASSWORD", process.env.REDIS_PASSWORD),
};

/**
 * Gets a boolean flag for production environment
 * @returns {boolean} `true` if is a production environment, `false` otherwise
 */
export const isProduction = (): boolean =>
  [Environment.PROD, Environment.PRODUCTION].includes(config.environment);
