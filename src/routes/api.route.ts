import { Router } from "express";
import * as UserController from "../controllers/user.controller.js";
import { authenticated, refreshable } from "../middlewares/authentication/auth.middleware.js";
import { validateCreateShortenedURLRequest } from "../middlewares/url.middleware.js";
import {
  validateLoginRequest,
  validateRegisterUserRequest,
} from "../middlewares/user.middleware.js";
import { shortenURL } from "../controllers/url.controller.js";

// api router
const apiRouter = Router();

// user api
apiRouter.post("/register", validateRegisterUserRequest, UserController.registerUser);
apiRouter.post("/login", validateLoginRequest, UserController.loginUser);
apiRouter.post("/refresh", refreshable, UserController.refreshUser);

// url api
apiRouter.post("/url", authenticated, validateCreateShortenedURLRequest, shortenURL);

export default apiRouter;
