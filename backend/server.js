import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Import routers & middleware
import authMiddleware from './middleware/authMiddleware.js';
import { register, login, getProfile } from './controllers/authController.js';
import { createQuiz, submitQuiz, getQuizHistory } from './controllers/quizController.js';
import { startInterview, submitMessage, getInterviewHistory, getInterviewDetails } from './controllers/interviewController.js';
import { parseResume, upload } from './controllers/resumeController.js';

// Initialize configuration
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON parsing
app.use(cors({
  origin: '*', // Allow all origins for local deployment testing
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-gemini-key']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to Database (with offline JSON fallback)
connectDB();

// ---------------- API ROUTES ----------------

// Base API Welcoming Root
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'PrepAI API Service',
    description: 'Premium AI Interview Coaching Platform Backend Service',
    status: 'active',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      quiz: '/api/quiz',
      interview: '/api/interview',
      resume: '/api/resume'
    }
  });
});

// Base Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date() });
});

// Authentication Routes
const authRouter = express.Router();
authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.get('/profile', authMiddleware, getProfile);
app.use('/api/auth', authRouter);

// Quiz Routes
const quizRouter = express.Router();
quizRouter.use(authMiddleware);
quizRouter.post('/generate', createQuiz);
quizRouter.post('/:id/submit', submitQuiz);
quizRouter.get('/history', getQuizHistory);
app.use('/api/quiz', quizRouter);

// Interview Routes
const interviewRouter = express.Router();
interviewRouter.use(authMiddleware);
interviewRouter.post('/start', startInterview);
interviewRouter.post('/:id/message', submitMessage);
interviewRouter.get('/history', getInterviewHistory);
interviewRouter.get('/:id', getInterviewDetails);
app.use('/api/interview', interviewRouter);

// Resume Analysis Route
const resumeRouter = express.Router();
resumeRouter.use(authMiddleware);
resumeRouter.post('/analyze', upload.single('resume'), parseResume);
app.use('/api/resume', resumeRouter);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'An unexpected server error occurred.'
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`\n🔥 Server running at http://localhost:${PORT}`);
  console.log(`🩺 Health check active at http://localhost:${PORT}/health\n`);
});
