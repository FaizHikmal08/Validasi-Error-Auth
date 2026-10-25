import type { Request, Response } from 'express';
import { AuditService } from '../services/auditService.ts';

export class AuditController {
  private auditService: AuditService;

  constructor(
    auditService: AuditService = new AuditService(),
  ) {
    this.auditService = auditService;
  }

  private handleError(
    res: Response,
    error: unknown,
  ): Response {
    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan pada server',
      error:
        error instanceof Error
          ? error.message
          : String(error),
    });
  }

  getAudits = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    try {
      const data = await this.auditService.getAllAudits();

      return res.status(200).json({
        status: 'success',
        data,
      });
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  createAudit = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    try {
      const {
        userId,
        action,
        targetTable,
        targetId,
        metadata,
      } = req.body;

      if (
        userId === undefined ||
        !action ||
        !targetTable ||
        targetId === undefined
      ) {
        return res.status(400).json({
          status: 'fail',
          message:
            'userId, action, targetTable, dan targetId wajib diisi',
        });
      }

      const data =
        await this.auditService.createAudit({
          userId: Number(userId),
          action,
          targetTable,
          targetId: Number(targetId),
          metadata: metadata ?? null,
        });

      return res.status(201).json({
        status: 'success',
        data,
      });
    } catch (error) {
      return this.handleError(res, error);
    }
  };
}