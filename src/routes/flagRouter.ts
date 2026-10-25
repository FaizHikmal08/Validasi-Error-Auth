import { Router } from 'express';
import { FlagController } from '../controllers/flagControllers.ts';

const flagRouter = Router();

const flagController = new FlagController();

flagRouter.get('/', (req, res) => {
  // #swagger.responses[200] = { description: 'Daftar flag' }

  return flagController.getFlags(req, res);
});

flagRouter.put('/:id', (req, res) => {
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }

  // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/FlagInput' } }

  // #swagger.responses[200] = { description: 'Status flag berhasil diperbarui' }
  // #swagger.responses[400] = { description: 'Status wajib diisi' }
  // #swagger.responses[404] = { description: 'Flag tidak ditemukan' }

  return flagController.updateFlagStatus(req, res);
});

export { flagRouter };