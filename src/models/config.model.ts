import { Algorithm } from "jsonwebtoken";
import type { StringValue } from "ms";

// enumerates application's environments
export enum Environment {
  // eslint-disable-next-line no-unused-vars
  DEV = "dev",
  // eslint-disable-next-line no-unused-vars
  DEVELOPMENT = "development",
  // eslint-disable-next-line no-unused-vars
  TEST = "test",
  // eslint-disable-next-line no-unused-vars
  PREPROD = "preprod",
  // eslint-disable-next-line no-unused-vars
  PREPRODUCTION = "preproduction",
  // eslint-disable-next-line no-unused-vars
  PROD = "prod",
  // eslint-disable-next-line no-unused-vars
  PRODUCTION = "production",
}

// application's config
export type Config = {
  /**
   * Current environment
   */
  environment: Environment;
  /**
   * Server port
   */
  port: number;
  /**
   * AWS profile
   */
  awsProfile: string;
  /**
   * AWS region
   */
  awsRegion: string;
  /**
   * JWT algorithm
   */
  jwtAlgorithm: Algorithm | undefined;
  /**
   * JWT access token expiry
   */
  jwtAccessExpiry: number | StringValue;
  /**
   * JWT refresh token expiry
   */
  jwtRefreshExpiry: number | StringValue;
  /**
   * JWT public key
   */
  jwtPublicKey: string;
  /**
   * JWT private key
   */
  jwtPrivateKey: string;
  /**
   * Host to access Redis DB
   */
  redisHost: string;
  /**
   * Port to access Redis DB
   */
  redisPort: number;
  /**
   * Password to access Redis DB
   */
  redisPassword: string;
};

// config's parser
export type ConfigParser = {
  /**
   * Callback to parse environment value
   * @param {string} name param's name
   * @param {string} value param's value
   * @returns {Config[K]} parsed value or default
   */
  // eslint-disable-next-line no-unused-vars
  [K in keyof Config]: (name: string, value?: string) => Config[K];
};
