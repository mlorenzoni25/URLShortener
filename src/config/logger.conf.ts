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
  level: "trace",
};

// config for test env
export const testConf: LoggerOptions = {
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

// config for production env
export const prodConf: LoggerOptions = {
  transport: {
    target: path.join(LOGGER.BASE_DIRECTORY_TRANSPORTS, "logger-transport-production.conf.js"),
    options: {
      mkdir: true,
      sync: true,
    },
  },
};
