import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
export default function Chatbot({ paperId }) {

    const [question, setQuestion] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    // reference for auto scroll
    const messagesEndRef = useRef(null);

    // auto-scroll when new message comes
    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);
    useEffect(() => {
        const fetchChatHistory = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5000/api/chat-history/${paperId}`
                );
                if (response.data.success) {
                    setMessages(response.data.chatHistory);
                }
            } catch (err) {
                console.error(err);
            }
        };
        if (paperId) {
            fetchChatHistory();
        }
    }, [paperId]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({
            behavior: 'smooth'
        });
    };

    const sendQuestion = async () => {

        if (!question.trim()) return;

        const userMessage = {
            role: 'user',
            message: question
        };

        setMessages((prev) => [...prev, userMessage]);

        setLoading(true);

        try {

            const response = await axios.post(
                `http://localhost:5000/api/chat/${paperId}`,
                {
                    question
                }
            );

            const aiMessage = {
                role: 'assistant',
                message: response.data.answer
            };

            setMessages((prev) => [...prev, aiMessage]);

        } catch (err) {

            console.error(err);

            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    message:
                        'Something went wrong while contacting the AI.'
                }
            ]);
        }

        setQuestion('');
        setLoading(false);
    };

    return (

        <div className="mt-12 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden bg-white dark:bg-[#1a1c23] shadow-xl">

            {/* HEADER */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#20232d]">
                <h2 className="text-2xl font-bold dark:text-white">
                    AI Research Assistant
                </h2>

                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Ask questions about the uploaded paper.
                </p>
            </div>

            {/* CHAT AREA */}
            <div className="h-[500px] overflow-y-auto px-6 py-6 bg-[#fafafa] dark:bg-[#16181f]">

                {/* EMPTY STATE */}
                {messages.length === 0 && !loading && (
                    <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400">

                        <div className="text-5xl mb-4">
                            🤖
                        </div>

                        <h3 className="text-xl font-semibold mb-2">
                            Start a conversation
                        </h3>

                        <p className="max-w-md">
                            Ask anything about the uploaded research paper —
                            methodology, results, limitations, future scope, and more.
                        </p>
                    </div>
                )}

                {/* CHAT MESSAGES */}
                <div className="space-y-6">

                    {messages.map((msg, index) => (

                        <div
                            key={index}
                            className={`flex ${msg.role === 'user'
                                ? 'justify-end'
                                : 'justify-start'
                                }`}
                        >

                            <div
                                className={`
                  max-w-[80%]
                  px-5
                  py-4
                  rounded-2xl
                  shadow-sm
                  whitespace-pre-wrap
                  leading-relaxed
                  ${msg.role === 'user'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white dark:bg-[#20232d] text-black dark:text-gray-100 border border-gray-200 dark:border-gray-700'
                                    }
                `}
                            >

                                {msg.role === 'assistant' ? (
                                    <div className="prose dark:prose-invert max-w-none">
                                        <ReactMarkdown>
                                            {msg.message}
                                        </ReactMarkdown>
                                    </div>
                                ) : (
                                    msg.message
                                )}

                            </div>

                        </div>
                    ))}

                </div>

                {/* LOADING ANIMATION */}
                {loading && (

                    <div className="flex justify-start mt-6">

                        <div className="bg-white dark:bg-[#20232d] border border-gray-200 dark:border-gray-700 px-5 py-4 rounded-2xl shadow-sm">

                            <div className="flex gap-2">

                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>

                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>

                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>

                            </div>

                        </div>

                    </div>
                )}

                {/* auto scroll anchor */}
                <div ref={messagesEndRef}></div>

            </div>

            {/* INPUT AREA */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-[#1a1c23]">

                <div className="flex gap-3">

                    <input
                        type="text"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                sendQuestion();
                            }
                        }}
                        placeholder="Ask something about the paper..."
                        className="
              flex-1
              px-4
              py-3
              rounded-xl
              border
              border-gray-300
              dark:border-gray-600
              dark:bg-[#20232d]
              dark:text-white
              outline-none
              focus:ring-2
              focus:ring-blue-500
            "
                    />

                    <button
                        onClick={sendQuestion}
                        className="
              px-6
              py-3
              rounded-xl
              bg-blue-600
              hover:bg-blue-700
              text-white
              font-semibold
              transition
            "
                    >
                        Send
                    </button>

                </div>

            </div>

        </div>
    );
}