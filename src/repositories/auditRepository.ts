import { getDb } from '../db/index.ts';
import { auditLogs } from '../db/schema.ts';

export interface CreateAuditInput {
  userId: number;
  action: string;
  targetTable: string;
  targetId: number;
  metadata?: string | null;
}

export class AuditRepository {
  async findAll() {
    const db = await getDb();

    return db
      .select()
      .from(auditLogs)
      .orderBy(auditLogs.id);
  }

  async create(input: CreateAuditInput) {
    const db = await getDb();

    await db
      .insert(auditLogs)
      .values({
        userId: input.userId,
        action: input.action,
        targetTable: input.targetTable,
        targetId: input.targetId,
        metadata: input.metadata ?? null,
      });

    return {
      userId: input.userId,
      action: input.action,
      targetTable: input.targetTable,
      targetId: input.targetId,
      metadata: input.metadata ?? null,
    };
  }
}