import { Document, Schema, model, Types } from 'mongoose';

export type EmploymentType = 'Full-Time' | 'Part-Time' | 'Contractor' | 'Intern';
export type EmployeeStatus = 'active' | 'on-leave' | 'probation' | 'terminated';
export type WorkLocation = 'Headquarters' | 'Remote' | 'Regional Office' | 'Branch Office';

export interface IEmployee extends Document {
  _id: Types.ObjectId;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  departmentId: Types.ObjectId;
  teamId?: Types.ObjectId;
  jobTitle: string;
  employmentType: EmploymentType;
  status: EmployeeStatus;
  location: WorkLocation;
  hireDate: Date;
  salary?: number;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const employeeSchema = new Schema<IEmployee>(
  {
    employeeId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    phone: {
      type: String,
      default: '',
    },
    departmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
      index: true,
    },
    teamId: {
      type: Schema.Types.ObjectId,
      ref: 'Team',
      default: null,
      index: true,
    },
    jobTitle: {
      type: String,
      required: true,
      trim: true,
    },
    employmentType: {
      type: String,
      enum: ['Full-Time', 'Part-Time', 'Contractor', 'Intern'],
      default: 'Full-Time',
      index: true,
    },
    status: {
      type: String,
      enum: ['active', 'on-leave', 'probation', 'terminated'],
      default: 'active',
      index: true,
    },
    location: {
      type: String,
      enum: ['Headquarters', 'Remote', 'Regional Office', 'Branch Office'],
      default: 'Headquarters',
      index: true,
    },
    hireDate: {
      type: Date,
      default: Date.now,
    },
    salary: {
      type: Number,
      default: 0,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for search & sorting
employeeSchema.index({ firstName: 'text', lastName: 'text', email: 'text', jobTitle: 'text' });

export const EmployeeModel = model<IEmployee>('Employee', employeeSchema);
