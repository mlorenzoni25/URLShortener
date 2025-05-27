import app from "./app.js";
import { config } from "./config/app.conf.js";

app.listen(config.port, config.host, () => {
  // eslint-disable-next-line no-console
  console.log(
    `
🚀 LET’S GO!

🌐 Server running at: http://${config.host}:${config.port}. The config is:`,
    config,
  );
});
