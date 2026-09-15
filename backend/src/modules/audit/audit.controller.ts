import { Request, Response } from 'express';
import { sendError, sendSuccess } from '../../utils/api-response';
import { AuditLogModel } from './models/AuditLog.model';

export const getAuditLogsHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit as string) || 15));
    const skip = (page - 1) * limit;

    const { search, action, actorRole, status } = req.query;

    const filter: Record<string, unknown> = {};
    if (action && typeof action === 'string') filter.action = action;
    if (actorRole && typeof actorRole === 'string') filter.actorRole = actorRole;
    if (status && typeof status === 'string') filter.status = status;

    if (search && typeof search === 'string' && search.trim().length > 0) {
      const reg = new RegExp(search.trim(), 'i');
      filter.$or = [
        { actorName: reg },
        { actorEmail: reg },
        { description: reg },
        { entityType: reg },
        { ipAddress: reg },
      ];
    }

    const [logs, total] = await Promise.all([
      AuditLogModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      AuditLogModel.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    sendSuccess(res, {
      logs,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    sendError(res, error instanceof Error ? error.message : 'Failed to retrieve audit logs', 500);
  }
};
