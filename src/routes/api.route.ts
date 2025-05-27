import { Router } from "express";
import { shortenURL } from "../controllers/url.controller.js";
import * as UserController from "../controllers/user.controller.js";
import { refreshable } from "../middlewares/authentication/authentication.middleware.js";
import { rateLimiter } from "../middlewares/rate-limiter.middleware.js";
import { validateCreateShortenedURLRequest } from "../middlewares/url.middleware.js";
import {
  validateLoginRequest,
  validateRegisterUserRequest,
} from "../middlewares/user.middleware.js";

// api router
const apiRouter = Router();

// user api
apiRouter.post("/register", validateRegisterUserRequest, UserController.registerUser);
apiRouter.post("/login", validateLoginRequest, UserController.loginUser);
apiRouter.post("/refresh", refreshable, UserController.refreshUser);

// url api
apiRouter.post("/url", rateLimiter, validateCreateShortenedURLRequest, shortenURL);

export default apiRouter;
