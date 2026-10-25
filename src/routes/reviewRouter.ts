import { Router } from 'express';
import { ReviewController } from '../controllers/reviewControllers.ts';

const reviewRouter = Router();

const reviewController = new ReviewController();

reviewRouter.get('/', (req, res) => {
  // #swagger.responses[200] = { description: 'Daftar review dengan data user' }

  return reviewController.getReviews(req, res);
});

reviewRouter.get('/:id', (req, res) => {
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }

  // #swagger.responses[200] = { description: 'Detail review dengan data user' }
  // #swagger.responses[404] = { description: 'Review tidak ditemukan' }

  return reviewController.getReviewById(req, res);
});

reviewRouter.post('/', (req, res) => {
  // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/ReviewInput' } }

  // #swagger.responses[201] = { description: 'Review berhasil dibuat' }
  // #swagger.responses[400] = { description: 'Data review tidak valid' }

  return reviewController.createReview(req, res);
});

reviewRouter.delete('/:id', (req, res) => {
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }

  // #swagger.responses[200] = { description: 'Review berhasil dihapus' }
  // #swagger.responses[404] = { description: 'Review tidak ditemukan' }

  return reviewController.deleteReview(req, res);
});

export { reviewRouter };