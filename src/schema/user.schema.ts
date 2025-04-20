import { z } from "zod";
import { comparePassword, generateHashedPassword } from "../helpers/security.helper.js";
import { passwordSchema, usernameSchema } from "./common.schema.js";

// validation schema of `registerUser` controller
export const RegisterUserRequestSchema = z
  .object({
    username: usernameSchema,
    password: passwordSchema,
    passwordConfirm: passwordSchema,
  })
  .refine(async ({ password, passwordConfirm }): Promise<boolean> => {
    // use 1 as round because this isn't the password stored on db, but only an hash to check
    // if `password` and `passwordConfirm` are equals. Using a small value the consume of CPU is lower
    const hashedPassword = await generateHashedPassword(password, 1);

    // check if two passwords are equals
    const isEquals = await comparePassword(passwordConfirm, hashedPassword);

    return isEquals;
  }, "Password and confirm password do not match.");

// validation schema of `loginUser` controller
export const LoginRequestSchema = z.object({ username: usernameSchema, password: passwordSchema });

export type RegisterUserRequest = z.infer<typeof RegisterUserRequestSchema>;
export type LoginRequest = z.infer<typeof LoginRequestSchema>;
