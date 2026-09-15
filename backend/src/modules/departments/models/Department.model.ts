import { Document, Schema, model, Types } from 'mongoose';

export interface IDepartment extends Document {
  _id: Types.ObjectId;
  code: string;
  name: string;
  description?: string;
  managerId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const departmentSchema = new Schema<IDepartment>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      default: '',
    },
    managerId: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const DepartmentModel = model<IDepartment>('Department', departmentSchema);
