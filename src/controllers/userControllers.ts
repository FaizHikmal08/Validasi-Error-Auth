import type { Request, Response } from 'express';
import { UserService } from '../services/userServices';

export class UserController {
  private userService: UserService;

  constructor(userService: UserService = new UserService()) {
    this.userService = userService;
  }


  private handleError(res: Response, error: unknown): Response {
    console.error('USER ERROR:', error);

    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan pada server',
      error: error instanceof Error ? error.message : String(error),
  });
}

  getUsers = async (req: Request, res: Response): Promise<Response> => {
    try {
      const users = await this.userService.getAllUsers();

      return res.status(200).json({
        status: 'success',
        data: users,
      });
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  createUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    if (!req.body) {
      return res.status(400).json({
        status: 'fail',
        message: 'Request body wajib diisi',
      });
    }

    const { name, email, passwordHash, role } = req.body;

    if (!name || !email || !passwordHash || !role) {
      return res.status(400).json({
        status: 'fail',
        message: 'name, email, passwordHash, dan role wajib diisi',
      });
    }

    const user = await this.userService.createUser({
      name,
      email,
      passwordHash,
      role,
    });

    return res.status(201).json({
      status: 'success',
      data: user,
    });
  } catch (error) {
    return this.handleError(res, error);
  }};
}