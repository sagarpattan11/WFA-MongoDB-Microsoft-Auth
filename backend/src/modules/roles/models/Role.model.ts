import { Document, Schema, model } from 'mongoose';

export interface IRole extends Document {
  title: string;
  code: string;
  departmentId: Schema.Types.ObjectId;
  level: 'entry' | 'mid' | 'senior' | 'lead' | 'executive';
  minSalary?: number;
  maxSalary?: number;
  requiredSkills: {
    skillName: string;
    minimumProficiency: number; // 1 to 5
    criticality: 'must-have' | 'good-to-have';
  }[];
  description?: string;
  openPositionsCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RoleSchema = new Schema<IRole>(
  {
    title: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    departmentId: { type: Schema.Types.ObjectId, ref: 'Department', required: true },
    level: {
      type: String,
      enum: ['entry', 'mid', 'senior', 'lead', 'executive'],
      default: 'mid',
    },
    minSalary: { type: Number },
    maxSalary: { type: Number },
    requiredSkills: [
      {
        skillName: { type: String, required: true },
        minimumProficiency: { type: Number, required: true, min: 1, max: 5 },
        criticality: { type: String, enum: ['must-have', 'good-to-have'], default: 'must-have' },
      },
    ],
    description: { type: String },
    openPositionsCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

RoleSchema.index({ departmentId: 1, isActive: 1 });

export const RoleModel = model<IRole>('Role', RoleSchema);
