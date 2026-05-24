import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { dbHelper } from '../models/dbHelper.js';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey1234567890_ai_interview';

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields (username, email, password) are required.' });
    }

    const existingUser = await dbHelper.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await dbHelper.createUser({
      username,
      email,
      password: hashedPassword
    });

    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'Account created successfully.',
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await dbHelper.findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({
      message: 'Logged in successfully.',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await dbHelper.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User profile not found.' });
    }

    res.status(200).json({
      id: user._id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt
    });
  } catch (error) {
    console.error('Profile fetching error:', error);
    res.status(500).json({ message: 'Server error fetching user profile.' });
  }
};
