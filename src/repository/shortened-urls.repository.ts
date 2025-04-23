/* eslint-disable @typescript-eslint/no-explicit-any */
// the comment above is necessary because dynamoose in the `update` method wants the real names of the attributes
// (and not the aliases), but since I use aliases typescript gives an error, so as a solution I have to put `as any`
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
