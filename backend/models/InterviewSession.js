import mongoose from 'mongoose';

const interviewSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  role: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    required: true
  },
  experienceLevel: {
    type: String,
    required: true
  },
  interviewType: {
    type: String,
    default: 'General'
  },
  messages: [
    {
      sender: { type: String, enum: ['interviewer', 'user'], required: true },
      text: { type: String, required: true },
      timestamp: { type: Date, default: Date.now }
    }
  ],
  generatedQuestions: [{ type: String }],
  currentQuestionIndex: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'completed'],
    default: 'active'
  },
  feedback: {
    score: { type: Number },
    rating: { type: String }, // e.g. "Excellent", "Good", "Needs Improvement"
    summary: { type: String },
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
    recommendations: [{ type: String }]
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  }
});

const InterviewSession = mongoose.models.InterviewSession || mongoose.model('InterviewSession', interviewSessionSchema);
export default InterviewSession;
