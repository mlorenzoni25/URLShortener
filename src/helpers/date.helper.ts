import { milliTimestampSchema } from "../schema/common.schema.js";

/**
 * Checks is the date is in the interval
 * @param {number} date date as unix timestamp in milliseconds
 * @param {number | undefined} minDate minimum date as unix timestamp in milliseconds
 * @param {number | undefined} maxDate maximum date as unix timestamp in milliseconds
 * @param {boolean} allowOpenInterval boolean flag to allow undefined minimum or maximum date
 * @throws {Error} if `allowOpenInterval` is `false` and one between `minDate` or `maxDate` is empty
 * @returns {{ minDateError: boolean, maxDateError: boolean }} an object with `minDateError` and `maxDateError` props
 */
export const isBetween = (
  date: number,
  minDate?: number,
  maxDate?: number,
  allowOpenInterval: boolean = false,
): { minDateError: boolean; maxDateError: boolean } => {
  // error if the interval is wrong
  if (!allowOpenInterval && (!minDate || !maxDate)) {
    throw new Error("Invalid dates range.");
  }

  // check if the date is before then the minimum date
  if (minDate && isTimestamp(minDate) && date < minDate) {
    return { minDateError: true, maxDateError: false };
  }

  // check if the date is later then the maximum date
  if (maxDate && isTimestamp(maxDate) && date > maxDate) {
    return { minDateError: false, maxDateError: true };
  }

  return { minDateError: false, maxDateError: false };
};

/**
 * Checks if a value is a unix epoch timestamp in milliseconds
 * @param {number} value value to check
 * @returns {boolean} `true` if the value is a timestamp, `false` otherwise
 */
export const isTimestamp = (value: number): boolean => {
  try {
    milliTimestampSchema.parse(value);
    return true;
  } catch {
    return false;
  }
};

/**
 * Gets the current date in ISO format
 * @param {boolean} includeHours boolean flag to get the date with hours
 * @returns {string} current date in ISO format
 */
export const todayISO = (includeHours: boolean = false): string => {
  const date = new Date().toISOString();
  if (includeHours) {
    return date;
  }
  return date.substring(0, 10);
};
