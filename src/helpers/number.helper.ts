/**
 * Checks is the number is in the interval
 * @param {number} value value
 * @param {number | undefined} minValue minimum value
 * @param {number | undefined} maxValue maximum value
 * @param {boolean} allowOpenInterval boolean flag to allow undefined minimum or maximum number
 * @throws {Error} if `allowOpenInterval` is `false` and one between `minValue` or `maxValue` is empty
 * @returns {{ minValueError: boolean, maxValueError: boolean }} an object with `minValueError` and `maxValueError` props
 */
export const isBetween = (
  value: number,
  minValue?: number,
  maxValue?: number,
  allowOpenInterval: boolean = false,
): { minValueError: boolean; maxValueError: boolean } => {
  // error if the interval is wrong
  if (!allowOpenInterval && (!minValue || !maxValue)) {
    throw new Error("Invalid numeric range.");
  }

  // check if the value is lower then the minimum value
  if (minValue && value < minValue) {
    return { minValueError: true, maxValueError: false };
  }

  // check if the value is higher then the maximum value
  if (maxValue && value > maxValue) {
    return { minValueError: false, maxValueError: true };
  }

  return { minValueError: false, maxValueError: false };
};
