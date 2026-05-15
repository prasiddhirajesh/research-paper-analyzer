import mongoose from 'mongoose';

const paperSchema = new mongoose.Schema({
  filename: String,
  content: String,
  summary: String,
  plagiarismReport: String,
  aiConfidence: String,
  humanizedText: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Paper', paperSchema);