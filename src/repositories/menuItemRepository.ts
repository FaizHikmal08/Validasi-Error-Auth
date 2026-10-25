import { eq } from 'drizzle-orm';
import { getDb } from '../db/index.ts';
import { menuItems, stalls } from '../db/schema.ts';

export interface CreateMenuItemInput {
  stallId: number;
  name: string;
  price: number;
  isAvailable: boolean;
}

export class MenuItemRepository {
  async findAll() {
    const db = await getDb();

    return db
      .select({
        id: menuItems.id,
        stallId: menuItems.stallId,
        name: menuItems.name,
        price: menuItems.price,
        isAvailable: menuItems.isAvailable,
        stallName: stalls.name,
        stallCategory: stalls.category,
        stallLocation: stalls.location,
      })
      .from(menuItems)
      .innerJoin(stalls, eq(menuItems.stallId, stalls.id))
      .orderBy(menuItems.id);
  }

  async findById(id: number) {
    const db = await getDb();

    const rows = await db
      .select({
        id: menuItems.id,
        stallId: menuItems.stallId,
        name: menuItems.name,
        price: menuItems.price,
        isAvailable: menuItems.isAvailable,
        stallName: stalls.name,
        stallCategory: stalls.category,
        stallLocation: stalls.location,
      })
      .from(menuItems)
      .innerJoin(stalls, eq(menuItems.stallId, stalls.id))
      .where(eq(menuItems.id, id));

    return rows[0];
  }

  async create(input: CreateMenuItemInput) {
    const db = await getDb();

    await db
      .insert(menuItems)
      .values({
        stallId: input.stallId,
        name: input.name,
        price: input.price,
        isAvailable: input.isAvailable,
      });

    // Ambil data kembali setelah insert.
    const rows = await db
      .select({
        id: menuItems.id,
        stallId: menuItems.stallId,
        name: menuItems.name,
        price: menuItems.price,
        isAvailable: menuItems.isAvailable,
        stallName: stalls.name,
        stallCategory: stalls.category,
        stallLocation: stalls.location,
      })
      .from(menuItems)
      .innerJoin(stalls, eq(menuItems.stallId, stalls.id))
      .where(eq(menuItems.stallId, input.stallId))
      .orderBy(menuItems.id);

    const created = rows
      .filter(
        (row) =>
          row.name === input.name &&
          row.price === input.price &&
          row.isAvailable === input.isAvailable,
      )
      .at(-1);

    return created;
  }

  async update(
    id: number,
    input: Partial<CreateMenuItemInput>,
  ) {
    const db = await getDb();

    await db
      .update(menuItems)
      .set({
        ...(input.stallId !== undefined
          ? { stallId: input.stallId }
          : {}),
        ...(input.name !== undefined
          ? { name: input.name }
          : {}),
        ...(input.price !== undefined
          ? { price: input.price }
          : {}),
        ...(input.isAvailable !== undefined
          ? { isAvailable: input.isAvailable }
          : {}),
      })
      .where(eq(menuItems.id, id));

    return this.findById(id);
  }

  async remove(id: number) {
    const db = await getDb();

    const existing = await this.findById(id);

    if (!existing) {
      return undefined;
    }

    await db
      .delete(menuItems)
      .where(eq(menuItems.id, id));

    return existing;
  }

  async findByStallId(stallId: number) {
    const db = await getDb();

    return db
      .select({
        id: menuItems.id,
        stallId: menuItems.stallId,
        name: menuItems.name,
        price: menuItems.price,
        isAvailable: menuItems.isAvailable,
        stallName: stalls.name,
      })
      .from(menuItems)
      .innerJoin(stalls, eq(menuItems.stallId, stalls.id))
      .where(eq(menuItems.stallId, stallId))
      .orderBy(menuItems.id);
  }
}