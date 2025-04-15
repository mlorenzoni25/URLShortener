import * as AWS from "@aws-sdk/client-dynamodb";
import dynamoose from "dynamoose";
import databaseConf from "./config/db.conf.js";

// create client instance
const database = new AWS.DynamoDB(databaseConf);

// set it into dynamoose
dynamoose.aws.ddb.set(database);

export default dynamoose;
