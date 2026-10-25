import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
  extendZodWithOpenApi,
} from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import {
  registerSchema,
  loginSchema,
} from "../schemas/authSchema.ts";

import {
  createStallBodySchema,
  idParamSchema,
  stallQuerySchema,
  updateStallSchema,
} from "../schemas/stallSchema.ts";

import { createReviewSchema } from "../schemas/reviewSchema.ts";

// Aktifkan dukungan metadata OpenAPI pada Zod.
extendZodWithOpenApi(z);

const registry = new OpenAPIRegistry();

// ---------------------------------------------------------
// AUTHENTICATION SCHEME
// ---------------------------------------------------------

registry.registerComponent("securitySchemes", "BearerAuth", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
});

// ---------------------------------------------------------
// SCHEMA RESPONSE
// ---------------------------------------------------------

const stallSchema = registry.register(
  "Stall",
  z.object({
    id: z.number().openapi({ example: 1 }),
    ownerId: z.number().openapi({ example: 2 }),
    name: z.string().openapi({ example: "Warung Bu Tini" }),
    category: z
      .string()
      .nullable()
      .openapi({ example: "Kwetiau" }),
    location: z
      .string()
      .nullable()
      .openapi({ example: "Kantin FKIP" }),
    description: z
      .string()
      .nullable()
      .openapi({ example: "Kedai kwetiau goreng & kuah" }),
    avgRating: z.number().openapi({ example: 4.5 }),
    reviewCount: z.number().openapi({ example: 2 }),
    isPopular: z.boolean().openapi({ example: false }),
  }),
);

const menuSchema = registry.register(
  "Menu",
  z.object({
    id: z.number().openapi({ example: 1 }),
    stallId: z.number().openapi({ example: 2 }),
    name: z
      .string()
      .openapi({ example: "Kwetiau Goreng Spesial" }),
    price: z.number().openapi({ example: 15000 }),
    isAvailable: z.boolean().openapi({ example: true }),
  }),
);

const errorSchema = registry.register(
  "ErrorResponse",
  z.object({
    status: z.string().openapi({ example: "fail" }),
    message: z
      .string()
      .openapi({ example: "Validasi gagal" }),
    errors: z
      .array(
        z.object({
          field: z.string(),
          message: z.string(),
        }),
      )
      .optional()
      .openapi({
        example: [
          {
            field: "name",
            message: "name minimal 3 karakter",
          },
        ],
      }),
  }),
);

// ---------------------------------------------------------
// SCHEMA AUTH
// ---------------------------------------------------------

const registerInput = registry.register(
  "RegisterInput",
  registerSchema,
);

const loginInput = registry.register(
  "LoginInput",
  loginSchema,
);

const authUserSchema = registry.register(
  "AuthUser",
  z.object({
    id: z.number(),
    name: z.string(),
    email: z.string(),
    role: z.enum(["admin", "owner", "customer"]),
  }),
);

const registerResponse = registry.register(
  "RegisterResponse",
  z.object({
    status: z.literal("success"),
    message: z.string(),
    data: authUserSchema,
  }),
);

const loginResponse = registry.register(
  "LoginResponse",
  z.object({
    status: z.literal("success"),
    message: z.string(),
    data: z.object({
      user: authUserSchema,
      token: z.string(),
    }),
  }),
);

const authMeResponse = registry.register(
  "AuthMeResponse",
  z.object({
    status: z.literal("success"),
    data: z.object({
      user: authUserSchema,
    }),
  }),
);

// ---------------------------------------------------------
// SCHEMA INPUT
// ---------------------------------------------------------

const stallInput = registry.register(
  "StallInput",
  createStallBodySchema,
);

const stallUpdate = registry.register(
  "StallUpdate",
  updateStallSchema,
);

const reviewInput = registry.register(
  "ReviewInput",
  createReviewSchema,
);

// ---------------------------------------------------------
// SCHEMA RESPONSE WARUNG DAN MENU
// ---------------------------------------------------------

const stallListResponse = registry.register(
  "StallListResponse",
  z.object({
    status: z.literal("success"),
    meta: z.object({
      page: z.number().openapi({ example: 1 }),
      limit: z.number().openapi({ example: 10 }),
      total: z.number().openapi({ example: 10 }),
    }),
    data: z.array(stallSchema),
  }),
);

const stallDetailResponse = registry.register(
  "StallDetailResponse",
  z.object({
    status: z.literal("success"),
    data: stallSchema,
  }),
);

const menuListResponse = registry.register(
  "MenuListResponse",
  z.object({
    status: z.literal("success"),
    data: z.array(menuSchema),
  }),
);

// ---------------------------------------------------------
// GET /health
// ---------------------------------------------------------

registry.registerPath({
  method: "get",
  path: "/health",
  summary: "Cek kesehatan server dan database",
  responses: {
    200: {
      description: "Server dan database terhubung",
      content: {
        "application/json": {
          schema: z.object({
            status: z.literal("success"),
            message: z.string(),
          }),
        },
      },
    },
    500: {
      description: "Kesalahan pada server",
      content: {
        "application/json": {
          schema: errorSchema,
        },
      },
    },
  },
});

