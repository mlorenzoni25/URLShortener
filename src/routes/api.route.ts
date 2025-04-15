import { Router } from "express";
import * as UserController from "../controllers/user.controller.js";
import { validateRegisterUserRequest } from "../middlewares/user.middleware.js";

// api router
const apiRouter = Router();

// user api
apiRouter.post("/register", validateRegisterUserRequest, UserController.registerUser);

export default apiRouter;
