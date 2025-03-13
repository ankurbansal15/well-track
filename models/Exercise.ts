import mongoose from 'mongoose';

export interface IExercise extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  category: string;
  sets: number;
  reps: number;
  caloriesBurned: number;
  date: Date;
  imageUrl?: string;
}

const ExerciseSchema = new mongoose.Schema<IExercise>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: { 
      type: String, 
      required: true 
    },
    category: { 
      type: String, 
      default: 'other' 
    },
    sets: { 
      type: Number, 
      required: true 
    },
    reps: { 
      type: Number, 
      required: true 
    },
    caloriesBurned: { 
      type: Number, 
      required: true 
    },
    date: { 
      type: Date, 
      default: Date.now 
    },
    imageUrl: { 
      type: String 
    }
  },
  { timestamps: true }
);

export default mongoose.models.Exercise || mongoose.model<IExercise>('Exercise', ExerciseSchema);
