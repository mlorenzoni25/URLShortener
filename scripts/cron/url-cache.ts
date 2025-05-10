import { ObjectType } from "dynamoose/dist/General.js";
import { CACHE } from "../../src/constants.js";
import logger from "../../src/logger.js";
import { URLItem } from "../../src/models/shortenedURLs.model.js";
import redis from "../../src/redis.js";
import { getTopUsedURLs } from "../../src/repository/shortened-urls.repository.js";

const startTime = Date.now();
logger.info("URL Cache Builder - Script started");

let lastKey: ObjectType | null = null;
const results: URLItem[] = [];

// clear the cache
const keys = await redis.keys("url_cache:*");
logger.info(`URL Cache Builder - Found ${keys.length} items to delete`);
if (keys.length > 0) {
  await redis.del(...keys);
}

while (results.length < CACHE.URL_MAX_SIZE) {
  // get the top used URLs
  const batch = await getTopUsedURLs(CACHE.URL_MAX_SIZE, lastKey);

  // filter the results
  const filtered = batch.filter(
    (item: URLItem) => item.maxUses === -1 || !item.currentUses || item.currentUses < item.maxUses,
  );

  // push the filtered items
  results.push(...filtered);

  // if there isn't lastKey I finished
  if (!batch.lastKey) {
    break;
  }

  // save the lastKey to paginate
  lastKey = batch.lastKey;
}

logger.info(`URL Cache Builder - Found ${results.length} items to store in the cache`);

for (const urlItem of results) {
  const key = `url_cache:${urlItem.shortenedId}`;
  await redis.set(key, JSON.stringify(urlItem));
  await redis.expire(key, CACHE.URL_SECONDS_EXPIRE);
}

await redis.quit();

const executionTimeSeconds = Number((Date.now() - startTime) / 1000).toFixed(3);
logger.info(`URL Cache Builder - Script execution completed in ${executionTimeSeconds} seconds`);
