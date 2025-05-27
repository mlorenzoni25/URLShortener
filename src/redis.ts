import { Redis } from "ioredis";
import redisConf from "./config/redis.conf.js";

// init redis client
const redis = new Redis(redisConf);

/**
 * Close the connection with Redis
 */
export const closeConnection = async (): Promise<void> => {
  await redis.quit();
};

export default redis;
