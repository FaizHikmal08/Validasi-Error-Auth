import { Router } from 'express';
import { AuditController } from '../controllers/auditControllers.ts';

const auditRouter = Router();

const auditController = new AuditController();

auditRouter.get('/', (req, res) => {
  // #swagger.responses[200] = { description: 'Daftar audit log' }

  return auditController.getAudits(req, res);
});

auditRouter.post('/', (req, res) => {
  // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/AuditInput' } }

  // #swagger.responses[201] = { description: 'Audit log berhasil dibuat' }
  // #swagger.responses[400] = { description: 'Data audit tidak valid' }

  return auditController.createAudit(req, res);
});

export { auditRouter };