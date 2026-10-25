import { Router } from "express";

import { StallController } from "../controllers/stallControllers";
import { authenticate } from "../middlewares/authenticate.ts";
import { authorize } from "../middlewares/authorize.ts";
import { validate } from "../middlewares/validate.ts";
import { ReviewController } from "../controllers/reviewControllers";
import { createReviewSchema } from "../schemas/reviewSchema.ts";
import {
  createStallBodySchema,
  idParamSchema,
  stallQuerySchema,
  updateStallSchema,
} from "../schemas/stallSchema.ts";
const stallRouter = Router();
const stallController = new StallController();
const reviewController = new ReviewController();

// Publik: melihat daftar warung.
stallRouter.get(
  "/",
  validate(stallQuerySchema, "query"),
  stallController.getStalls,
);

// Membuat warung: hanya owner dan admin.
stallRouter.post(
  "/",
  authenticate,
  authorize("owner", "admin"),
  validate(createStallBodySchema, "body"),
  stallController.createStall,
);

// Publik: melihat detail warung.
stallRouter.get(
  "/:id",
  validate(idParamSchema, "params"),
  stallController.getStallById,
);

// Mengubah warung: role owner atau admin.
// Kepemilikan warung oleh owner akan diperiksa di service.
stallRouter.put(
  "/:id",
  authenticate,
  authorize("owner", "admin"),
  validate(idParamSchema, "params"),
  validate(updateStallSchema, "body"),
  stallController.updateStall,
);

// Menghapus warung: hanya admin.
stallRouter.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  validate(idParamSchema, "params"),
  stallController.deleteStall,
);

// Publik: melihat menu suatu warung.
stallRouter.get(
  "/:id/menus",
  validate(idParamSchema, "params"),
  stallController.getStallMenus,
);
// Membuat review: semua role yang sudah login diperbolehkan.
stallRouter.post(
  "/:id/reviews",
  authenticate,
  validate(idParamSchema, "params"),
  validate(createReviewSchema, "body"),
  reviewController.createReview,
);
export { stallRouter };