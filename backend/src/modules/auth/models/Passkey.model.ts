import { Document, Schema, model, Types } from 'mongoose';

export interface IPasskey extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  credentialID: string;
  credentialPublicKey: Buffer;
  counter: number;
  credentialDeviceType: string;
  credentialBackedUp: boolean;
  transports: string[];
  friendlyName: string;
  aaguid?: string;
  lastUsedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const passkeySchema = new Schema<IPasskey>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    credentialID: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    credentialPublicKey: {
      type: Buffer,
      required: true,
    },
    counter: {
      type: Number,
      required: true,
      default: 0,
    },
    credentialDeviceType: {
      type: String,
      required: true,
      default: 'singleDevice',
    },
    credentialBackedUp: {
      type: Boolean,
      required: true,
      default: false,
    },
    transports: {
      type: [String],
      default: ['internal'],
    },
    friendlyName: {
      type: String,
      required: true,
      default: 'Passkey Device',
    },
    aaguid: {
      type: String,
      default: null,
    },
    lastUsedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const PasskeyModel = model<IPasskey>('Passkey', passkeySchema);
