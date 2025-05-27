/* eslint-disable @typescript-eslint/no-explicit-any */
// the comment above is necessary because dynamoose in the `update` method wants the real names of the attributes
// (and not the aliases), but since I use aliases typescript gives an error, so as a solution I have to put `as any`
import { ObjectType, SortOrder } from "dynamoose/dist/General.js";
import { QueryResponse } from "dynamoose/dist/ItemRetriever.js";
import { URLItem, URLModel } from "../models/shortenedURLs.model.js";

/**
 * Increment by one the url's number of uses
 * @param {URLItem} item item to update
 * @returns {Promise<URLItem>} updated item
 */
export const incrementUsesCounter = (item: URLItem): Promise<URLItem> => {
  return URLModel.update(
    {
      ShortenedId: item.shortenedId,
    } as any,
    {
      $ADD: {
        CurrentUses: 1,
      } as any,
    },
  );
};

/**
 * Gets the top N used URLs
 * @param {number} limit maximum number of results
 * @param {ObjectType | null} lastKey lastKey got from previous query to start searching from that point
 * @returns {Promise<QueryResponse<URLItem>>} a promise that will be resolve with the result of the query
 */
export const getTopUsedURLs = (
  limit: number = 50,
  lastKey: ObjectType | null,
): Promise<QueryResponse<URLItem>> => {
  const query = URLModel.query("CachePartition")
    .eq("TopUsed")
    .using("TopUsedCacheIndex")
    // get only urls usable for expiry date
    .filter("ValidTo")
    .eq(-1)
    .or()
    .gt(Date.now())
    // sorting and limiting of results
    .sort(SortOrder.descending)
    .limit(limit);

  if (lastKey) {
    query.startAt(lastKey);
  }

  return query.exec();
};
