import { Document, Schema, model } from 'mongoose';

export interface ITraining extends Document {
  title: string;
  courseCode: string;
  targetSkillId?: Schema.Types.ObjectId;
  targetSkillName: string;
  category: 'technical' | 'compliance' | 'leadership' | 'soft-skills';
  provider: string;
  durationHours: number;
  enrolledCount: number;
  completionRate: number; // 0 to 100%
  averageAssessmentScore: number; // 0 to 100
  status: 'active' | 'archived' | 'upcoming';
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TrainingSchema = new Schema<ITraining>(
  {
    title: { type: String, required: true, trim: true },
    courseCode: { type: String, required: true, unique: true, uppercase: true, trim: true },
    targetSkillId: { type: Schema.Types.ObjectId, ref: 'Skill' },
    targetSkillName: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['technical', 'compliance', 'leadership', 'soft-skills'],
      default: 'technical',
    },
    provider: { type: String, required: true },
    durationHours: { type: Number, required: true, default: 20 },
    enrolledCount: { type: Number, default: 0 },
    completionRate: { type: Number, default: 0, min: 0, max: 100 },
    averageAssessmentScore: { type: Number, default: 0, min: 0, max: 100 },
    status: { type: String, enum: ['active', 'archived', 'upcoming'], default: 'active' },
    description: { type: String },
  },
  { timestamps: true }
);

TrainingSchema.index({ targetSkillName: 1, category: 1 });

export const TrainingModel = model<ITraining>('Training', TrainingSchema);
