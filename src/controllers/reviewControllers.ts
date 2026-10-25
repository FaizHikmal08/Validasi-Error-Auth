import type { Request, Response } from "express";

import { AppError } from "../errors/AppError.ts";
import { getValidated } from "../middlewares/validate.ts";
import { ReviewService } from "../services/reviewService.ts";

import type { IdParam } from "../schemas/stallSchema.ts";
import type { CreateReviewInput } from "../schemas/reviewSchema.ts";

export class ReviewController {
  private reviewService: ReviewService;

  constructor(reviewService: ReviewService = new ReviewService()) {
    this.reviewService = reviewService;
  }

  createReview = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    // Identitas pengguna harus berasal dari JWT.
    const user = req.user;

    if (!user) {
      throw new AppError(401, "Belum terautentikasi");
    }

    // Ambil ID warung dan body yang sudah divalidasi.
    const { id } = getValidated<IdParam>(res, "params");

    const body = getValidated<CreateReviewInput>(
      res,
      "body",
    );

    // userId berasal dari token, bukan dari body.
    const review = await this.reviewService.createReview(
      id,
      user.id,
      body,
    );

    res.status(201).json({
      status: "success",
      data: review,
    });
  };
}