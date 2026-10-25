import { Router } from "express";

import { AuthController } from "../controllers/authController.ts";
import { authenticate } from "../middlewares/authenticate.ts";
import { validate } from "../middlewares/validate.ts";

import {
  registerSchema,
  loginSchema,
} from "../schemas/authSchema.ts";

const authRouter = Router();
const authController = new AuthController();

// Register: publik, tidak perlu token.
authRouter.post(
  "/register",
  validate(registerSchema, "body"),
  authController.register,
);

// Login: publik, tidak perlu token.
authRouter.post(
  "/login",
  validate(loginSchema, "body"),
  authController.login,
);

// Profil pengguna: wajib menggunakan JWT yang valid.
authRouter.get(
  "/me",
  authenticate,
  authController.me,
);

export { authRouter };