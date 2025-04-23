import { Router } from "express";
import { redirectTo } from "../controllers/url.controller.js";
import { validateRedirectToRequest } from "../middlewares/url.middleware.js";

const appRouter = Router();

// url redirect
appRouter.get("/:shortenedId", validateRedirectToRequest, redirectTo);
appRouter.post("/:shortenedId", validateRedirectToRequest, redirectTo);

export default appRouter;
