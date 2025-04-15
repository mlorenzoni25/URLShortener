import { pino } from "pino";
import { isProduction } from "./config/app.conf.js";
import { devConf, prodConf } from "./config/logger.conf.js";

const logger = pino(isProduction() ? prodConf : devConf);

export default logger;
