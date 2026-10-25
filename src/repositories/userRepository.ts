import { eq } from 'drizzle-orm';
import { getDb } from '../db/index.ts';
import { users } from '../db/schema.ts';

export type UserRole = 'admin' | 'owner' | 'customer';

export interface CreateUserInput {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
}

export class UserRepository {
  // Mengambil seluruh pengguna tanpa menampilkan password hash.
  async findAll() {
    const db = await getDb();

    return db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
      })
      .from(users)
      .orderBy(users.id);
  }

  // Mencari pengguna berdasarkan email.
  // passwordHash disertakan untuk pemeriksaan saat login.
  async findByEmail(email: string) {
    const db = await getDb();
    const result = await db
        .select({
        id: users.id,
        name: users.name,
        email: users.email,
        passwordHash: users.passwordHash,
        role: users.role,
  })
  .from(users)
  .where(eq(users.email, email))
  .orderBy(users.id)
  .offset(0)
  .fetch(1);
    return result[0] ?? null;
  }

  // Membuat pengguna baru, lalu mengambil data pengguna yang dibuat.
  async create(input: CreateUserInput) {
    const db = await getDb();

    await db
      .insert(users)
      .values({
        name: input.name,
        email: input.email,
        passwordHash: input.passwordHash,
        role: input.role,
      });

    const user = await this.findByEmail(input.email);

    if (!user) {
      throw new Error('Pengguna gagal dibuat');
    }

    // Jangan mengembalikan password hash kepada client.
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }
}