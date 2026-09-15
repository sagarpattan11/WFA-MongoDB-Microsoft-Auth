import { Document, Schema, model, Types } from 'mongoose';

export type CandidateStage = 'applied' | 'shortlisted' | 'interviewing' | 'offered' | 'hired' | 'rejected' | 'withdrawn';
export type SourcingChannel = 'LinkedIn' | 'Referral' | 'Career Portal' | 'Agency' | 'Campus' | 'Direct Outreach';

export interface ICandidateApplication extends Document {
  _id: Types.ObjectId;
  candidateId: string;
  candidateName: string;
  email: string;
  phone?: string;
  requisitionId: string;
  jobTitle: string;
  department: string;
  location: string;
  sourceChannel: SourcingChannel;
  stage: CandidateStage;
  appliedDate: Date;
  shortlistedDate?: Date;
  interviewDate?: Date;
  offerDate?: Date;
  hireDate?: Date;
  rejectionReason?: string;
  offeredSalary?: number;
  acceptedOffer?: boolean;
  interviewScore?: number; // 1 to 10
  timeInPipelineDays: number;
  costToSource: number;
  createdAt: Date;
  updatedAt: Date;
}

const CandidateApplicationSchema = new Schema<ICandidateApplication>(
  {
    candidateId: { type: String, required: true, unique: true, trim: true, index: true },
    candidateName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String },
    requisitionId: { type: String, required: true, uppercase: true, trim: true, index: true },
    jobTitle: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true, index: true },
    location: { type: String, required: true, trim: true },
    sourceChannel: {
      type: String,
      enum: ['LinkedIn', 'Referral', 'Career Portal', 'Agency', 'Campus', 'Direct Outreach'],
      default: 'LinkedIn',
      index: true,
    },
    stage: {
      type: String,
      enum: ['applied', 'shortlisted', 'interviewing', 'offered', 'hired', 'rejected', 'withdrawn'],
      default: 'applied',
      index: true,
    },
    appliedDate: { type: Date, default: Date.now },
    shortlistedDate: { type: Date },
    interviewDate: { type: Date },
    offerDate: { type: Date },
    hireDate: { type: Date },
    rejectionReason: { type: String },
    offeredSalary: { type: Number },
    acceptedOffer: { type: Boolean },
    interviewScore: { type: Number, min: 1, max: 10 },
    timeInPipelineDays: { type: Number, default: 15 },
    costToSource: { type: Number, default: 1200 },
  },
  { timestamps: true }
);

CandidateApplicationSchema.index({ requisitionId: 1, stage: 1 });
CandidateApplicationSchema.index({ department: 1, stage: 1 });

export const CandidateApplicationModel = model<ICandidateApplication>(
  'CandidateApplication',
  CandidateApplicationSchema
);
