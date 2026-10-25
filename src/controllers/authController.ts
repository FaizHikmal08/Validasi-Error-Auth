import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { AuthService } from "../services/authService.ts";
import { AppError } from "../errors/AppError.ts";
import { getValidated } from "../middlewares/validate.ts";

import type {
  RegisterInput,
  LoginInput,
} from "../schemas/authSchema.ts";

export class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService = new AuthService()) {
    this.authService = authService;
  }

  // Register pengguna baru
  register = async (
    _req: Request,
    res: Response,
  ): Promise<void> => {
    const body = getValidated<RegisterInput>(res, "body");

    const result = await this.authService.register(body);

    res.status(201).json(result);
  };

  // Login pengguna
  login = async (
    _req: Request,
    res: Response,
  ): Promise<void> => {
    const body = getValidated<LoginInput>(res, "body");

    const result = await this.authService.login(body);

    res.status(200).json(result);
  };

  // Mendapatkan identitas pengguna yang sedang login
  me = (
    req: Request,
    res: Response,
    next: NextFunction,
  ): void => {
    if (!req.user) {
      next(new AppError(401, "Belum terautentikasi"));
      return;
    }

    res.status(200).json({
      status: "success",
      data: {
        user: req.user,
      },
    });
  };
}