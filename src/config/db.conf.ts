import { fromIni } from "@aws-sdk/credential-provider-ini";
import { config } from "./app.conf.js";

const databaseConf = {
  region: config.awsRegion,
  credentials: fromIni({ profile: config.awsProfile }),
};

export default databaseConf;
