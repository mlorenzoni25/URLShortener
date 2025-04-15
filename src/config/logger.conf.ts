import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// directory where store log's files
const LOG_BASE_DIRECTORY = path.join(__dirname, "..", "..", "logs");

// config for development env
export const devConf = {
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
export const prodConf = {
  transport: {
    targets: [
      {
        target: "pino/file",
        level: "info",
        options: {
          destination: path.join(LOG_BASE_DIRECTORY, "url-shortener.log"),
          mkdir: true,
          sync: false,
        },
      },
      {
        target: "pino/file",
        level: "warn",
        options: {
          destination: path.join(LOG_BASE_DIRECTORY, "url-shortener.err.log"),
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
  base: {
    env: config.environment,
    version: process.env.npm_package_version,
  },
};
