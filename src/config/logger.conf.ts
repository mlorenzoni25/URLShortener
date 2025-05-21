import path from "path";
import { LoggerOptions } from "pino";
import { LOGGER } from "../constants.js";

// config for development env
export const devConf: LoggerOptions = {
  transport: {
    targets: [
      {
        target: "pino-pretty",
        level: "debug",
        options: {
          colorize: true,
          levelFirst: true,
          translateTime: "SYS:standard",
        },
      },
    ],
  },
  level: "debug",
};

// config for test env
export const testConf: LoggerOptions = {
  transport: {
    targets: [
      {
        target: "pino/file",
        level: "debug",
        options: {
          destination: path.join(LOGGER.BASE_DIRECTORY, "url-shortener.log"),
          mkdir: true,
          sync: false,
        },
      },
      {
        target: "pino/file",
        level: "debug",
        options: {
          destination: path.join(LOGGER.BASE_DIRECTORY, "url-shortener.err.log"),
          mkdir: true,
          sync: false,
        },
      },
    ],
  },
  level: "debug",
  timestamp: (): string => `,"timestamp":"${new Date().toISOString()}"`,
  // Removed the formatters since they're not compatible with transport targets
  messageKey: "message",
};

// config for production env
export const prodConf: LoggerOptions = {
  transport: {
    targets: [
      {
        target: "pino/file",
        level: "info",
        options: {
          destination: path.join(LOGGER.BASE_DIRECTORY, "url-shortener.log"),
          mkdir: true,
          sync: false,
        },
      },
      {
        target: "pino/file",
        level: "warn",
        options: {
          destination: path.join(LOGGER.BASE_DIRECTORY, "url-shortener.err.log"),
          mkdir: true,
          sync: false,
        },
      },
    ],
  },
  level: "info",
  timestamp: (): string => `,"timestamp":"${new Date().toISOString()}"`,
  // Removed the formatters since they're not compatible with transport targets
  messageKey: "message",
};
