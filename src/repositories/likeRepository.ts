import { eq } from 'drizzle-orm';
import { getDb } from '../db/index.ts';
import { likes } from '../db/schema.ts';

export interface CreateLikeInput {
  reviewId: number;
  userId: number;
}

export class LikeRepository {
  async create(input: CreateLikeInput) {
    const db = await getDb();

    await db
      .insert(likes)
      .values({
        reviewId: input.reviewId,
        userId: input.userId,
      });

    return {
      reviewId: input.reviewId,
      userId: input.userId,
    };
  }

  async remove(id: number) {
    const db = await getDb();

    const rows = await db
      .select()
      .from(likes)
      .where(eq(likes.id, id));

    const existing = rows[0];

    if (!existing) {
      return undefined;
    }

    await db
      .delete(likes)
      .where(eq(likes.id, id));

    return existing;
  }
}