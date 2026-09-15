import mongoose, { Document, Schema } from 'mongoose';

export type TimeHorizon = '6M' | '12M' | '24M';
export type ForecastScenario = 'baseline' | 'expansion' | 'conservative';

export interface IDemandForecast extends Document {
  department: string;
  targetRole: string;
  timeHorizon: TimeHorizon;
  currentHeadcount: number;
  projectedDemand: number;
  gap: number; // projectedDemand - currentHeadcount
  hiringRequirement: number;
  upskillingRequirement: number;
  criticalSkills: string[];
  shrinkingSkills: string[];
  confidenceScore: number; // 0 - 100 percentage
  scenario: ForecastScenario;
  estimatedHiringBudget: number;
  estimatedUpskillingBudget: number;
  totalBudgetImpact: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DemandForecastSchema = new Schema<IDemandForecast>(
  {
    department: { type: String, required: true, index: true },
    targetRole: { type: String, required: true, index: true },
    timeHorizon: { type: String, enum: ['6M', '12M', '24M'], required: true, index: true },
    currentHeadcount: { type: Number, required: true, min: 0 },
    projectedDemand: { type: Number, required: true, min: 0 },
    gap: { type: Number, required: true },
    hiringRequirement: { type: Number, required: true, default: 0 },
    upskillingRequirement: { type: Number, required: true, default: 0 },
    criticalSkills: { type: [String], default: [] },
    shrinkingSkills: { type: [String], default: [] },
    confidenceScore: { type: Number, required: true, min: 0, max: 100 },
    scenario: { type: String, enum: ['baseline', 'expansion', 'conservative'], default: 'baseline', index: true },
    estimatedHiringBudget: { type: Number, required: true, default: 0 },
    estimatedUpskillingBudget: { type: Number, required: true, default: 0 },
    totalBudgetImpact: { type: Number, required: true, default: 0 },
    notes: { type: String },
  },
  {
    timestamps: true,
  }
);

DemandForecastSchema.index({ department: 1, targetRole: 1, timeHorizon: 1, scenario: 1 }, { unique: true });

export const DemandForecastModel = mongoose.model<IDemandForecast>('DemandForecast', DemandForecastSchema);
