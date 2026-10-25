import { getDb } from "../db/index.ts";
import { reviews } from "../db/schema.ts";

export interface CreateReviewInput {
  stallId: number;
  userId: number;
  rating: number;
  comment?: string;
}

export class ReviewRepository {
  async create(input: CreateReviewInput) {
    const db = await getDb();

    const result = await db
      .insert(reviews)
      .output({
        id: reviews.id,
        stallId: reviews.stallId,
        userId: reviews.userId,
        rating: reviews.rating,
        comment: reviews.comment,
        likeCount: reviews.likeCount,
        createdAt: reviews.createdAt,
      })
      .values({
        stallId: input.stallId,
        userId: input.userId,
        rating: input.rating,
        comment: input.comment ?? null,
        likeCount: 0,
      });

    const review = result[0];

    if (!review) {
      throw new Error("Review gagal dibuat");
    }

    return review;
  }
}