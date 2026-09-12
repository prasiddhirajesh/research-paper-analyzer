# ScholarInsight 

> **The Digital Curator for Academic Research**  
> Transform complex PDF manuscripts into actionable insights through AI-powered parsing, plagiarism detection, tone humanization, and document-grounded chat.

**Live Application**: [https://research-paper-analyzer-mu.vercel.app/](https://research-paper-analyzer-mu.vercel.app/)

---

## Overview

**ScholarInsight** is a full-stack web application designed for students, professors, and researchers. It provides a fluid workspace to upload academic manuscripts (PDFs), automatically extract structural text, and harness Google's state-of-the-art **Gemini 2.5 Flash** model to synthesize executive summaries, run deep analytical checks, and engage in interactive QA with papers.

---

## Key Features-

- **PDF Extraction & Auto-Summarization**: Upload any research manuscript and instantly extract structured bullet-point summaries.
- **Interactive Paper Chatbot**: Ask questions directly to your manuscript with a grounded AI assistant and persistent chat history.
- **Plagiarism & Integrity Scanner**: Scan paper text for potential duplication and common source patterns.
- **AI Generation Detection**: Evaluate likelihood scores of AI-generated content in academic writing.
- **Academic Tone Humanizer**: Refine robotic or overly technical text into natural, professional prose.
- **Research History Archive**: Persist historical analyses, summaries, and chat sessions in MongoDB.
- **Dynamic Theme System**: Toggle seamlessly between dark and light modes with glassmorphic UI elements.

---

## Tech Stack

### Frontend
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS + Custom CSS Variables
- **Icons & Markdown**: `@phosphor-icons/react`, `react-markdown`
- **Routing**: `react-router-dom`
- **Deployment**: [Vercel](https://vercel.com)

### Backend
- **Runtime**: Node.js + Express 5
- **Database**: MongoDB Atlas + Mongoose
- **File Processing**: `multer`, `pdf-parse`
- **AI Integration**: `@google/generative-ai` (`gemini-2.5-flash`)
- **Deployment**: [Render](https://render.com)

---

## Live Deployments

| Component | Platform | Status | URL |
| :--- | :--- | :--- | :--- |
| **Frontend** | Vercel | 🟢 Live | [research-paper-analyzer-mu.vercel.app](https://research-paper-analyzer-mu.vercel.app/) |
| **Backend API** | Render | 🟢 Live | Hosted on Render Web Service |

---

## Local Setup & Development

### 1. Prerequisites
- Node.js (`v18+`)
- MongoDB connection URI
- Google Gemini API Key

### 2. Clone & Install
```bash
git clone https://github.com/prasiddhirajesh/research-paper-analyzer.git
cd research-paper-analyzer

# Install root & backend dependencies
npm install

# Install frontend dependencies
npm --prefix frontend install
```

### 3. Environment Variables
Create a `.env` file in the root directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_google_gemini_api_key
```

Create a `frontend/.env` file (optional for local override):
```env
VITE_API_BASE_URL=http://localhost:5000
```

### 4. Run Development Server
```bash
# Runs both backend & frontend concurrently
npm run dev
```

The application will be accessible at:
- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000`

---

## 📄 License
This project is licensed under the ISC License.
