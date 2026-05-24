import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOCAL_DB_DIR = path.join(__dirname, '../data');

let isOffline = false;

// Simple file-based fallback database interface
export const localDb = {
  isOffline: () => isOffline,
  readTable: (table) => {
    try {
      if (!fs.existsSync(LOCAL_DB_DIR)) {
        fs.mkdirSync(LOCAL_DB_DIR, { recursive: true });
      }
      const filePath = path.join(LOCAL_DB_DIR, `${table}.json`);
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify([]));
        return [];
      }
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error reading local table ${table}:`, error);
      return [];
    }
  },
  writeTable: (table, data) => {
    try {
      if (!fs.existsSync(LOCAL_DB_DIR)) {
        fs.mkdirSync(LOCAL_DB_DIR, { recursive: true });
      }
      const filePath = path.join(LOCAL_DB_DIR, `${table}.json`);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      console.error(`Error writing local table ${table}:`, error);
      return false;
    }
  }
};

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/aiinterview';
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 2000 // 2 seconds timeout for quick fallback
    });
    console.log('🚀 Connected to MongoDB successfully.');
  } catch (error) {
    console.warn('⚠️ MongoDB connection failed. Falling back to lightweight JSON database...');
    isOffline = true;
    // Create data directory for JSON storage
    if (!fs.existsSync(LOCAL_DB_DIR)) {
      fs.mkdirSync(LOCAL_DB_DIR, { recursive: true });
    }
  }
};

export default connectDB;
