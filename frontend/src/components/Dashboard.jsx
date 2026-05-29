import React, { useState, useRef, useEffect } from 'react';
import { UploadSimple, Detective, Robot, User, CheckCircle, SpinnerGap, Moon, Sun, FilePdf } from '@phosphor-icons/react';
import Chatbot from './chatbox';
const Dashboard = () => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [paperId, setPaperId] = useState(null);
  const [summary, setSummary] = useState('');
  
  const [actionLoading, setActionLoading] = useState(null);
  const [actionResult, setActionResult] = useState(null);
  const [actionTitle, setActionTitle] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentPaperId, setCurrentPaperId] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) {
      setIsDarkMode(true);
    }
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    setIsDarkMode(!isDarkMode);
  };

  const handleUpload = async (selectedFile) => {
    if (selectedFile.type !== "application/pdf") {
      alert("Please upload a PDF file.");
      return;
    }
    setFile(selectedFile);
    setIsLoading(true);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();

      if (response.ok) {
        setPaperId(data.data._id);
        setCurrentPaperId(data.data._id);
        setSummary(data.summary);
      } else {
        alert(data.error || 'Upload failed');
        setFile(null);
      }
    } catch (err) {
      alert("Error: " + err.message);
      setFile(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (actionType, title) => {
    if (!paperId) return;
    setActionTitle(title);
    setActionLoading(actionType);
    setActionResult(null);

    try {
      const response = await fetch(`/api/analyze/${actionType}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: paperId })
      });
      const data = await response.json();
      
      if (response.ok) {
        setActionResult(data.result);
      } else {
        setActionResult(`Error: ${data.error}`);
      }
    } catch (err) {
      setActionResult("Request failed. Try again.");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="min-h-full p-8 md:p-12 lg:p-16 max-w-6xl mx-auto animate-in text-on-surface dark:text-gray-100 transition-colors duration-300">
      {/* Header Area */}
      <header className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2 dark:text-gray-50 transition-colors">Summarizer Dashboard</h1>
          <p className="text-on-surface-variant text-lg dark:text-gray-400 transition-colors">Harness AI to extract actionable insights from any manuscript instantly.</p>
        </div>
        
        <button 
          onClick={toggleTheme} 
          className="w-12 h-12 rounded-full bg-surface-container-high dark:bg-gray-800 hover:bg-surface-variant dark:hover:bg-gray-700 flex items-center justify-center transition-colors shadow-sm outline-none border border-transparent dark:border-gray-700"
        >
          {isDarkMode ? <Sun size={24} className="text-amber-400" weight="fill" /> : <Moon size={24} className="text-primary" weight="fill" />}
        </button>
      </header>

      {/* Main Content Pane */}
      <div className="bg-surface-container-lowest dark:bg-[#1a1c23] rounded-2xl shadow-xl shadow-primary/5 dark:shadow-black/40 border border-outline-variant/20 dark:border-gray-800 p-8 md:p-10 relative overflow-hidden transition-colors duration-300">
        
        {/* Subtle decorative background blur for enticing aesthetic */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 dark:bg-primary/20 rounded-full blur-3xl pointer-events-none transition-colors"></div>

        {!file && !isLoading && (
          <div 
            onClick={() => fileInputRef.current.click()}
            className="relative border-4 border-dashed border-primary/20 dark:border-gray-700 rounded-2xl p-16 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary dark:hover:border-primary/60 hover:bg-primary/5 dark:hover:bg-gray-800/50 transition-all duration-300 group overflow-hidden"
          >
             <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/5 to-transparent dark:via-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
             <input type="file" ref={fileInputRef} accept="application/pdf" hidden onChange={(e) => {
                if (e.target.files.length > 0) handleUpload(e.target.files[0]);
             }}/>
             
             <div className="w-24 h-24 bg-surface-container-low dark:bg-gray-800 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300 shadow-sm relative z-10 dark:border dark:border-gray-700">
               <UploadSimple size={48} className="text-primary dark:text-primary-fix" weight="duotone" />
             </div>
             
             <h3 className="text-2xl font-bold mb-3 relative z-10 dark:text-white">Upload Research Paper</h3>
             <p className="text-on-surface-variant dark:text-gray-400 text-lg max-w-md relative z-10">
               Drag & drop your PDF file, or <span className="text-primary dark:text-primary-container font-semibold underline decoration-primary/30 underline-offset-4">browse your computer</span>.
             </p>
             <p className="text-sm font-medium tracking-widest uppercase text-outline dark:text-gray-500 mt-8 relative z-10">Only standard PDF files are supported</p>
          </div>
        )}

        {isLoading && (
          <div className="py-24 flex flex-col items-center justify-center text-center animate-in">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-primary/20 dark:bg-primary/40 rounded-full blur-xl animate-pulse"></div>
              <SpinnerGap size={64} className="animate-spin text-primary relative z-10" weight="bold" />
            </div>
            <h3 className="text-2xl font-bold mb-2 dark:text-white transition-colors">Analyzing Manuscript...</h3>
            <p className="text-on-surface-variant dark:text-gray-400 transition-colors">Our AI is extracting structural entities and formulating summaries.</p>
          </div>
        )}

        {file && !isLoading && (
          <div className="animate-in fade-in duration-500 relative z-10">
             
             {/* File Status Banner */}
             <div className="flex items-center gap-4 bg-primary-container dark:bg-primary/20 text-on-primary-container dark:text-primary-fixed p-4 rounded-xl mb-10 shadow-md">
               <div className="bg-white/20 dark:bg-black/30 p-2 rounded-lg">
                 <FilePdf size={28} weight="fill" className="dark:text-primary" />
               </div>
               <div>
                  <h4 className="font-bold dark:text-white">{file.name}</h4>
                  <p className="text-sm opacity-80 flex items-center gap-1 dark:text-gray-300">
                    <CheckCircle weight="fill" /> Securely digitized & analyzed
                  </p>
               </div>
             </div>

             {/* Dynamic Summary Panel */}
             <div className="mb-12">
                <div className="flex items-center mb-6 gap-3">
                   <div className="h-8 w-2 bg-primary dark:bg-primary-container rounded-full"></div>
                   <h3 className="text-2xl font-extrabold tracking-tight dark:text-white transition-colors">Executive Summary</h3>
                </div>
                <div className="bg-surface-container-low dark:bg-gray-800 p-8 rounded-xl text-lg leading-relaxed text-on-surface dark:text-gray-100 shadow-inner font-body transition-colors">
                   <div dangerouslySetInnerHTML={{ __html: formatMarkdown(summary) }} />
                </div>
             </div>

             {/* Deep Analysis Options */}
             <h3 className="text-xl font-bold mb-6 tracking-tight dark:text-white transition-colors">Post-Processing Tools</h3>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ActionCard 
                  icon={<Detective size={32} weight="duotone" />} 
                  title="Plagiarism Check" 
                  description="Scan against 10M+ academic journals"
                  onClick={() => handleAction('plagiarism', 'Plagiarism Report')} 
                />
                <ActionCard 
                  icon={<Robot size={32} weight="duotone" />} 
                  title="AI Detector" 
                  description="Verify human authorship integrity"
                  onClick={() => handleAction('ai-detect', 'AI Generation Analysis')} 
                />
                <ActionCard 
                  icon={<User size={32} weight="duotone" />} 
                  title="Humanize Tone" 
                  description="Rewrite with natural cadence"
                  onClick={() => handleAction('humanize', 'Humanized Output')} 
                />
             </div>

             {/* Action Results Panel */}
             {(actionLoading || actionResult) && (
                <div className="mt-12 p-8 rounded-xl bg-surface-variant dark:bg-[#1a1c23] border border-outline-variant/30 dark:border-gray-700 shadow-lg animate-in slide-in-from-bottom-8 transition-colors">
                  <h3 className="text-2xl font-bold mb-6 tracking-tight text-primary dark:text-primary-container leading-snug">{actionTitle}</h3>
                  {actionLoading ? (
                    <div className="flex flex-col items-center justify-center p-8">
                       <SpinnerGap size={40} className="animate-spin text-primary dark:text-primary-container mb-4" /> 
                       <span className="font-semibold text-lg animate-pulse dark:text-gray-300">Running deep structural analysis...</span>
                    </div>
                  ) : (
                    <div className="prose prose-lg dark:prose-invert max-w-none font-body leading-relaxed dark:text-gray-200">
                       <div dangerouslySetInnerHTML={{ __html: formatMarkdown(actionResult) }} />
                    </div>
                  )}
                </div>
             )}
             {/* AI CHATBOT */}
             {currentPaperId && (
             <div className="mt-12">
               <Chatbot paperId={currentPaperId} />
             </div>
             )}
          </div>
        )}
      </div>

    </div>
  );
};

function ActionCard({ icon, title, description, onClick }) {
  return (
    <button 
      onClick={onClick} 
      className="bg-surface dark:bg-gray-800 border border-outline-variant/30 dark:border-gray-700 rounded-xl p-6 flex flex-col items-start text-left cursor-pointer hover:border-primary/50 dark:hover:border-primary/50 hover:bg-surface-container-highest dark:hover:bg-gray-750 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
    >
      <div className="p-3 bg-surface-container-low dark:bg-gray-900 rounded-lg text-primary dark:text-primary-container mb-4 group-hover:bg-primary group-hover:text-white dark:group-hover:text-white transition-colors duration-300">
        {icon}
      </div>
      <h4 className="font-bold text-lg text-on-surface dark:text-gray-100 mb-2 transition-colors">{title}</h4>
      <p className="text-sm text-on-surface-variant dark:text-gray-400 transition-colors">{description}</p>
    </button>
  );
}

function formatMarkdown(text) {
  if (!text) return "No content available.";
  return text
    .split('\n')
    .map(line => {
      line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      if (line.startsWith('* ') || line.startsWith('- ')) return `<li>${line.substring(2)}</li>`;
      return line ? `<p class="mb-3">${line}</p>` : '';
    })
    .join('')
    .replace(/(<li>.*<\/li>)/s, '<ul class="list-disc ml-6 mb-4 space-y-2">$1</ul>');
}

export default Dashboard;
