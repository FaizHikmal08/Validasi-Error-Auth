import { eq } from 'drizzle-orm';
import { getDb } from '../db/index.ts';
import { flags } from '../db/schema.ts';

export interface UpdateFlagStatusInput {
  status: string;
}

export class FlagRepository {
  async findAll() {
    const db = await getDb();

    return db
      .select()
      .from(flags)
      .orderBy(flags.id);
  }

  async updateStatus(
    id: number,
    input: UpdateFlagStatusInput,
  ) {
    const db = await getDb();

    const existing = await db
      .select()
      .from(flags)
      .where(eq(flags.id, id));

    if (!existing[0]) {
      return undefined;
    }

    await db
      .update(flags)
      .set({
        status: input.status,
      })
      .where(eq(flags.id, id));

    const updated = await db
      .select()
      .from(flags)
      .where(eq(flags.id, id));

    return updated[0];
  }
}