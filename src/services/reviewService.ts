import { NotFoundError } from "../errors/NotFoundError.ts";
import { StallRepository } from "../repositories/stallRepository.ts";
import { ReviewRepository } from "../repositories/reviewRepository.ts";

import type {
  CreateReviewInput as CreateReviewBody,
} from "../schemas/reviewSchema.ts";

export class ReviewService {
  private stallRepository: StallRepository;
  private reviewRepository: ReviewRepository;

  constructor(
    stallRepository: StallRepository = new StallRepository(),
    reviewRepository: ReviewRepository = new ReviewRepository(),
  ) {
    this.stallRepository = stallRepository;
    this.reviewRepository = reviewRepository;
  }

  async createReview(
    stallId: number,
    userId: number,
    input: CreateReviewBody,
  ) {
    // Pastikan warung yang akan diberi review benar-benar ada.
    const stall = await this.stallRepository.findById(stallId);

    if (!stall) {
      throw new NotFoundError("Warung tidak ditemukan");
    }

    // Simpan review dengan identitas pengguna dari JWT.
    return this.reviewRepository.create({
      stallId,
      userId,
      rating: input.rating,
      comment: input.comment,
    });
  }
}