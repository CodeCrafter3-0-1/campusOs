"use client";
import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Minimize2, Maximize2 } from "lucide-react";

const GROQ_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY;

const SYSTEM_MSG = "You are CampusOS Study Assistant, a helpful AI tutor for computer science students. Help with DSA, programming, DBMS, OS, networking, web development, career advice, and placement preparation. Keep answers concise, clear and student-friendly. Use simple language. If explaining code, use proper formatting.";

const SUGGESTIONS = [
  "Explain Big O notation",
  "What is a binary search tree?",
  "How does TCP/IP work?",
  "Explain React hooks",
  "What is normalization in DBMS?",
  "How to prepare for placements?",
];

async function askGroq(messages) {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": "Bearer " + GROQ_KEY },
    body: JSON.stringify({ model: "llama-3.3-70b-versatile", messages: [{ role: "system", content: SYSTEM_MSG }, ...messages], max_tokens: 512 }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.choices[0].message.content;
}

export function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [pulse, setPulse] = useState(true);
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, open]);

  useEffect(() => {
    const t = setTimeout(() => setPulse(false), 5000);
    return () => clearTimeout(t);
  }, []);

  const send = async (text) => {
    const q = (text || input).trim();
    if (!q || loading) return;
    setInput("");
    const newMsgs = [...messages, { role: "user", content: q }];
    setMessages(newMsgs);
    setLoading(true);
    try {
      const reply = await askGroq(newMsgs);
      setMessages(m => [...m, { role: "assistant", content: reply }]);
    } catch {
      setMessages(m => [...m, { role: "assistant", content: "Sorry, I am having trouble connecting. Please check your API key and try again." }]);
    }
    setLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">

      {open && !minimized && (
        <div className="w-80 md:w-96 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-[1.8rem] shadow-2xl shadow-slate-900/20 flex flex-col overflow-hidden" style={{ height: "520px", animation: "slideUp 0.3s ease-out" }}>
          <style>{`@keyframes slideUp { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }`}</style>
          <div className="bg-gradient-to-r from-violet-600 to-cyan-600 p-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">CampusOS AI</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  <p className="text-white/70 text-xs">Study Assistant � Online</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setMinimized(true)} className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-all">
                <Minimize2 className="w-4 h-4" />
              </button>
              <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="h-full flex flex-col justify-center">
                <div className="text-center mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-violet-500/20 flex items-center justify-center mx-auto mb-3">
                    <Bot className="w-7 h-7 text-violet-500" />
                  </div>
                  <p className="text-slate-800 dark:text-white font-bold text-sm">Hey! I am your AI Study Assistant</p>
                  <p className="text-slate-400 text-xs mt-1">Ask me anything about CS, coding or placements</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {SUGGESTIONS.map(s => (
                    <button key={s} onClick={() => send(s)}
                      className="text-left text-xs bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-2.5 text-slate-600 dark:text-slate-400 hover:border-violet-500/30 hover:text-violet-600 hover:bg-violet-500/5 transition-all">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={"flex gap-2 " + (msg.role === "user" ? "flex-row-reverse" : "")}>
                <div className={"w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-1 " + (msg.role === "assistant" ? "bg-violet-500/20" : "bg-cyan-500/20")}>
                  {msg.role === "assistant" ? <Bot className="w-3.5 h-3.5 text-violet-500" /> : <User className="w-3.5 h-3.5 text-cyan-500" />}
                </div>
                <div className={"max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed " + (msg.role === "assistant" ? "bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 rounded-tl-sm" : "bg-gradient-to-br from-violet-600 to-violet-700 text-white rounded-tr-sm")}>
                  <pre className="whitespace-pre-wrap font-sans">{msg.content}</pre>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-3.5 h-3.5 text-violet-500" />
                </div>
                <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl rounded-tl-sm px-3.5 py-3 flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-slate-200 dark:border-white/10 p-3 flex-shrink-0">
            <div className="flex gap-2">
              <input value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(null); } }}
                placeholder="Ask about DSA, React, SQL..."
                disabled={loading}
                className="flex-1 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:border-violet-500 transition-colors disabled:opacity-50" />
              <button onClick={() => send(null)} disabled={loading || !input.trim()}
                className="w-10 h-10 bg-gradient-to-br from-violet-600 to-cyan-600 hover:opacity-90 disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition-all flex-shrink-0">
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {open && minimized && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-lg cursor-pointer" onClick={() => setMinimized(false)}>
          <Bot className="w-4 h-4 text-violet-500" />
          <span className="text-slate-700 dark:text-slate-300 text-sm font-medium">CampusOS AI</span>
          <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
        </div>
      )}

      <button onClick={() => { setOpen(!open); setMinimized(false); setPulse(false); }}
        className="relative w-14 h-14 bg-gradient-to-br from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-violet-500/40 hover:shadow-violet-500/60 transition-all hover:scale-105 active:scale-95">
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        {!open && messages.length === 0 && pulse && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white dark:border-slate-900 animate-pulse" />
        )}
        {!open && messages.length > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center text-xs font-bold">{messages.filter(m => m.role === "assistant").length}</span>
        )}
      </button>
    </div>
  );
}