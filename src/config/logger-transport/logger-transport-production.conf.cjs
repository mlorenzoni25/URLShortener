const loggerTransportConf = require("./logger-transport.conf.cjs");

const writer = loggerTransportConf.getWriter(
  loggerTransportConf.debugProductionStream,
  loggerTransportConf.errorProductionStream,
);

module.exports = writer;
