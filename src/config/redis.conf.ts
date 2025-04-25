import { RedisOptions } from "ioredis";
import { config } from "./app.conf.js";

const redisConf: RedisOptions = {
  host: config.redisHost,
  port: config.redisPort,
  password: config.redisPassword,
};

export default redisConf;
