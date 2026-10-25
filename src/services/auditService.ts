import {
  AuditRepository,
  type CreateAuditInput,
} from '../repositories/auditRepository.ts';

export class AuditService {
  private auditRepository: AuditRepository;

  constructor(
    auditRepository: AuditRepository = new AuditRepository(),
  ) {
    this.auditRepository = auditRepository;
  }

  async getAllAudits() {
    return this.auditRepository.findAll();
  }

  async createAudit(input: CreateAuditInput) {
    return this.auditRepository.create(input);
  }
}