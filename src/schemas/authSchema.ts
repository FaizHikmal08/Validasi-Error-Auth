import { z } from "zod";

// Validasi data saat register
export const registerSchema = z
  .object({
    name: z
      .string({ required_error: "name wajib diisi" })
      .trim()
      .min(3, "name minimal 3 karakter")
      .max(100, "name maksimal 100 karakter"),

    email: z
      .string({ required_error: "email wajib diisi" })
      .trim()
      .toLowerCase()
      .email("format email tidak valid")
      .max(150, "email maksimal 150 karakter"),

    password: z
      .string({ required_error: "password wajib diisi" })
      .min(8, "password minimal 8 karakter")
      .max(72, "password maksimal 72 karakter"),
  })
  .strict();

// Validasi data saat login
export const loginSchema = z
  .object({
    email: z
      .string({ required_error: "email wajib diisi" })
      .trim()
      .toLowerCase()
      .email("format email tidak valid")
      .max(150, "email maksimal 150 karakter"),

    password: z
      .string({ required_error: "password wajib diisi" })
      .min(1, "password wajib diisi"),
  })
  .strict();

// Tipe TypeScript berdasarkan schema
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;