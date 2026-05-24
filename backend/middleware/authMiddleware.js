import jwt from 'jsonwebtoken';

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token required. Please sign in.' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Malformed authorization token.' });
    }

    const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey1234567890_ai_interview';
    const decoded = jwt.verify(token, JWT_SECRET);
    
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ message: 'Invalid or expired authorization token.' });
  }
};

export default authMiddleware;
