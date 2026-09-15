import mongoose, { Document, Schema } from 'mongoose';

export type AlertSeverity = 'critical' | 'warning' | 'info';
export type AlertCategory = 'attrition' | 'capacity' | 'compliance' | 'skill_gap' | 'recruitment';

export interface IWorkforceAlert extends Document {
  title: string;
  severity: AlertSeverity;
  category: AlertCategory;
  message: string;
  department?: string;
  metrics?: Record<string, any>;
  isRead: boolean;
  isResolved: boolean;
  actionUrl?: string;
  actionLabel?: string;
  resolvedAt?: Date;
  resolvedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const WorkforceAlertSchema = new Schema<IWorkforceAlert>(
  {
    title: { type: String, required: true },
    severity: { type: String, enum: ['critical', 'warning', 'info'], required: true, index: true },
    category: { type: String, enum: ['attrition', 'capacity', 'compliance', 'skill_gap', 'recruitment'], required: true, index: true },
    message: { type: String, required: true },
    department: { type: String, index: true },
    metrics: { type: Schema.Types.Mixed, default: {} },
    isRead: { type: Boolean, default: false, index: true },
    isResolved: { type: Boolean, default: false, index: true },
    actionUrl: { type: String },
    actionLabel: { type: String },
    resolvedAt: { type: Date },
    resolvedBy: { type: String },
  },
  {
    timestamps: true,
  }
);

export const WorkforceAlertModel = mongoose.model<IWorkforceAlert>('WorkforceAlert', WorkforceAlertSchema);
