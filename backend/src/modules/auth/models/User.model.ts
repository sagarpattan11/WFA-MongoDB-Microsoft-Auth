import { Document, Schema, model, Types } from 'mongoose';

export type UserRole = 'admin' | 'hr' | 'manager' | 'team-lead' | 'employee';

export interface IUser extends Document {
  _id: Types.ObjectId;
  username: string;
  email: string;
  displayName: string;
  roles: UserRole[];
  currentChallenge?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    displayName: {
      type: String,
      required: true,
      trim: true,
    },
    roles: {
      type: [String],
      enum: ['admin', 'hr', 'manager', 'team-lead', 'employee'],
      default: ['employee'],
    },
    currentChallenge: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const UserModel = model<IUser>('User', userSchema);
