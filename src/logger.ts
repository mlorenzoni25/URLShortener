import { LoggerOptions, pino } from "pino";
import { isProduction, isTest } from "./config/app.conf.js";
import { devConf, prodConf, testConf } from "./config/logger.conf.js";

/**
 * Gets the logger's config to use for the current environment
 * @returns {LoggerOptions} logger's config
 */
const getConfig = (): LoggerOptions => {
  // production environment
  if (isProduction()) {
    return prodConf;
  }

  // test environment
  if (isTest()) {
    return testConf;
  }

  // development environment
  return devConf;
};

const logger = pino(getConfig());

export default logger;
