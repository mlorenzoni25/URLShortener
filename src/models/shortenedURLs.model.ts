import { Item } from "dynamoose/dist/Item.js";
import dynamoose from "../database.js";

// application internal object for user model
export interface URLItem extends Item {
  shortenedId: string;
  alias: string;
  currentUses: number;
  maxUses: number;
  password: string;
  url: string;
  validFrom: string;
  validTo: string;
  createdAt?: string;
  updatedAt?: string;
}

// users's table schema
const urlShortenedSchema = new dynamoose.Schema(
  {
    ShortenedId: {
      alias: "shortenedId",
      required: true,
      type: String,
    },
    CurrentUses: {
      alias: "currentUses",
      default: 0,
      required: false,
      type: Number,
    },
    MaxUses: {
      alias: "maxUses",
      default: 0,
      required: false,
      type: Number,
    },
    Password: {
      alias: "password",
      default: "",
      required: false,
      type: String,
    },
    Url: {
      alias: "url",
      required: true,
      type: String,
    },
    ValidFrom: {
      alias: "validFrom",
      default: "",
      required: false,
      type: String,
    },
    ValidTo: {
      alias: "validTo",
      default: "",
      required: false,
      type: String,
    },
  },
  {
    timestamps: {
      createdAt: "CreatedAt",
      updatedAt: "UpdatedAt",
    },
  },
);

export const URLModel = dynamoose.model<URLItem>("URLShortener_URLs", urlShortenedSchema, {
  create: false,
});
