import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { AppError } from "../errors/AppError.ts";
import { verifyToken } from "../services/tokenService.ts";

export function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const authorization = req.get("Authorization");

  // Token wajib dikirim melalui header Authorization.
  if (!authorization?.startsWith("Bearer ")) {
    next(new AppError(401, "Token tidak ditemukan"));
    return;
  }

  const token = authorization.slice(7).trim();

  if (!token) {
    next(new AppError(401, "Token tidak ditemukan"));
    return;
  }

  try {
    // Verifikasi signature dan masa berlaku JWT.
    req.user = verifyToken(token);
    next();
  } catch {
    next(
      new AppError(
        401,
        "Token tidak valid atau kedaluwarsa",
      ),
    );
  }
}