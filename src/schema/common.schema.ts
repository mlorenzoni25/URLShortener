import { z } from "zod";
import { REGEX } from "../constants.js";

// `username` validation schema
export const usernameSchema = z
  .string()
  .min(5)
  .max(30)
  .regex(
    REGEX.ALPHANUM_SOFT_SPECIAL,
    "Username can contains only letters, numbers e the following special chars: _ - .",
  );

// `password` validation schema
export const passwordSchema = z
  .string()
  .min(8)
  .regex(REGEX.LC_ALPHA, "Password must contains at least one lowercase letter")
  .regex(REGEX.UC_ALPHA, "Password must contains at least one uppercase letter")
  .regex(REGEX.NUMBER, "Password must contains at least one number")
  .regex(REGEX.HARD_SPECIALS, "Password must contains at least one special character (!@#$%^&*)");

// `url` validation schema
export const urlSchema = z.string().url();

// `milliTimestamp` validation schema
export const milliTimestampSchema = z
  .number()
  .int()
  .positive()
  .refine((value: number) => value.toString().length === 13, {
    message: "Timestamp must be an integer value of 13 digits",
  });
