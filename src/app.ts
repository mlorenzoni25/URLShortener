import cors from "cors";
import express from "express";
import helmet from "helmet";
import { pinoHttp } from "pino-http";
import { config } from "./config/app.conf.js";
import logger from "./logger.js";
import errorHandler from "./middlewares/error-handler.middleware.js";
import { closeConnection } from "./redis.js";
import apiRouter from "./routes/api.route.js";
import appRouter from "./routes/app.route.js";

const app = express();

app
  .use(express.urlencoded({ extended: true }))
  .use(express.json())
  // logging
  .use(pinoHttp({ logger }))
  // security conf
  .disable("x-powered-by")
  .use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          // allows base only from myself
          baseUri: ["'self'"],
          // disables form's actions
          formAction: [],
          // allows script only from myself
          defaultSrc: ["'self'"],
          // allows script only from myself
          scriptSrc: ["'self'"],
          // disables object and embed elements
          objectSrc: ["'none'"],
          // disables inline JavaScript
          scriptSrcAttr: ["'none'"],
          // allows styles only from myself and external secure sources
          styleSrc: ["'self'", "https:"],
          // allows images from myself and base64
          imgSrc: ["'self'", "data:"],
          // allows fonts from myself and external secure sources
          fontSrc: ["'self'", "https:"],
          // allows iframe, frame, object and embed only from myself
          frameAncestors: ["'self'"],
          // forces HTTPS
          upgradeInsecureRequests: [],
        },
      },
      // prevents use into iframe
      frameguard: {
        action: "deny",
      },
      // hides x-powered-by header to hide stack's info
      hidePoweredBy: true,
      // forces HTTPS for one year and apply this rule to subdomains
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
      // prevents file sniffing
      noSniff: true,
      // prevents cross-site scripting (disabled in the last versions of helmet)
      xssFilter: true,
      // never sends referrer's info
      referrerPolicy: {
        policy: "no-referrer-when-downgrade",
      },
    }),
  )
  .use(
    cors({
      origin: [`http://localhost:${config.port}`],
      methods: ["GET", "POST"],
    }),
  );

// app router
app.use("/", appRouter);

// api router
app.use("/api", apiRouter);

// middleware to handle errors
app.use(errorHandler);

// close the connection when application receives SIGINT signal
process.on("SIGINT", async () => {
  await closeConnection();
});

export default app;
