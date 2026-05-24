import multer from 'multer';
import pdfParse from 'pdf-parse';
import { geminiService } from '../utils/gemini.js';

// Multer memory storage configuration
const storage = multer.memoryStorage();
export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // limit to 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.mimetype === 'text/plain') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and TXT files are accepted.'), false);
    }
  }
});

export const parseResume = async (req, res) => {
  try {
    const customKey = req.headers['x-gemini-key'] || '';

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a valid PDF or TXT resume file.' });
    }

    let resumeText = '';

    if (req.file.mimetype === 'application/pdf') {
      try {
        const parsed = await pdfParse(req.file.buffer);
        resumeText = parsed.text || '';
      } catch (pdfErr) {
        console.warn('PDF parsing failed, falling back to buffer-to-string decoding:', pdfErr);
        resumeText = req.file.buffer.toString('utf-8');
      }
    } else {
      // Plain text file
      resumeText = req.file.buffer.toString('utf-8');
    }

    if (resumeText.trim() === '') {
      return res.status(400).json({ message: 'Unable to extract any text content from the uploaded resume.' });
    }

    // Call Gemini (or fallback mock resume analyzer)
    const analysis = await geminiService.analyzeResume(resumeText, customKey);

    // Also pre-generate 3 targeted interview questions based on the parsed resume
    const inferredRole = analysis.inferredRole || 'Software Engineer';
    const customQuestions = await geminiService.generateInterviewQuestions(
      inferredRole,
      'Medium',
      'Experienced',
      'Resume-Based',
      resumeText,
      customKey
    );

    res.status(200).json({
      message: 'Resume analyzed successfully.',
      analysis: {
        ...analysis,
        customQuestions: customQuestions.slice(0, 3) // Return 3 questions
      },
      rawTextLength: resumeText.length
    });
  } catch (error) {
    console.error('Resume upload/parse error:', error);
    res.status(500).json({ message: 'Server error processing your resume upload.' });
  }
};
