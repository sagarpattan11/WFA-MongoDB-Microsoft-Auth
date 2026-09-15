import { Document, Schema, model } from 'mongoose';

export interface IPerformance extends Document {
  employeeId: Schema.Types.ObjectId;
  reviewCycle: string; // e.g. '2026-Q1', '2026-Annual'
  reviewerId?: Schema.Types.ObjectId;
  performanceScore: number; // 1.0 to 5.0
  goalCompletionRate: number; // 0 to 100%
  strengths: string[];
  areasOfImprovement: string[];
  promotionReadiness: 'ready-now' | 'ready-in-1-year' | 'not-ready' | 'needs-development';
  feedbackNotes?: string;
  evaluatedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PerformanceSchema = new Schema<IPerformance>(
  {
    employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
    reviewCycle: { type: String, required: true, trim: true },
    reviewerId: { type: Schema.Types.ObjectId, ref: 'User' },
    performanceScore: { type: Number, required: true, min: 1, max: 5, default: 3.5 },
    goalCompletionRate: { type: Number, required: true, min: 0, max: 100, default: 85 },
    strengths: [{ type: String }],
    areasOfImprovement: [{ type: String }],
    promotionReadiness: {
      type: String,
      enum: ['ready-now', 'ready-in-1-year', 'not-ready', 'needs-development'],
      default: 'ready-in-1-year',
    },
    feedbackNotes: { type: String },
    evaluatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

PerformanceSchema.index({ employeeId: 1, reviewCycle: 1 });
PerformanceSchema.index({ performanceScore: 1 });

export const PerformanceModel = model<IPerformance>('Performance', PerformanceSchema);
