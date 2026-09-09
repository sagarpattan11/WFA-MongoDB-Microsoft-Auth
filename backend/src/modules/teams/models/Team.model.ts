import { Document, Schema, model, Types } from 'mongoose';

export interface ITeam extends Document {
  _id: Types.ObjectId;
  name: string;
  departmentId: Types.ObjectId;
  leadId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const teamSchema = new Schema<ITeam>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    departmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
      index: true,
    },
    leadId: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const TeamModel = model<ITeam>('Team', teamSchema);
