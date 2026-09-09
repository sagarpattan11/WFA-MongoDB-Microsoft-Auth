import { Document, Schema, model } from 'mongoose';

export interface IRecruitment extends Document {
  requisitionId: string;
  jobTitle: string;
  department: string;
  location: string;
  openPositions: number;
  openDate: Date;
  closeDate?: Date;
  status: 'open' | 'interviewing' | 'offer-extended' | 'filled' | 'cancelled';
  metrics: {
    applicationsCount: number;
    shortlistedCount: number;
    interviewedCount: number;
    offeredCount: number;
    hiredCount: number;
    costPerHire: number;
    timeToHireDays: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const RecruitmentSchema = new Schema<IRecruitment>(
  {
    requisitionId: { type: String, required: true, unique: true, uppercase: true, trim: true },
    jobTitle: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    openPositions: { type: Number, required: true, default: 1 },
    openDate: { type: Date, default: Date.now },
    closeDate: { type: Date },
    status: {
      type: String,
      enum: ['open', 'interviewing', 'offer-extended', 'filled', 'cancelled'],
      default: 'open',
    },
    metrics: {
      applicationsCount: { type: Number, default: 0 },
      shortlistedCount: { type: Number, default: 0 },
      interviewedCount: { type: Number, default: 0 },
      offeredCount: { type: Number, default: 0 },
      hiredCount: { type: Number, default: 0 },
      costPerHire: { type: Number, default: 4500 },
      timeToHireDays: { type: Number, default: 30 },
    },
  },
  { timestamps: true }
);

RecruitmentSchema.index({ status: 1, department: 1 });

export const RecruitmentModel = model<IRecruitment>('Recruitment', RecruitmentSchema);
