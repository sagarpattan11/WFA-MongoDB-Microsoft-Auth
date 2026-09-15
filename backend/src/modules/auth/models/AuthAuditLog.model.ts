import { Document, Schema, model, Types } from 'mongoose';

export type AuthAction =
  | 'register_challenge'
  | 'register_success'
  | 'register_failure'
  | 'login_challenge'
  | 'login_success'
  | 'login_failure'
  | 'logout'
  | 'credential_rename'
  | 'credential_revoke';

export interface IAuthAuditLog extends Document {
  _id: Types.ObjectId;
  userId?: Types.ObjectId;
  username?: string;
  action: AuthAction;
  success: boolean;
  ipAddress: string;
  userAgent: string;
  failureReason?: string;
  timestamp: Date;
}

const authAuditLogSchema = new Schema<IAuthAuditLog>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    username: {
      type: String,
      default: null,
      index: true,
    },
    action: {
      type: String,
      required: true,
      index: true,
    },
    success: {
      type: Boolean,
      required: true,
      index: true,
    },
    ipAddress: {
      type: String,
      required: true,
      default: '127.0.0.1',
    },
    userAgent: {
      type: String,
      required: true,
      default: 'Unknown',
    },
    failureReason: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: { createdAt: 'timestamp', updatedAt: false },
  }
);

export const AuthAuditLogModel = model<IAuthAuditLog>('AuthAuditLog', authAuditLogSchema);