// ---------------------------------------------------------
// GET /api/v1/stalls
// ---------------------------------------------------------

registry.registerPath({
  method: "get",
  path: "/api/v1/stalls",
  summary: "Daftar warung",
  description:
    "Daftar warung dengan filter search/category dan pagination.",
  request: {
    query: stallQuerySchema,
  },
  responses: {
    200: {
      description: "Daftar warung dan metadata pagination",
      content: {
        "application/json": {
          schema: stallListResponse,
        },
      },
    },
    400: {
      description: "Query parameter tidak valid",
      content: {
        "application/json": {
          schema: errorSchema,
        },
      },
    },
    500: {
      description: "Kesalahan pada server",
      content: {
        "application/json": {
          schema: errorSchema,
        },
      },
    },
  },
});

// ---------------------------------------------------------
// POST /api/v1/stalls
// Hanya admin dan owner.
// ---------------------------------------------------------

registry.registerPath({
  method: "post",
  path: "/api/v1/stalls",
  summary: "Tambah warung",
  description: "Endpoint untuk admin dan owner yang sudah login.",
  security: [{ BearerAuth: [] }],
  request: {
    body: {
      description: "Data warung baru",
      content: {
        "application/json": {
          schema: stallInput,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Warung berhasil dibuat",
      content: {
        "application/json": {
          schema: stallDetailResponse,
        },
      },
    },
    400: {
      description: "Body tidak valid",
      content: {
        "application/json": {
          schema: errorSchema,
        },
      },
    },
    401: {
      description: "Token tidak ditemukan atau tidak valid",
      content: {
        "application/json": {
          schema: errorSchema,
        },
      },
    },
    403: {
      description: "Role tidak memiliki izin",
      content: {
        "application/json": {
          schema: errorSchema,
        },
      },
    },
    500: {
      description: "Kesalahan pada server",
      content: {
        "application/json": {
          schema: errorSchema,
        },
      },
    },
  },
});

// ---------------------------------------------------------
// GET /api/v1/stalls/{id}
// ---------------------------------------------------------

registry.registerPath({
  method: "get",
  path: "/api/v1/stalls/{id}",
  summary: "Detail warung",
  request: {
    params: idParamSchema,
  },
  responses: {
    200: {
      description: "Detail warung",
      content: {
        "application/json": {
          schema: stallDetailResponse,
        },
      },
    },
    400: {
      description: "Parameter ID tidak valid",
      content: {
        "application/json": {
          schema: errorSchema,
        },
      },
    },
    404: {
      description: "Warung tidak ditemukan",
      content: {
        "application/json": {
          schema: errorSchema,
        },
      },
    },
    500: {
      description: "Kesalahan pada server",
      content: {
        "application/json": {
          schema: errorSchema,
        },
      },
    },
  },
});

// ---------------------------------------------------------
// PUT /api/v1/stalls/{id}
// Admin atau owner pemilik warung.
// ---------------------------------------------------------

registry.registerPath({
  method: "put",
  path: "/api/v1/stalls/{id}",
  summary: "Update warung",
  description:
    "Admin dapat mengubah warung mana pun. Owner hanya dapat mengubah warung miliknya.",
  security: [{ BearerAuth: [] }],
  request: {
    params: idParamSchema,
    body: {
      description: "Data warung yang diubah (parsial)",
      content: {
        "application/json": {
          schema: stallUpdate,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Warung berhasil diperbarui",
      content: {
        "application/json": {
          schema: stallDetailResponse,
        },
      },
    },
    400: {
      description: "Body atau parameter tidak valid",
      content: {
        "application/json": {
          schema: errorSchema,
        },
      },
    },
    401: {
      description: "Token tidak ditemukan atau tidak valid",
      content: {
        "application/json": {
          schema: errorSchema,
        },
      },
    },
    403: {
      description: "Tidak memiliki izin mengubah warung ini",
      content: {
        "application/json": {
          schema: errorSchema,
        },
      },
    },
    404: {
      description: "Warung tidak ditemukan",
      content: {
        "application/json": {
          schema: errorSchema,
        },
      },
    },
    500: {
      description: "Kesalahan pada server",
      content: {
        "application/json": {
          schema: errorSchema,
        },
      },
    },
  },
});

// ---------------------------------------------------------
// DELETE /api/v1/stalls/{id}
// Hanya admin.
// ---------------------------------------------------------

registry.registerPath({
  method: "delete",
  path: "/api/v1/stalls/{id}",
  summary: "Hapus warung",
  description: "Hanya admin yang boleh menghapus warung.",
  security: [{ BearerAuth: [] }],
  request: {
    params: idParamSchema,
  },
  responses: {
    200: {
      description: "Warung berhasil dihapus",
      content: {
        "application/json": {
          schema: stallDetailResponse,
        },
      },
    },
    401: {
      description: "Token tidak ditemukan atau tidak valid",
      content: {
        "application/json": {
          schema: errorSchema,
        },
      },
    },
    403: {
      description: "Hanya admin yang boleh menghapus warung",
      content: {
        "application/json": {
          schema: errorSchema,
        },
      },
    },
    404: {
      description: "Warung tidak ditemukan",
      content: {
        "application/json": {
          schema: errorSchema,
        },
      },
    },
    500: {
      description: "Kesalahan pada server",
      content: {
        "application/json": {
          schema: errorSchema,
        },
      },
    },
  },
});

// ---------------------------------------------------------
// GET /api/v1/stalls/{id}/menus
// ---------------------------------------------------------

registry.registerPath({
  method: "get",
  path: "/api/v1/stalls/{id}/menus",
  summary: "Daftar menu warung",
  request: {
    params: idParamSchema,
  },
  responses: {
    200: {
      description: "Daftar menu warung",
      content: {
        "application/json": {
          schema: menuListResponse,
        },
      },
    },
    400: {
      description: "Parameter ID tidak valid",
      content: {
        "application/json": {
          schema: errorSchema,
        },
      },
    },
    404: {
      description: "Warung tidak ditemukan",
      content: {
        "application/json": {
          schema: errorSchema,
        },
      },
    },
    500: {
      description: "Kesalahan pada server",
      content: {
        "application/json": {
          schema: errorSchema,
        },
      },
    },
  },
});

// ---------------------------------------------------------
// POST /api/v1/stalls/{id}/reviews
// Semua role yang sudah login.
// ---------------------------------------------------------

registry.registerPath({
  method: "post",
  path: "/api/v1/stalls/{id}/reviews",
  summary: "Tambah review warung",
  description:
    "Semua role yang sudah login dapat menambahkan review. userId diambil dari JWT.",
  security: [{ BearerAuth: [] }],
  request: {
    params: idParamSchema,
    body: {
      description: "Rating dan komentar review",
      content: {
        "application/json": {
          schema: reviewInput,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Review berhasil dibuat",
    },
    400: {
      description: "Parameter atau body tidak valid",
      content: {
        "application/json": {
          schema: errorSchema,
        },
      },
    },
    401: {
      description: "Token tidak tersedia atau tidak valid",
      content: {
        "application/json": {
          schema: errorSchema,
        },
      },
    },
    404: {
      description: "Warung tidak ditemukan",
      content: {
        "application/json": {
          schema: errorSchema,
        },
      },
    },
    500: {
      description: "Kesalahan pada server",
      content: {
        "application/json": {
          schema: errorSchema,
        },
      },
    },
  },
});

// ---------------------------------------------------------
// POST /auth/register
// ---------------------------------------------------------

registry.registerPath({
  method: "post",
  path: "/auth/register",
  summary: "Registrasi pengguna",
  request: {
    body: {
      description: "Data akun baru",
      content: {
        "application/json": {
          schema: registerInput,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Registrasi berhasil",
      content: {
        "application/json": {
          schema: registerResponse,
        },
      },
    },
    400: {
      description: "Input tidak valid",
      content: {
        "application/json": {
          schema: errorSchema,
        },
      },
    },
    409: {
      description: "Email sudah terdaftar",
      content: {
        "application/json": {
          schema: errorSchema,
        },
      },
    },
    500: {
      description: "Kesalahan pada server",
      content: {
        "application/json": {
          schema: errorSchema,
        },
      },
    },
  },
});

// ---------------------------------------------------------
// POST /auth/login
// ---------------------------------------------------------

registry.registerPath({
  method: "post",
  path: "/auth/login",
  summary: "Login pengguna",
  request: {
    body: {
      description: "Email dan password pengguna",
      content: {
        "application/json": {
          schema: loginInput,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Login berhasil dan JWT diterbitkan",
      content: {
        "application/json": {
          schema: loginResponse,
        },
      },
    },
    400: {
      description: "Input tidak valid",
      content: {
        "application/json": {
          schema: errorSchema,
        },
      },
    },
    401: {
      description: "Email atau password salah",
      content: {
        "application/json": {
          schema: errorSchema,
        },
      },
    },
    500: {
      description: "Kesalahan pada server",
      content: {
        "application/json": {
          schema: errorSchema,
        },
      },
    },
  },
});

// ---------------------------------------------------------
// GET /auth/me
// Membutuhkan JWT.
// ---------------------------------------------------------

registry.registerPath({
  method: "get",
  path: "/auth/me",
  summary: "Profil pengguna yang sedang login",
  security: [{ BearerAuth: [] }],
  responses: {
    200: {
      description: "Identitas pengguna berhasil diambil",
      content: {
        "application/json": {
          schema: authMeResponse,
        },
      },
    },
    401: {
      description: "Token tidak ditemukan atau tidak valid",
      content: {
        "application/json": {
          schema: errorSchema,
        },
      },
    },
  },
});

// ---------------------------------------------------------
// GENERATOR
// Harus berada setelah SELURUH registerPath di atas.
// ---------------------------------------------------------

const generator = new OpenApiGeneratorV3(registry.definitions);

export const openApiDocument = generator.generateDocument({
  openapi: "3.0.0",
  info: {
    title: "Review Kantin API",
    version: "1.0.0",
    description:
      "Dokumentasi OpenAPI 3.0 yang dibangkitkan dari schema Zod.",
  },
  servers: [{ url: "http://localhost:3000" }],
});