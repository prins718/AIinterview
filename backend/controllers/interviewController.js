import { dbHelper } from '../models/dbHelper.js';
import { geminiService } from '../utils/gemini.js';

export const startInterview = async (req, res) => {
  try {
    const { role, difficulty, experienceLevel, resumeText, interviewType } = req.body;
    const customKey = req.headers['x-gemini-key'] || '';

    if (!role || !difficulty || !experienceLevel) {
      return res.status(400).json({ message: 'Role, difficulty, and experience level are required.' });
    }

    const typeOfInterview = interviewType || 'General';

    // 1. Generate targeted interview questions via AI
    const questions = await geminiService.generateInterviewQuestions(
      role,
      difficulty,
      experienceLevel,
      typeOfInterview,
      resumeText,
      customKey
    );

    const firstQuestion = questions[0] || 'Can you tell me about your background and key technical achievements?';

    // 2. Prepare first introductory message
    const introMessage = `Hello! Welcome to your simulated mock technical interview for the "${role}" position (${experienceLevel} level, ${difficulty} focus). Focus Mode: [${typeOfInterview}]. I will be your AI interviewer today. Let's begin with the first question:\n\n${firstQuestion}`;

    // 3. Save session
    const session = await dbHelper.createInterview({
      userId: req.user.id,
      role,
      difficulty,
      experienceLevel,
      interviewType: typeOfInterview,
      generatedQuestions: questions,
      currentQuestionIndex: 0,
      messages: [
        { sender: 'interviewer', text: introMessage, timestamp: new Date() }
      ],
      status: 'active'
    });

    res.status(201).json({
      message: 'Interview session initiated.',
      sessionId: session._id,
      role: session.role,
      difficulty: session.difficulty,
      experienceLevel: session.experienceLevel,
      interviewType: session.interviewType,
      messages: session.messages,
      status: session.status
    });
  } catch (error) {
    console.error('Start interview error:', error);
    res.status(500).json({ message: 'Server error starting interview.' });
  }
};

export const submitMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const sessionId = req.params.id;
    const customKey = req.headers['x-gemini-key'] || '';

    if (!text || text.trim() === '') {
      return res.status(400).json({ message: 'Message text cannot be empty.' });
    }

    const session = await dbHelper.findInterviewById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Interview session not found.' });
    }

    if (session.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'Forbidden. You do not own this session.' });
    }

    if (session.status === 'completed') {
      return res.status(400).json({ message: 'This interview has already completed.' });
    }

    // 1. Push candidate's message
    const updatedMessages = [
      ...session.messages.map(m => m.toObject ? m.toObject() : m),
      { sender: 'user', text, timestamp: new Date() }
    ];

    const nextIndex = session.currentQuestionIndex + 1;
    const totalQuestions = session.generatedQuestions.length;

    if (nextIndex < totalQuestions) {
      // More questions left - progress session
      const nextQuestion = session.generatedQuestions[nextIndex];
      
      const nextSessionState = {
        messages: updatedMessages,
        role: session.role,
        difficulty: session.difficulty,
        experienceLevel: session.experienceLevel,
        interviewType: session.interviewType || 'General',
        nextQuestion: nextQuestion
      };

      // Call AI to respond to answer and prompt next question
      const interviewerMsg = await geminiService.getInterviewTurnResponse(nextSessionState, customKey);

      const finalMessages = [
        ...updatedMessages,
        { sender: 'interviewer', text: interviewerMsg, timestamp: new Date() }
      ];

      const updatedSession = await dbHelper.updateInterview(sessionId, {
        messages: finalMessages,
        currentQuestionIndex: nextIndex
      });

      return res.status(200).json({
        status: 'active',
        messages: updatedSession.messages,
        currentQuestionIndex: updatedSession.currentQuestionIndex
      });
    } else {
      // Interview complete - analyze and grade
      const completionIntro = "Thank you for all your detailed responses. That completes our interactive mock interview. I am generating your evaluation scorecard and feedback summary right now...";
      
      const finishedMessages = [
        ...updatedMessages,
        { sender: 'interviewer', text: completionIntro, timestamp: new Date() }
      ];

      // Update basic status first so we can analyze the fully compiled session
      const intermediateSession = {
        role: session.role,
        difficulty: session.difficulty,
        messages: finishedMessages
      };

      // Call Gemini to generate deep scorecard report
      const feedback = await geminiService.generateInterviewFeedback(intermediateSession, customKey);

      const updatedSession = await dbHelper.updateInterview(sessionId, {
        messages: finishedMessages,
        status: 'completed',
        completedAt: new Date(),
        feedback
      });

      return res.status(200).json({
        status: 'completed',
        messages: updatedSession.messages,
        feedback: updatedSession.feedback
      });
    }
  } catch (error) {
    console.error('Submit interview message error:', error);
    res.status(500).json({ message: 'Server error processing interview message.' });
  }
};

export const getInterviewHistory = async (req, res) => {
  try {
    const history = await dbHelper.findInterviewsByUser(req.user.id);
    res.status(200).json(history);
  } catch (error) {
    console.error('Fetch interview history error:', error);
    res.status(500).json({ message: 'Server error fetching interview history.' });
  }
};

export const getInterviewDetails = async (req, res) => {
  try {
    const sessionId = req.params.id;
    const session = await dbHelper.findInterviewById(sessionId);

    if (!session) {
      return res.status(404).json({ message: 'Interview session not found.' });
    }

    if (session.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'Forbidden. You do not own this session.' });
    }

    res.status(200).json(session);
  } catch (error) {
    console.error('Fetch interview details error:', error);
    res.status(500).json({ message: 'Server error fetching interview details.' });
  }
};
