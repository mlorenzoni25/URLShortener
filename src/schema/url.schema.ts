import { z } from "zod";
import { datetimeSchema, passwordSchema, urlSchema, usernameSchema } from "./common.schema.js";

// validation schema of `shortenURL` controller
export const CreateShortenedURLRequestSchema = z
  .object({
    alias: usernameSchema.default(""),
    maxUses: z.number().gt(0).default(0),
    password: passwordSchema.default(""),
    url: urlSchema,
    validFrom: datetimeSchema.default(""),
    validTo: datetimeSchema.default(""),
  })
  .partial()
  .required({ url: true });

// validation schema of `getURL` controller
export const RedirectToRequestSchema = z
  .object({
    shortenedId: z.string(),
    password: passwordSchema.default(""),
  })
  .partial()
  .required({ shortenedId: true });

export type CreateShortenedURLRequest = z.infer<typeof CreateShortenedURLRequestSchema>;
export type RedirectToRequest = z.infer<typeof RedirectToRequestSchema>;
