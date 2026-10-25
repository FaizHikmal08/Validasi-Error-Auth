import { compare, hash } from "bcryptjs";

import { AppError } from "../errors/AppError.ts";
import type {
  LoginInput,
  RegisterInput,
} from "../schemas/authSchema";
import { UserRepository } from "../repositories/userRepository.ts";
import { signToken } from "./tokenService.ts";

export class AuthService {
  private userRepository: UserRepository;

  constructor(userRepository = new UserRepository()) {
    this.userRepository = userRepository;
  }

  // Register pengguna baru.
  async register(input: RegisterInput) {
    const email = input.email.trim().toLowerCase();

    // Cek apakah email sudah terdaftar.
    const existingUser =
      await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new AppError(409, "Email sudah terdaftar");
    }

    // Hash password sebelum disimpan ke database.
    const passwordHash = await hash(input.password, 12);

    const user = await this.userRepository.create({
      name: input.name.trim(),
      email,
      passwordHash,
      role: "customer",
    });

    // Password hash tidak dikembalikan ke client.
    return {
      status: "success",
      message: "Registrasi berhasil",
      data: user,
    };
  }

  // Login pengguna dan buat JWT.
  async login(input: LoginInput) {
    const email = input.email.trim().toLowerCase();

    const user = await this.userRepository.findByEmail(email);

    // Gunakan pesan yang sama agar tidak membocorkan
    // apakah email terdaftar atau tidak.
    if (!user) {
      throw new AppError(401, "Email atau password salah");
    }

    // Bandingkan password yang dimasukkan dengan hash database.
    const passwordValid = await compare(
      input.password,
      user.passwordHash,
    );

    if (!passwordValid) {
      throw new AppError(401, "Email atau password salah");
    }

    // Payload token tidak memuat password atau passwordHash.
    const token = signToken({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    return {
      status: "success",
      message: "Login berhasil",
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      },
    };
  }
}