import mongoose from 'mongoose';

export interface IHealthGoal extends mongoose.Document {
  _id: string;
  user: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  targetDate?: Date;
  category: string;
  targetValue?: number;
  currentValue?: number;
  unit?: string;
  completed: boolean;
  progress?: number;
}

const HealthGoalSchema = new mongoose.Schema<IHealthGoal>(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User',
      required: true 
    },
    title: { 
      type: String, 
      required: true 
    },
    description: { 
      type: String 
    },
    targetDate: { 
      type: Date 
    },
    category: { 
      type: String, 
      required: true,
      enum: ['weight', 'exercise', 'nutrition', 'sleep', 'hydration', 'other']
    },
    targetValue: { 
      type: Number 
    },
    currentValue: { 
      type: Number 
    },
    unit: { 
      type: String 
    },
    completed: { 
      type: Boolean, 
      default: false 
    },
    progress: { 
      type: Number,
      min: 0,
      max: 100,
      default: 0
    }
  },
  { timestamps: true }
);

export default mongoose.models.HealthGoal || mongoose.model<IHealthGoal>('HealthGoal', HealthGoalSchema);
