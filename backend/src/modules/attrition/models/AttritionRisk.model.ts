import mongoose, { Document, Schema } from 'mongoose';

export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';
export type FlightTimeframe = '0-3 Months' | '3-6 Months' | '6-12 Months' | 'Low Risk';

export interface IAttritionDriver {
  factor: string;
  weight: number; // 0 - 100 percentage contribution
  impact: 'low' | 'moderate' | 'high' | 'critical';
  description: string;
}

export interface IAttritionRisk extends Document {
  employeeId: mongoose.Types.ObjectId;
  employeeName: string;
  department: string;
  role: string;
  location: string;
  tenureMonths: number;
  currentSalary: number;
  marketSalaryMedian: number;
  salaryGapPercentage: number;
  performanceScore: number;
  overtimeHoursMonthly: number;
  riskScore: number; // 0 - 100 composite flight risk score
  riskLevel: RiskLevel;
  predictedTimeframe: FlightTimeframe;
  keyDrivers: IAttritionDriver[];
  recommendations: string[];
  replacementCost: number; // estimated financial loss
  retentionCost: number; // estimated cost to retain
  retentionRoi: number; // replacementCost - retentionCost
  lastAssessmentDate: Date;
  status: 'active' | 'mitigating' | 'resolved' | 'departed';
  createdAt: Date;
  updatedAt: Date;
}

const AttritionDriverSchema = new Schema<IAttritionDriver>(
  {
    factor: { type: String, required: true },
    weight: { type: Number, required: true, min: 0, max: 100 },
    impact: { type: String, enum: ['low', 'moderate', 'high', 'critical'], required: true },
    description: { type: String, required: true },
  },
  { _id: false }
);

const AttritionRiskSchema = new Schema<IAttritionRisk>(
  {
    employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true, unique: true, index: true },
    employeeName: { type: String, required: true, index: true },
    department: { type: String, required: true, index: true },
    role: { type: String, required: true },
    location: { type: String, required: true },
    tenureMonths: { type: Number, required: true },
    currentSalary: { type: Number, required: true },
    marketSalaryMedian: { type: Number, required: true },
    salaryGapPercentage: { type: Number, required: true },
    performanceScore: { type: Number, required: true },
    overtimeHoursMonthly: { type: Number, default: 0 },
    riskScore: { type: Number, required: true, min: 0, max: 100, index: true },
    riskLevel: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], required: true, index: true },
    predictedTimeframe: { type: String, enum: ['0-3 Months', '3-6 Months', '6-12 Months', 'Low Risk'], required: true },
    keyDrivers: { type: [AttritionDriverSchema], default: [] },
    recommendations: { type: [String], default: [] },
    replacementCost: { type: Number, required: true },
    retentionCost: { type: Number, required: true },
    retentionRoi: { type: Number, required: true },
    lastAssessmentDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['active', 'mitigating', 'resolved', 'departed'], default: 'active' },
  },
  {
    timestamps: true,
  }
);

export const AttritionRiskModel = mongoose.model<IAttritionRisk>('AttritionRisk', AttritionRiskSchema);
