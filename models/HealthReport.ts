import mongoose from 'mongoose';

const HealthReportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  healthScore: {
    type: Number,
    required: true
  },
  bmi: {
    type: Number
  },
  activityLevel: {
    type: String
  },
  riskLevel: {
    type: String
  },
  predictions: [{
    title: String,
    prediction: String,
    recommendation: String,
    timeframe: String
  }],
  vitalsTrends: {
    bloodPressure: mongoose.Schema.Types.Mixed,
    heartRate: mongoose.Schema.Types.Mixed,
    temperature: mongoose.Schema.Types.Mixed,
    respiratoryRate: mongoose.Schema.Types.Mixed
  },
  activityTrends: {
    steps: mongoose.Schema.Types.Mixed,
    distance: mongoose.Schema.Types.Mixed,
    activeMinutes: mongoose.Schema.Types.Mixed,
    caloriesBurned: mongoose.Schema.Types.Mixed
  },
  nutritionTrends: {
    calories: mongoose.Schema.Types.Mixed,
    protein: mongoose.Schema.Types.Mixed,
    carbs: mongoose.Schema.Types.Mixed,
    fats: mongoose.Schema.Types.Mixed
  },
  generatedAt: {
    type: Date,
    default: Date.now
  },
  pdfUrl: {
    type: String
  }
}, {
  timestamps: true
});

// Create compound index for userId + generatedAt for efficient queries
HealthReportSchema.index({ userId: 1, generatedAt: -1 });

const HealthReport = mongoose.models.HealthReport || 
  mongoose.model('HealthReport', HealthReportSchema);

export default HealthReport;
