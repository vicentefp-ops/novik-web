import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Paperclip, User, Bot, Loader2, Download, PlusCircle, Trash2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `You are Novik, an AI-powered clinical decision support tool designed specifically for dentistry.
Your goal is to help dental professionals make smarter and safer decisions.
Always provide suggestions based on scientific evidence.
Structure your response clearly:
1. Risk Assessment (Low/Moderate/High)
2. Clinical Considerations
3. Recommended Protocols (Antibiotics, Anesthetics, etc.)
4. Evidence and References (Vancouver style with PubMed links if possible)
Legal Disclaimer: You are a support tool, not a replacement for the professional's clinical judgment.`;

export default function Dashboard() {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [...messages.map(m => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.content }] })), { role: 'user', parts: [{ text: userMessage }] }],
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        }
      });

      const aiContent = response.text || "I'm sorry, I couldn't process that request.";
      setMessages(prev => [...prev, { role: 'ai', content: aiContent }]);
    } catch (error) {
      console.error("Gemini Error:", error);
      setMessages(prev => [...prev, { role: 'ai', content: "Error: Failed to connect to AI engine. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewPatient = () => {
    if (confirm("Are you sure you want to clear the current case?")) {
      setMessages([]);
    }
  };

  const handleExport = () => {
    const content = messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `novik-case-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 h-[calc(100vh-80px)] flex flex-col gap-6">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Clinical Case Analysis</h1>
          <p className="text-slate-500 flex items-center gap-2 mt-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            AI Engine Active
          </p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button 
            onClick={handleExport} 
            className="flex-1 md:flex-none px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <Download size={18} /> Export
          </button>
          <button 
            onClick={handleNewPatient} 
            className="flex-1 md:flex-none px-5 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-dark transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
          >
            <PlusCircle size={18} /> New Patient
          </button>
        </div>
      </div>

      <div className="flex-grow bg-white rounded-[2rem] shadow-2xl shadow-slate-200/60 border border-slate-100 flex flex-col overflow-hidden relative">
        {/* Messages Area */}
        <div className="flex-grow overflow-y-auto p-6 md:p-10 space-y-8 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center px-8 max-w-lg mx-auto">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-primary/10 p-8 rounded-[2.5rem] mb-8"
              >
                <Bot className="text-primary w-16 h-16" />
              </motion.div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">Start New Analysis</h3>
              <p className="text-slate-500 leading-relaxed mb-8">
                Describe the clinical case, medical history, or questions about drug interactions. Novik will analyze the information in seconds.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                {[
                  "Hypertensive patient with...",
                  "Amoxicillin interaction with...",
                  "Extraction protocol in...",
                  "Surgical risk in patient..."
                ].map((suggestion, i) => (
                  <button 
                    key={i}
                    onClick={() => setInput(suggestion)}
                    className="p-3 text-sm text-slate-600 border border-slate-100 rounded-xl hover:border-primary/30 hover:bg-primary/5 transition-all text-left"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          <AnimatePresence mode="popLayout">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${
                    msg.role === 'user' ? 'bg-slate-800 text-white' : 'bg-primary text-white'
                  }`}>
                    {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                  </div>
                  <div className={`p-5 rounded-3xl shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-slate-800 text-white rounded-tr-none' 
                      : 'bg-slate-50 text-slate-800 border border-slate-100 rounded-tl-none'
                  }`}>
                    <div className="prose prose-slate max-w-none prose-p:leading-relaxed prose-headings:text-slate-900 prose-headings:font-bold">
                      {msg.content.split('\n').map((line, idx) => (
                        <p key={idx} className="mb-2 last:mb-0">{line}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="flex gap-4 max-w-[85%]">
                <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center flex-shrink-0 animate-pulse">
                  <Bot size={20} />
                </div>
                <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100 rounded-tl-none flex items-center gap-3">
                  <Loader2 className="animate-spin text-primary" size={20} />
                  <span className="text-slate-500 text-sm font-medium">Novik is analyzing...</span>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 md:p-8 bg-slate-50/50 border-t border-slate-100">
          <div className="max-w-4xl mx-auto relative">
            <div className="relative flex items-end gap-3 bg-white p-2 rounded-[1.5rem] shadow-xl shadow-slate-200/50 border border-slate-200 focus-within:border-primary/50 transition-all">
              <button className="p-3 text-slate-400 hover:text-primary transition-colors rounded-xl hover:bg-slate-50">
                <Paperclip size={22} />
              </button>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Type the clinical case details here..."
                className="flex-grow bg-transparent border-none focus:ring-0 py-3 px-2 resize-none max-h-40 min-h-[50px] text-slate-700 placeholder:text-slate-400"
                rows={1}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className={`p-3 rounded-xl transition-all ${
                  input.trim() && !isLoading 
                    ? 'bg-primary text-white shadow-lg shadow-primary/30 hover:scale-105 active:scale-95' 
                    : 'bg-slate-100 text-slate-300'
                }`}
              >
                <Send size={22} />
              </button>
            </div>
            <p className="text-[10px] text-center text-slate-400 mt-3 uppercase tracking-widest font-bold">
              Novik AI can make mistakes. Always verify clinical information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
