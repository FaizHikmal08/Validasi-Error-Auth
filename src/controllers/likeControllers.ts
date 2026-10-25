import type { Request, Response } from 'express';
import { LikeService } from '../services/likeService';

export class LikeController {
  private likeService: LikeService;

  constructor(
    likeService: LikeService = new LikeService(),
  ) {
    this.likeService = likeService;
  }

  private handleError(
    res: Response,
    error: unknown,
  ): Response {
    if (
      error instanceof Error &&
      error.message === 'LIKE_NOT_FOUND'
    ) {
      return res.status(404).json({
        status: 'fail',
        message: 'Data like tidak ditemukan',
      });
    }

    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan pada server',
      error:
        error instanceof Error
          ? error.message
          : String(error),
    });
  }

  createLike = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    try {
      const { reviewId, userId } = req.body;

      if (
        reviewId === undefined ||
        userId === undefined
      ) {
        return res.status(400).json({
          status: 'fail',
          message: 'reviewId dan userId wajib diisi',
        });
      }

      const data = await this.likeService.createLike({
        reviewId: Number(reviewId),
        userId: Number(userId),
      });

      return res.status(201).json({
        status: 'success',
        data,
      });
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  deleteLike = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    try {
      const id = Number(req.params.id);

      const data = await this.likeService.deleteLike(id);

      return res.status(200).json({
        status: 'success',
        data,
      });
    } catch (error) {
      return this.handleError(res, error);
    }
  };
}