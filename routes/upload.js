import express from 'express';
import multer from 'multer';
import fs from 'fs';
import { createRequire } from 'module';
import { GoogleGenerativeAI } from "@google/generative-ai";
import Paper from '../models/Paper.js';

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');
const router = express.Router();
const upload = multer({ dest: 'uploads/' });


router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log("File received:", req.file);
    const dataBuffer = fs.readFileSync(req.file.path);
    const data = await pdfParse(dataBuffer);
    // delete uploaded file
    fs.unlinkSync(req.file.path);


    const text = data.text || "";
    const textSampleUpload = text.length > 25000 ? text.substring(0, 25000) : text;
    //AI PART
    console.log("KEY:", process.env.GEMINI_API_KEY);
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `Summarize the following research paper in 3-4 bullet points:${textSampleUpload}`;
    let summary = "Summary unavailable due to service limits.";
    try {
      const result = await model.generateContent(prompt);
      summary = result.response.text();
    } catch (apiErr) {
      console.error("/// API ERROR CAUGHT ///", apiErr);
      summary = `Generation failed visually. Technical Reason: ${apiErr.message}`;
    }  // We will proceed without crashing, just saving the fallback text.


    const savedPaper = await Paper.create({
      filename: req.file.originalname,
      content: text,
      summary: summary
    });

    res.json({
      message: "Saved successfully",
      summary: summary,
      data: savedPaper
    });


  } catch (err) {
    console.error("/// SUMMARY ERROR ///", err);
    res.status(500).json({ error: err.message || String(err) });
  }
});
router.get('/papers', async (req, res) => {
  try {
    const papers = await Paper.find()
      .select('filename summary createdAt')
      .sort({ createdAt: -1 });

    res.json(papers);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch papers" });
  }
});

router.post('/analyze/:type', async (req, res) => {
  try {
    const { id } = req.body;
    const type = req.params.type;

    if (!id) return res.status(400).json({ error: "Paper ID required" });

    const paper = await Paper.findById(id);
    if (!paper) return res.status(404).json({ error: "Paper not found" });

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "GEMINI_API_KEY missing" });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    let prompt = "";
    let fieldToUpdate = "";

    // truncate content to avoid hitting token limits for simple demo
    const textSample = paper.content.length > 8000 ? paper.content.substring(0, 8000) : paper.content;

    if (type === 'plagiarism') {
      prompt = `Analyze the following text for potential plagiarism. Summarize if you suspect any text is copied from common sources. Provide a 'Plagiarism Score' from 0-100% where 100% means fully plagiarized. Format as clear bullet points. Text:\n\n${textSample}`;
      fieldToUpdate = 'plagiarismReport';
    } else if (type === 'ai-detect') {
      prompt = `Analyze the following text and determine the likelihood of it being AI-generated. Provide an 'AI Confidence Score' from 0-100% where 100% means fully AI-generated. Provide a brief explanation. Format as clear bullet points. Text:\n\n${textSample}`;
      fieldToUpdate = 'aiConfidence';
    } else if (type === 'humanize') {
      prompt = `Rewrite the following text to sound more natural, human-like, and professional. Avoid overly robotic phrasing. Provide only the rewritten text. Text:\n\n${paper.content.length > 3000 ? paper.content.substring(0, 3000) : paper.content}`;
      fieldToUpdate = 'humanizedText';
    } else {
      return res.status(400).json({ error: "Invalid analysis type" });
    }

    // Return cached result if already processed
    if (paper[fieldToUpdate]) {
      return res.json({ result: paper[fieldToUpdate] });
    }

    let outputText = "";
    try {
      const result = await model.generateContent(prompt);
      if (result && result.response) {
        outputText = result.response.text();
      }
    } catch (apiErr) {
      console.error("/// API ERROR CAUGHT in analyze ///", apiErr);
      outputText = "Summary unavailable due to service limits.";
    }

    // Default fallback if empty
    if (!outputText || outputText.trim() === '') {
      outputText = "Analysis returned no result.";
    }

    paper[fieldToUpdate] = outputText;
    await paper.save();

    res.json({ result: outputText });
  } catch (error) {
    console.error("/// Analysis Error caught ///", error);
    res.status(500).json({ error: "Analysis failed", details: error.message || String(error) });
  }
});
// AI CHATBOT ROUTE
router.post('/chat/:paperId', async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({
        error: 'Question is required'
      });
    }

    // Find paper
    const paper = await Paper.findById(req.params.paperId);

    if (!paper) {
      return res.status(404).json({
        error: 'Paper not found'
      });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash'
    });

    // limit text size
    const textSample =
      paper.content.length > 20000
        ? paper.content.substring(0, 20000)
        : paper.content;

    // Prompt
    const prompt = `
You are an AI research assistant.

Answer the user's question ONLY using the research paper below.

If the answer is not found in the paper, say:
"This information is not available in the uploaded paper."

RESEARCH PAPER:
${textSample}

USER QUESTION:
${question}
`;

    // Generate response
    const result = await model.generateContent(prompt);

    const answer = result.response.text();

    // Save chat history
    paper.chatHistory.push(
      {
        role: 'user',
        message: question
      },
      {
        role: 'assistant',
        message: answer
      }
    );

    await paper.save();

    res.json({
      success: true,
      answer
    });

  } catch (err) {
    console.error("/// CHAT ERROR ///", err);

    res.status(500).json({
      error: err.message || String(err)
    });
  }
});
// GET CHAT HISTORY
router.get('/chat-history/:paperId', async (req, res) => {

  try {

    const paper = await Paper.findById(req.params.paperId);

    if (!paper) {
      return res.status(404).json({
        error: 'Paper not found'
      });
    }

    res.json({
      success: true,
      chatHistory: paper.chatHistory || []
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: err.message
    });
  }
});


export default router;