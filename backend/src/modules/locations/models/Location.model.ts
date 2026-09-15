import { Document, Schema, model } from 'mongoose';

export interface ILocation extends Document {
  name: string;
  code: string;
  city: string;
  state?: string;
  country: string;
  address?: string;
  timezone: string;
  capacity: number;
  currentHeadcount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const LocationSchema = new Schema<ILocation>(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, trim: true },
    country: { type: String, required: true, trim: true },
    address: { type: String },
    timezone: { type: String, default: 'UTC' },
    capacity: { type: Number, required: true, default: 100 },
    currentHeadcount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

LocationSchema.index({ city: 1, country: 1 });

export const LocationModel = model<ILocation>(
  'Location',
  LocationSchema
);
