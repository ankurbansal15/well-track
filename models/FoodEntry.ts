import mongoose from 'mongoose';

const FoodEntrySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true // Add index for faster queries by userId
  },
  food_name: {
    type: String,
    required: true
  },
  calories: {
    type: Number,
    required: true
  },
  protein_g: {
    type: Number,
    required: true
  },
  carbs_g: {
    type: Number,
    required: true
  },
  fats_g: {
    type: Number,
    required: true
  },
  protein_percent: {
    type: Number
  },
  carbs_percent: {
    type: Number
  },
  fats_percent: {
    type: Number
  },
  image_url: {
    type: String
  },
  image_data: {
    type: String // Base64 encoded image data (optional)
  },
  ai_analysis_result: {
    type: String // Raw AI analysis result (optional)
  },
  recorded_at: {
    type: Date,
    default: Date.now,
    index: true // Add index for faster date-based queries
  }
}, {
  timestamps: true // adds createdAt and updatedAt fields
});

// Create compound index for userId + recorded_at for efficient filtering
FoodEntrySchema.index({ userId: 1, recorded_at: -1 });

// Create the FoodEntry model if it doesn't exist already
export const FoodEntry = mongoose.models.FoodEntry || mongoose.model('FoodEntry', FoodEntrySchema);

export default FoodEntry;
