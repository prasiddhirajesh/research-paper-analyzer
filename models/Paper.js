import mongoose from 'mongoose';

const paperSchema = new mongoose.Schema({
  filename: String,
  content: String,
  summary: String,

  chatHistory: [
    {
      role: String,
      message: String,
      timestamp: {
        type: Date,
        default: Date.now
      }
    }
  ],

  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Paper', paperSchema);