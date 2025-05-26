const constants = require("../../constants.ts");
const fs = require("fs");
const path = require("path");
const stream = require("stream");

const debugTestStream = fs.createWriteStream(
  path.join(constants.LOGGER.BASE_DIRECTORY, "url-shortener-test.log"),
  {
    flags: "a",
  },
);

const errorTestStream = fs.createWriteStream(
  path.join(constants.LOGGER.BASE_DIRECTORY, "url-shortener-test.err.log"),
  {
    flags: "a",
  },
);

const debugProductionStream = fs.createWriteStream(
  path.join(constants.LOGGER.BASE_DIRECTORY, "url-shortener-production.log"),
  {
    flags: "a",
  },
);

const errorProductionStream = fs.createWriteStream(
  path.join(constants.LOGGER.BASE_DIRECTORY, "url-shortener-production.err.log"),
  {
    flags: "a",
  },
);

/**
 * Writer to use to log on file
 * @param {fs.WriteStream} debugStream stream to write debug logs
 * @param {fs.WriteStream} errorStream stream to write error logs
 * @returns {Promise<stream.Writable>} a promise that will be resolve with a new instance of `Writable` class
 */
const getWriter = function (debugStream, errorStream) {
  return async function writer() {
    return new stream.Writable({
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
        } catch (error) {
          // ignore errors
        } finally {
          callback();
        }
      },
    });
  };
};

module.exports = {
  debugTestStream,
  errorTestStream,
  debugProductionStream,
  errorProductionStream,
  getWriter,
};
