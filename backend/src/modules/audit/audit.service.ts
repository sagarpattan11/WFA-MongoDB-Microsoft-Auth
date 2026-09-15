import { Request } from 'express';
import { AuditAction, AuditLogModel } from './models/AuditLog.model';

export interface LogAuditParams {
  req?: Request;
  actorName?: string;
  actorEmail?: string;
  actorRole?: string;
  action: AuditAction;
  entityType: string;
  entityId?: string;
  description: string;
  metadata?: Record<string, any>;
  status?: 'SUCCESS' | 'FAILURE' | 'WARNING';
}

export const logAuditEvent = async (params: LogAuditParams): Promise<void> => {
  try {
    const sessionUser = (params.req?.session as any)?.user;

    const actorName = params.actorName || sessionUser?.displayName || 'System Administrator';
    const actorEmail = params.actorEmail || sessionUser?.email || 'admin@workforce.internal';
    const actorRole = params.actorRole || sessionUser?.roles?.[0] || 'admin';
    const ipAddress = params.req?.ip || params.req?.socket?.remoteAddress || '127.0.0.1';
    const userAgent = params.req?.headers['user-agent'] || 'Platform Engine';

    await AuditLogModel.create({
      actorName,
      actorEmail,
      actorRole,
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId,
      description: params.description,
      metadata: params.metadata || {},
      ipAddress,
      userAgent,
      status: params.status || 'SUCCESS',
    });
  } catch (error) {
    // Non-blocking: Audit failure should not crash main request pipeline
    console.error('⚠️ Failed to write immutable audit log:', error);
  }
};
