import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testModel(modelName) {
  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent("Hello!");
    console.log(`[SUCCESS] ${modelName}:`, result.response.text());
  } catch (err) {
    console.error(`[FAILED] ${modelName}:`, err.status || err.message);
  }
}

async function run() {
  console.log("Testing models...");
  await testModel("gemini-1.5-flash");
  await testModel("gemini-2.5-flash");
  await testModel("gemini-1.5-pro");
  await testModel("gemini-pro");
}

run();
