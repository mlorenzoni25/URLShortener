/**
 * Checks is the date is in the interval
 * @param {Date | string} date date
 * @param {Date | string | undefined} minDate minimum date
 * @param {Date | string | undefined} maxDate maximum date
 * @param {boolean} allowOpenInterval boolean flag to allow undefined minimum or maximum date
 * @throws {Error} if `allowOpenInterval` is `false` and one between `minDate` or `maxDate` is empty
 * @returns {{ minDateError: boolean, maxDateError: boolean }} an object with `minDateError` and `maxDateError` props
 */
export const isBetween = (
  date: Date | string,
  minDate?: Date | string,
  maxDate?: Date | string,
  allowOpenInterval: boolean = false,
): { minDateError: boolean; maxDateError: boolean } => {
  // convert the date (string format) to date object
  if (typeof date === "string") {
    date = new Date(date);
  }

  // convert the minimum date (string format) to date object
  if (typeof minDate === "string") {
    minDate = new Date(minDate);
  }

  // convert the maximum date (string format) to date object
  if (typeof maxDate === "string") {
    maxDate = new Date(maxDate);
  }

  // error if the interval is wrong
  if (!allowOpenInterval && (!minDate || !maxDate)) {
    throw new Error("Invalid dates range.");
  }

  // check if the date is before then the minimum date
  if (minDate && date < minDate) {
    return { minDateError: true, maxDateError: false };
  }

  // check if the date is later then the maximum date
  if (maxDate && date > maxDate) {
    return { minDateError: false, maxDateError: true };
  }

  return { minDateError: false, maxDateError: false };
};
