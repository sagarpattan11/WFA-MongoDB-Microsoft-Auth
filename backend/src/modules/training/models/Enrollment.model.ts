import { Document, Schema, model, Types } from 'mongoose';

export type EnrollmentStatus = 'enrolled' | 'in-progress' | 'completed' | 'dropped';

export interface IEnrollment extends Document {
  _id: Types.ObjectId;
  employeeId: Types.ObjectId;
  employeeName: string;
  department: string;
  courseId: Types.ObjectId;
  courseTitle: string;
  courseCode: string;
  targetSkillName: string;
  category: 'technical' | 'compliance' | 'leadership' | 'soft-skills';
  enrollmentDate: Date;
  completionDate?: Date;
  status: EnrollmentStatus;
  progressPercentage: number; // 0 to 100
  assessmentScore?: number; // 0 to 100
  preAssessmentScore?: number; // 0 to 100
  skillGainPoints?: number; // e.g. +1.5 proficiency gain
  certificateIssued: boolean;
  certificateId?: string;
  feedbackRating?: number; // 1 to 5
  createdAt: Date;
  updatedAt: Date;
}

const EnrollmentSchema = new Schema<IEnrollment>(
  {
    employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true, index: true },
    employeeName: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true, index: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Training', required: true, index: true },
    courseTitle: { type: String, required: true, trim: true },
    courseCode: { type: String, required: true, trim: true },
    targetSkillName: { type: String, required: true, trim: true, index: true },
    category: {
      type: String,
      enum: ['technical', 'compliance', 'leadership', 'soft-skills'],
      default: 'technical',
    },
    enrollmentDate: { type: Date, default: Date.now },
    completionDate: { type: Date },
    status: {
      type: String,
      enum: ['enrolled', 'in-progress', 'completed', 'dropped'],
      default: 'in-progress',
      index: true,
    },
    progressPercentage: { type: Number, default: 0, min: 0, max: 100 },
    assessmentScore: { type: Number, min: 0, max: 100 },
    preAssessmentScore: { type: Number, min: 0, max: 100 },
    skillGainPoints: { type: Number, default: 0 },
    certificateIssued: { type: Boolean, default: false },
    certificateId: { type: String },
    feedbackRating: { type: Number, min: 1, max: 5 },
  },
  { timestamps: true }
);

EnrollmentSchema.index({ employeeId: 1, courseId: 1 }, { unique: true });
EnrollmentSchema.index({ status: 1, department: 1 });

export const EnrollmentModel = model<IEnrollment>('Enrollment', EnrollmentSchema);
