import mongoose from 'mongoose';

export interface IHealthMetrics extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  height: number;
  weight: number;
  age: number;
  gender: string;
  dateOfBirth?: Date;
  email?: string;
  phone?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  activityLevel: string;
  smokingStatus?: string;
  dietType?: string;
  bloodPressure?: string;
  heartRate?: number;
  respiratoryRate?: number;
  temperature?: number;
  sleepDuration?: number;
  stressLevel?: number;
  chronicConditions?: string;
  allergies?: string;
  medications?: string;
  familyHistory?: string;
  surgeries?: string;
  fitnessGoals?: string;
  recordedAt: Date;
}

const HealthMetricsSchema = new mongoose.Schema<IHealthMetrics>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    height: { type: Number, required: true },
    weight: { type: Number, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    dateOfBirth: { type: Date },
    email: { type: String },
    phone: { type: String },
    emergencyContact: { type: String },
    emergencyPhone: { type: String },
    activityLevel: { type: String, required: true },
    smokingStatus: { type: String },
    dietType: { type: String },
    bloodPressure: { type: String },
    heartRate: { type: Number },
    respiratoryRate: { type: Number },
    temperature: { type: Number },
    sleepDuration: { type: Number },
    stressLevel: { type: Number },
    chronicConditions: { type: String },
    allergies: { type: String },
    medications: { type: String },
    familyHistory: { type: String },
    surgeries: { type: String },
    fitnessGoals: { type: String },
    recordedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.HealthMetrics || mongoose.model<IHealthMetrics>('HealthMetrics', HealthMetricsSchema); 