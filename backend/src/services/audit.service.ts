import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  log(data: {
    performedBy: string;
    action: string;
    targetUser: string;
    changes?: any;
  }) {
    // Exemplo: log no console, futuramente posso também salvar no banco ou enviar pra um sistema de log externo
    this.logger.log(`[AUDIT] ${data.performedBy} -> ${data.action} -> ${data.targetUser}`);
    if (data.changes) {
      this.logger.debug(`Changes: ${JSON.stringify(data.changes)}`);
    }
  }
}