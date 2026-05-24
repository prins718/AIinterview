import { dbHelper } from '../models/dbHelper.js';
import { geminiService } from '../utils/gemini.js';

export const createQuiz = async (req, res) => {
  try {
    const { category, difficulty } = req.body;
    const customKey = req.headers['x-gemini-key'] || '';

    if (!category || !difficulty) {
      return res.status(400).json({ message: 'Category and difficulty are required.' });
    }

    const rawQuestions = await geminiService.generateQuiz(category, difficulty, customKey);

    // Save full quiz in database (with answers)
    const newQuiz = await dbHelper.createQuiz({
      userId: req.user.id,
      category,
      difficulty,
      questions: rawQuestions.map(q => ({
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        selectedAnswer: -1
      }))
    });

    // Strip answers in response to client to prevent inspections cheating
    const cleanQuestions = newQuiz.questions.map(q => ({
      _id: q._id,
      question: q.question,
      options: q.options
    }));

    res.status(201).json({
      message: 'Quiz generated successfully.',
      quizId: newQuiz._id,
      category: newQuiz.category,
      difficulty: newQuiz.difficulty,
      questions: cleanQuestions
    });
  } catch (error) {
    console.error('Quiz creation error:', error);
    res.status(500).json({ message: 'Server error generating quiz.' });
  }
};

export const submitQuiz = async (req, res) => {
  try {
    const { answers } = req.body; // Map of { questionId: selectedIndex } or array
    const quizId = req.params.id;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: 'Answers array is required.' });
    }

    const quiz = await dbHelper.findQuizById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found.' });
    }

    // Verify ownership
    if (quiz.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'Forbidden. You do not own this quiz.' });
    }

    let correctCount = 0;
    const updatedQuestions = quiz.questions.map(q => {
      // Find matching submitted answer by id or index
      const submitted = answers.find(a => a.questionId === q._id.toString());
      const selectedAnswer = submitted ? submitted.selectedAnswer : -1;
      
      if (selectedAnswer === q.correctAnswer) {
        correctCount++;
      }

      return {
        ...q.toObject ? q.toObject() : q,
        selectedAnswer
      };
    });

    const score = Math.round((correctCount / quiz.questions.length) * 100);

    const updatedQuiz = await dbHelper.updateQuiz(quizId, {
      questions: updatedQuestions,
      score,
      completed: true,
      completedAt: new Date()
    });

    res.status(200).json({
      message: 'Quiz submitted successfully.',
      score,
      totalQuestions: quiz.questions.length,
      correctAnswers: correctCount,
      quiz: updatedQuiz
    });
  } catch (error) {
    console.error('Quiz submission error:', error);
    res.status(500).json({ message: 'Server error submitting quiz.' });
  }
};

export const getQuizHistory = async (req, res) => {
  try {
    const history = await dbHelper.findQuizzesByUser(req.user.id);
    res.status(200).json(history);
  } catch (error) {
    console.error('Fetching quiz history error:', error);
    res.status(500).json({ message: 'Server error fetching quiz history.' });
  }
};
