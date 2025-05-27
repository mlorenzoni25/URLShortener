import { Item } from "dynamoose/dist/Item.js";
import { ValueType } from "dynamoose/dist/Schema.js";
import { validate as validateUUID } from "uuid";
import dynamoose from "../database.js";

// application internal object for user model
export interface UserItem extends Item {
  userId: string;
  password: string;
  username: string;
  createdAt?: string;
  updatedAt?: string;
}

// users's table schema
const userSchema = new dynamoose.Schema(
  {
    UserId: {
      alias: "userId",
      required: true,
      type: String,
      validate: (value: ValueType) => validateUUID(value.toString()),
    },
    Password: {
      alias: "password",
      required: true,
      type: String,
    },
    Username: {
      alias: "username",
      required: true,
      type: String,
      index: {
        type: "global",
        name: "UsernameIndex",
        project: true,
      },
    },
  },
  {
    timestamps: {
      createdAt: "CreatedAt", // this value will be the column's name
      updatedAt: "UpdatedAt", // this value will be the column's name
    },
  },
);

export const UserModel = dynamoose.model<UserItem>("URLShortener_Users", userSchema, {
  create: false,
});
