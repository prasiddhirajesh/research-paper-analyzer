# ScholarInsight (Research Paper Analyzer) - Detailed Technical Documentation

ScholarInsight is a comprehensive, full-stack web application designed for the academic and research community. It provides a fluid workspace to upload PDF manuscripts, extract text, and leverage state-of-the-art Artificial Intelligence (Google Gemini 2.5) to synthesize summaries, detect AI generation, analyze potential plagiarism, and humanize academic tone.

This document serves as a deep dive into the architectural workflow, the precise technical stack, and the granular responsibilities of each file within the codebase.

---

## Comprehensive Tech Stack

### Frontend Architecture
- **Framework**: React 19 (scaffolded via Vite for HMR and optimized builds)
- **Routing**: `react-router-dom` v7 for client-side SPA navigation.
- **Styling**: Tailwind CSS combined with native CSS variables for dynamic Light/Dark mode theming.
- **Authentication**: `@react-oauth/google` for secure OAuth 2.0 Implicit Flow.
- **Iconography**: Phosphor Icons (`@phosphor-icons/react`).

### Backend Architecture
- **Runtime**: Node.js
- **Server Framework**: Express.js
- **Database**: MongoDB (managed via Mongoose ODM).
- **File Handling**: `multer` for multipart/form-data parsing (PDF uploads).
- **Text Extraction**: `pdf-parse` for converting raw PDF buffers into machine-readable strings.
- **AI Integration**: `@google/generative-ai` (Gemini API) for all natural language processing tasks.

---

## 🔄 Detailed System Workflow

### 1. Authentication & Session Management
- **Flow**: The user lands on `/login`. They click "Continue with Google", triggering the `useGoogleLogin` hook. A popup opens for Google OAuth.
- **Data Capture**: Upon successful authentication, the frontend receives a short-lived `access_token`. The frontend immediately makes a secure `fetch` call to `https://www.googleapis.com/oauth2/v3/userinfo` to retrieve the user's email, name, and profile picture.
- **Persistence**: This user object is serialized and saved to browser `localStorage` under the key `mockUser`. The `<Sidebar>` component listens to this state to display the user's avatar and email at the bottom left of the app.

### 2. Paper Upload & Initial Synthesis
- **Flow**: On the `/dashboard`, the user drops a PDF file into the upload zone.
- **Transport**: The file is appended to a `FormData` object and POSTed to `/api/upload`.
- **Backend Processing**: 
  1. `multer` temporarily saves the PDF to the `/uploads` directory.
  2. `fs` reads the file buffer, and `pdf-parse` extracts all the raw text.
  3. The raw file is deleted from the filesystem to save space.
  4. The extracted text (truncated to 25,000 characters to fit token limits) is sent to the `gemini-2.5-flash` model with the prompt: *"Summarize the following research paper in 3-4 bullet points"*.
  5. The resulting summary and original text are saved as a new document in MongoDB via the `Paper` Mongoose model.
- **Client Render**: The dashboard receives the summary, parses the markdown into HTML using a custom regex formatter, and displays the "Executive Summary" panel.

### 3. Deep Analysis Post-Processing
- **Flow**: After uploading, the user has access to three "Post-Processing Tools": **Plagiarism Check**, **AI Detector**, and **Humanize Tone**.
- **Backend Routing**: Clicking a tool sends a POST request to `/api/analyze/:type` containing the `paperId`.
- **Prompt Engineering**: The backend dynamically generates prompts based on the requested tool (e.g., *"Analyze the following text and determine the likelihood of it being AI-generated..."*).
- **Caching**: Before hitting the Gemini API, the backend checks if the specific `Paper` document already has a value for `aiConfidence`, `plagiarismReport`, or `humanizedText`. If it does, it returns the cached database result instantly.
- **Database Update**: If it's a new request, the AI generates the content, updates the specific field in the MongoDB document, and returns it to the frontend for display.

---

## 📂 Exhaustive File Directory & Responsibilities

### Root Directory (Backend API)

* **`server.js`**
  - The entry point for the backend. It loads `.env` variables, configures the Express middleware (JSON parsing, CORS), establishes the `mongoose.connect()` link to the MongoDB cluster, and mounts the `uploadRoutes` to the `/api` path. Finally, it binds to the port to start listening for requests.

* **`routes/upload.js`**
  - Contains all the core backend business logic.
  - `POST /upload`: Handles the multipart PDF upload, text extraction, initial Gemini summarization, and creates the Mongoose document.
  - `GET /papers`: Fetches a sorted list of previously analyzed papers (projecting only necessary fields like filename and summary) for the History page.
  - `POST /analyze/:type`: A dynamic route that handles all three post-processing AI tools using prompt engineering and database updates.

* **`models/Paper.js`**
  - Defines the Mongoose Schema. It dictates that every paper has a `filename`, raw `content`, `summary`, `plagiarismReport`, `aiConfidence`, `humanizedText`, and a `createdAt` timestamp.

* **`.env`**
  - Contains secure server-side secrets: `MONGODB_URI` and `GEMINI_API_KEY`.

---

### `/frontend` Directory (React Application)

* **`src/main.jsx`**
  - The React mounting point. It wraps the entire `App` inside the `<GoogleOAuthProvider>`, injecting the `VITE_GOOGLE_CLIENT_ID` from the frontend environment variables so that the OAuth popup functions securely.

* **`src/App.jsx`**
  - The Application Shell. 
  - **Routing**: Configures the `<BrowserRouter>` and dictates which component renders on which URL path.
  - **Sidebar Component**: Implemented directly in this file. It checks local storage to see if a user is logged in, renders the persistent left-side navigation, displays the user's email/avatar in the footer, and provides the `handleLogout` function to clear local storage and redirect to the login page.

* **`src/components/Login.jsx`**
  - Renders a visually striking split-screen authentication page. 
  - Includes a fallback form and the "Continue with Google" button. The Google button utilizes the `useGoogleLogin` hook to execute the OAuth flow, fetch user metadata from the Google APIs, and log the user into the local browser session.

* **`src/components/Dashboard.jsx`**
  - The most complex frontend component.
  - Manages the state for file selection, loading spinners, and the active `paperId`.
  - Implements a drag-and-drop styled `input type="file"` utilizing an invisible `useRef` trigger.
  - Houses the `handleUpload` and `handleAction` functions which orchestrate the `fetch` calls to the Express backend.
  - Includes a `formatMarkdown` helper function that uses regex to safely convert AI-generated markdown (bolding, lists) into renderable HTML elements (`dangerouslySetInnerHTML`).

* **`src/components/History.jsx`**
  - (Assumed based on API design) Mounts and `fetch`es the `/api/papers` endpoint to display a historical list of all documents the user has uploaded, allowing them to review past AI summaries.

* **`src/components/Landing.jsx`**
  - A public-facing marketing page explaining the product's value proposition before the user enters the authenticated zone.

* **`src/index.css`**
  - Contains the Tailwind CSS directives (`@tailwind base`, etc.).
  - Defines an extensive library of CSS custom properties (`:root` and `.dark` classes) that serve as the fundamental Design System. This dictates the primary colors, surface containers, and text colors, allowing seamless transitions between Light and Dark modes utilizing the `toggleTheme` functions found throughout the app.
