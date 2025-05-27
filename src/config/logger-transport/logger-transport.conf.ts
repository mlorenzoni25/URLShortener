import { createWriteStream, WriteStream } from "fs";
import { join } from "path";
import { Writable } from "stream";
import { LOGGER } from "../../constants.js";

export const debugProductionStream = createWriteStream(
  join(LOGGER.BASE_DIRECTORY, "url-shortener.log"),
  {
    flags: "a",
  },
);

export const errorProductionStream = createWriteStream(
  join(LOGGER.BASE_DIRECTORY, "url-shortener.err.log"),
  {
    flags: "a",
  },
);

/**
 * Writer to use to log on file
 * @param {WriteStream} debugStream stream to write debug logs
 * @param {WriteStream} errorStream stream to write error logs
 * @returns {Function<Promise<Writable>>} a function that returns a promise that will be resolve with a new instance of `Writable` class
 */
export const getWriter = (
  debugStream: WriteStream,
  errorStream: WriteStream,
): (() => Promise<Writable>) => {
  return async function writer() {
    return new Writable({
      write(chunk, _encoding, callback) {
        try {
          const lines = chunk.toString().split("\n").filter(Boolean);
          for (const line of lines) {
            const log = JSON.parse(line);
            if (log.level >= 40) {
              errorStream.write(line + "\n");
            } else {
              debugStream.write(line + "\n");
            }
          }
        } catch {
          // ignore errors
        } finally {
          callback();
        }
      },
    });
  };
};
