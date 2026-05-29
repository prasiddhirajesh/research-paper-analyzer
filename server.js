import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import uploadRoutes from './routes/upload.js';
import authRoutes from "./routes/auth.js";

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

const app = express();

app.use(express.json());
app.use(cors());

// upload routes
app.use('/api', uploadRoutes);
app.use('/api/auth', authRoutes);

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("MongoDB connected"))
.catch(err => console.log("MongoDB error", err));

// test route
app.get('/', (req, res) => {
  res.send("server is running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});