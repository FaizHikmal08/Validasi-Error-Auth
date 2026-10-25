import type { RequestHandler } from "express";

import { AppError } from "../errors/AppError.ts";
import type { UserRole } from "../repositories/userRepository.ts";

export function authorize(
  ...allowedRoles: UserRole[]
): RequestHandler {
  return (req, _res, next) => {
    // Pengguna harus terautentikasi terlebih dahulu.
    if (!req.user) {
      next(new AppError(401, "Belum terautentikasi"));
      return;
    }

    // Pengguna sudah login, tetapi role tidak diizinkan.
    if (!allowedRoles.includes(req.user.role)) {
      next(new AppError(403, "Akses ditolak"));
      return;
    }

    next();
  };
}