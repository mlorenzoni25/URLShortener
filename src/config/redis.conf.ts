import { RedisOptions } from "ioredis";
import { config } from "./app.conf.js";

const redisConf: RedisOptions = {
  host: config.redisHost,
  port: config.redisPort,
  username: config.redisUser,
  password: config.redisPassword?.value,
  keyPrefix: "urlshortener:",
};

export default redisConf;
