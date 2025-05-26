const loggerTransportConf = require("./logger-transport.conf.cjs");

const writer = loggerTransportConf.getWriter(
  loggerTransportConf.debugTestStream,
  loggerTransportConf.errorTestStream,
);

module.exports = writer;
