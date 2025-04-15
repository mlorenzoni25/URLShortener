import { fromIni } from "@aws-sdk/credential-provider-ini";
import { config, isProduction } from "./app.conf.js";

/**
 * Database configuration
 *
 * For read credentials:
 *  - `development environment`: create the file ~/.aws/credentials and write to it
 *    [<your_aws_profile>]
 *    aws_access_key_id = <your_aws_access_key_id>
 *    aws_secret_access_key = <your_aws_secret_access_key>
 */
const databaseConf = {
  region: config.awsRegion,
  credentials: isProduction()
    ? async () => ({ accessKeyId: "", secretAccessKey: "" }) // TODO implement
    : fromIni({ profile: config.awsProfile }),
};

export default databaseConf;
