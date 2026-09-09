import { Document, Schema, model } from 'mongoose';

export interface IAttendance extends Document {
  employeeId: Schema.Types.ObjectId;
  date: Date;
  status: 'present' | 'absent' | 'on-leave' | 'half-day' | 'remote';
  checkInTime?: Date;
  checkOutTime?: Date;
  workHours: number;
  overtimeHours: number;
  shiftName: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AttendanceSchema = new Schema<IAttendance>(
  {
    employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
    date: { type: Date, required: true },
    status: {
      type: String,
      enum: ['present', 'absent', 'on-leave', 'half-day', 'remote'],
      default: 'present',
    },
    checkInTime: { type: Date },
    checkOutTime: { type: Date },
    workHours: { type: Number, default: 8 },
    overtimeHours: { type: Number, default: 0 },
    shiftName: { type: String, default: 'General Shift (9AM - 6PM)' },
    notes: { type: String },
  },
  { timestamps: true }
);

AttendanceSchema.index({ employeeId: 1, date: 1 });
AttendanceSchema.index({ date: 1, status: 1 });

export const AttendanceModel = model<IAttendance>('Attendance', AttendanceSchema);
