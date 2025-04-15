import app from "./app.js";
import { config } from "./config/app.conf.js";

app.listen(config.port, () => {
  // eslint-disable-next-line no-console
  console.log(`🚀 Server running on http://localhost:${config.port}`);
  // eslint-disable-next-line no-console
  console.log("The config used is", JSON.stringify(config, null, 2));
});
