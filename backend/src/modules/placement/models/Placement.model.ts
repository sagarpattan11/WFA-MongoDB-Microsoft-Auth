import { Document, Schema, model } from 'mongoose';

export interface IPlacement extends Document {
  candidateId: string;
  candidateName: string;
  email: string;
  department: string;
  skillDomain: string;
  targetRole: string;
  location: string;
  offeredSalary: number;
  status: 'in-training' | 'interviewing' | 'placed' | 'retained' | 'opted-out';
  placementDate?: Date;
  placementDurationDays: number;
  employerName: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PlacementSchema = new Schema<IPlacement>(
  {
    candidateId: { type: String, required: true, unique: true, trim: true },
    candidateName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    department: { type: String, required: true, trim: true },
    skillDomain: { type: String, required: true, trim: true },
    targetRole: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    offeredSalary: { type: Number, required: true, default: 75000 },
    status: {
      type: String,
      enum: ['in-training', 'interviewing', 'placed', 'retained', 'opted-out'],
      default: 'in-training',
    },
    placementDate: { type: Date },
    placementDurationDays: { type: Number, default: 45 },
    employerName: { type: String, required: true, default: 'Workforce Enterprise Inc.' },
    notes: { type: String },
  },
  { timestamps: true }
);

PlacementSchema.index({ candidateId: 1 }, { unique: true });
PlacementSchema.index({ status: 1, department: 1 });

export const PlacementModel = model<IPlacement>('Placement', PlacementSchema);
