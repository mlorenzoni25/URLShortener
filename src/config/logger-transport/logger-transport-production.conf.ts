import {
  debugProductionStream,
  errorProductionStream,
  getWriter,
} from "./logger-transport.conf.js";

const writer = getWriter(debugProductionStream, errorProductionStream);

export default writer;
