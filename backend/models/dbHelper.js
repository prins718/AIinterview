import User from './User.js';
import Quiz from './Quiz.js';
import InterviewSession from './InterviewSession.js';
import { localDb } from '../config/db.js';

// Utility to generate dynamic object IDs for offline use if mongoose is not connected
const generateOfflineId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const dbHelper = {
  // USER OPERATIONS
  findUserByEmail: async (email) => {
    if (!localDb.isOffline()) {
      return await User.findOne({ email: email.toLowerCase() });
    } else {
      const users = localDb.readTable('users');
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      return user || null;
    }
  },

  findUserById: async (id) => {
    if (!localDb.isOffline()) {
      return await User.findById(id);
    } else {
      const users = localDb.readTable('users');
      const user = users.find(u => u._id === id);
      return user || null;
    }
  },

  createUser: async (userData) => {
    if (!localDb.isOffline()) {
      const user = new User({
        username: userData.username,
        email: userData.email.toLowerCase(),
        password: userData.password
      });
      return await user.save();
    } else {
      const users = localDb.readTable('users');
      const newUser = {
        _id: generateOfflineId(),
        username: userData.username,
        email: userData.email.toLowerCase(),
        password: userData.password,
        createdAt: new Date().toISOString()
      };
      users.push(newUser);
      localDb.writeTable('users', users);
      return newUser;
    }
  },

  // QUIZ OPERATIONS
  createQuiz: async (quizData) => {
    if (!localDb.isOffline()) {
      const quiz = new Quiz(quizData);
      return await quiz.save();
    } else {
      const quizzes = localDb.readTable('quizzes');
      const newQuiz = {
        _id: generateOfflineId(),
        ...quizData,
        score: quizData.score || 0,
        completed: quizData.completed || false,
        createdAt: new Date().toISOString()
      };
      quizzes.push(newQuiz);
      localDb.writeTable('quizzes', quizzes);
      return newQuiz;
    }
  },

  findQuizById: async (id) => {
    if (!localDb.isOffline()) {
      return await Quiz.findById(id);
    } else {
      const quizzes = localDb.readTable('quizzes');
      const quiz = quizzes.find(q => q._id === id);
      return quiz || null;
    }
  },

  updateQuiz: async (id, updateData) => {
    if (!localDb.isOffline()) {
      return await Quiz.findByIdAndUpdate(id, updateData, { new: true });
    } else {
      const quizzes = localDb.readTable('quizzes');
      const index = quizzes.findIndex(q => q._id === id);
      if (index !== -1) {
        quizzes[index] = { ...quizzes[index], ...updateData };
        localDb.writeTable('quizzes', quizzes);
        return quizzes[index];
      }
      return null;
    }
  },

  findQuizzesByUser: async (userId) => {
    if (!localDb.isOffline()) {
      return await Quiz.find({ userId }).sort({ createdAt: -1 });
    } else {
      const quizzes = localDb.readTable('quizzes');
      return quizzes
        .filter(q => q.userId === userId)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  },

  // INTERVIEW OPERATIONS
  createInterview: async (interviewData) => {
    if (!localDb.isOffline()) {
      const session = new InterviewSession(interviewData);
      return await session.save();
    } else {
      const sessions = localDb.readTable('interviews');
      const newSession = {
        _id: generateOfflineId(),
        ...interviewData,
        messages: interviewData.messages || [],
        status: interviewData.status || 'active',
        createdAt: new Date().toISOString()
      };
      sessions.push(newSession);
      localDb.writeTable('interviews', sessions);
      return newSession;
    }
  },

  findInterviewById: async (id) => {
    if (!localDb.isOffline()) {
      return await InterviewSession.findById(id);
    } else {
      const sessions = localDb.readTable('interviews');
      const session = sessions.find(s => s._id === id);
      return session || null;
    }
  },

  updateInterview: async (id, updateData) => {
    if (!localDb.isOffline()) {
      return await InterviewSession.findByIdAndUpdate(id, updateData, { new: true });
    } else {
      const sessions = localDb.readTable('interviews');
      const index = sessions.findIndex(s => s._id === id);
      if (index !== -1) {
        sessions[index] = { ...sessions[index], ...updateData };
        localDb.writeTable('interviews', sessions);
        return sessions[index];
      }
      return null;
    }
  },

  findInterviewsByUser: async (userId) => {
    if (!localDb.isOffline()) {
      return await InterviewSession.find({ userId }).sort({ createdAt: -1 });
    } else {
      const sessions = localDb.readTable('interviews');
      return sessions
        .filter(s => s.userId === userId)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  }
};
