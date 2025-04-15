import { Config, Environment } from "../models/config.model.js";

// default application's config
const defaultConfig: Config = {
  environment: Environment.PRODUCTION,
  port: 3000,
};

/**
 * Parse the config's param `environment`
 * @param {string | undefined} value param's value
 * @returns {Environment} parsed param's value
 */
const parseEnvironment = (value?: string): Environment => {
  return value && Object.values(Environment).includes(value as Environment)
    ? (value as Environment)
    : defaultConfig.environment;
};

/**
 * Parse the config's param `port`
 * @param {string | undefined} value param's value
 * @returns {number} parsed param's value
 */
const parsePort = (value?: string): number => {
  const parsed = Number(value);
  return !isNaN(parsed) && parsed > 0 && parsed < 65536 ? parsed : defaultConfig.port;
};

// application's config
export const config: Config = {
  // environment
  environment: parseEnvironment(process.env.ENVIRONMENT),
  // server
  port: parsePort(process.env.PORT),
};

/**
 * Gets a boolean flag for production environment
 * @returns {boolean} `true` if is a production environment, `false` otherwise
 */
export const isProduction = (): boolean =>
  [Environment.PROD, Environment.PRODUCTION].includes(config.environment);
