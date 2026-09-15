import mongoose, { Document, Schema } from 'mongoose';

export type AuditAction =
  | 'AUTH_LOGIN'
  | 'AUTH_LOGOUT'
  | 'PREDICTION_VIEW'
  | 'SCENARIO_SIMULATE'
  | 'REPORT_EXPORT'
  | 'ATTRITION_STATUS_UPDATE'
  | 'EMPLOYEE_CREATE'
  | 'EMPLOYEE_UPDATE'
  | 'ROLE_PERMISSION_CHANGE';

export interface IAuditLog extends Document {
  actorName: string;
  actorEmail: string;
  actorRole: string;
  action: AuditAction;
  entityType: string;
  entityId?: string;
  description: string;
  metadata?: Record<string, any>;
  ipAddress: string;
  userAgent?: string;
  status: 'SUCCESS' | 'FAILURE' | 'WARNING';
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    actorName: { type: String, required: true, index: true },
    actorEmail: { type: String, required: true, index: true },
    actorRole: { type: String, required: true, index: true },
    action: {
      type: String,
      enum: [
        'AUTH_LOGIN',
        'AUTH_LOGOUT',
        'PREDICTION_VIEW',
        'SCENARIO_SIMULATE',
        'REPORT_EXPORT',
        'ATTRITION_STATUS_UPDATE',
        'EMPLOYEE_CREATE',
        'EMPLOYEE_UPDATE',
        'ROLE_PERMISSION_CHANGE',
      ],
      required: true,
      index: true,
    },
    entityType: { type: String, required: true, index: true },
    entityId: { type: String },
    description: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed, default: {} },
    ipAddress: { type: String, default: '127.0.0.1' },
    userAgent: { type: String },
    status: { type: String, enum: ['SUCCESS', 'FAILURE', 'WARNING'], default: 'SUCCESS', index: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // Immutable: no updatedAt
  }
);

AuditLogSchema.index({ createdAt: -1 });

export const AuditLogModel = mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
