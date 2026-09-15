import { Document, Schema, model } from 'mongoose';

export interface ISkill extends Document {
  name: string;
  category: 'technical' | 'leadership' | 'domain' | 'compliance' | 'soft-skill';
  department: string; // e.g., 'Engineering', 'Data & Analytics', 'Human Resources', 'Sales', 'Product'
  criticality: 'critical' | 'high' | 'medium' | 'low';
  description?: string;
  industryBenchmarkLevel: number; // 1 to 5
  requiredCertifications?: string[];
  recommendedCourses?: {
    courseTitle: string;
    provider: string;
    durationHours: number;
    url?: string;
  }[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SkillSchema = new Schema<ISkill>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    category: {
      type: String,
      enum: ['technical', 'leadership', 'domain', 'compliance', 'soft-skill'],
      required: true,
      default: 'technical',
    },
    department: { type: String, required: true, trim: true },
    criticality: {
      type: String,
      enum: ['critical', 'high', 'medium', 'low'],
      default: 'high',
    },
    description: { type: String },
    industryBenchmarkLevel: { type: Number, required: true, min: 1, max: 5, default: 3 },
    requiredCertifications: [{ type: String, trim: true }],
    recommendedCourses: [
      {
        courseTitle: { type: String, required: true },
        provider: { type: String, required: true },
        durationHours: { type: Number, default: 20 },
        url: { type: String },
      },
    ],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

SkillSchema.index({ category: 1, department: 1 });

export const SkillModel = model<ISkill>('Skill', SkillSchema);
