import { Router } from "express";
import * as UserController from "../controllers/user.controller.js";
import { refreshable } from "../middlewares/authentication/auth.middleware.js";
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

export default apiRouter;
