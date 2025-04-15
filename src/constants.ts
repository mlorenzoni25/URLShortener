// validation regex
export const REGEX = {
  // alphanumeric with . _ -
  ALPHANUM_SOFT_SPECIAL: /^[a-zA-Z0-9._-]+$/,
  // only lower case alpha
  LC_ALPHA: /[a-z]/,
  // only upper case alpha
  UC_ALPHA: /[A-Z]/,
  // only numbers
  NUMBER: /\d/,
  // special chars
  HARD_SPECIALS: /[!@#$%^&*]/,
};
