"use client";
import { useState, useRef, useEffect } from "react";
import { AppShell } from "@/components/app/app-shell";
import { Mic, Send, RotateCcw, ChevronRight, Trophy, Brain, AlertCircle, CheckCircle, Clock, User, Bot } from "lucide-react";

const GROQ_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY;

const DOMAINS = [
  { id: "frontend", label: "Frontend Developer", icon: "??", desc: "React, JS, CSS, HTML, DOM" },
  { id: "backend", label: "Backend Developer", icon: "??", desc: "Node.js, APIs, Databases, Server" },
  { id: "fullstack", label: "Full Stack Developer", icon: "??", desc: "MERN Stack, System Design" },
  { id: "python", label: "Python Developer", icon: "??", desc: "Python, Django, Flask, OOP" },
  { id: "dsa", label: "DSA & Problem Solving", icon: "??", desc: "Arrays, Trees, DP, Graphs" },
  { id: "datascience", label: "Data Science / ML", icon: "??", desc: "ML, Python, NumPy, Pandas" },
  { id: "devops", label: "DevOps / Cloud", icon: "??", desc: "Docker, AWS, CI/CD, Linux" },
  { id: "dbms", label: "Database & SQL", icon: "???", desc: "SQL, MongoDB, Indexing, Joins" },
  { id: "os", label: "Operating Systems", icon: "??", desc: "Process, Memory, Scheduling" },
  { id: "cn", label: "Computer Networks", icon: "??", desc: "TCP/IP, HTTP, OSI Model, DNS" },
];

async function callGroq(messages) {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": "Bearer " + GROQ_KEY },
    body: JSON.stringify({ model: "llama-3.3-70b-versatile", messages, max_tokens: 1024 }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.choices[0].message.content;
}

export default function MockInterviewPage() {
  const [phase, setPhase] = useState("select");
  const [domain, setDomain] = useState(null);
  const [messages, setMessages] = useState([]);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [qCount, setQCount] = useState(0);
  const [timer, setTimer] = useState(0);
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");
  const chatRef = useRef(null);
  const timerRef = useRef(null);
  const MAX_Q = 7;

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    if (phase === "interview") {
      timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [phase]);

  const fmt = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return m + ":" + sec;
  };

  const startInterview = async (d) => {
    setDomain(d);
    setPhase("interview");
    setLoading(true);
    setError("");
    setQCount(1);
    setTimer(0);
    const sys = "You are a strict but supportive technical interviewer conducting a mock interview for a " + d.label + " role. Ask one clear technical question at a time. After the candidate answers, give brief feedback (1-2 sentences) then ask the next question. Keep questions relevant to: " + d.desc + ". Start with easy questions and gradually increase difficulty. Be encouraging but honest. Do not number the questions. Just ask naturally.";
    const first = await callGroq([
      { role: "system", content: sys },
      { role: "user", content: "Start the interview. Ask me the first question." }
    ]);
    setMessages([
      { role: "system", content: sys },
      { role: "assistant", content: first }
    ]);
    setLoading(false);
  };

  const sendAnswer = async () => {
    if (!answer.trim() || loading) return;
    const userMsg = { role: "user", content: answer };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setAnswer("");
    setLoading(true);
    const nextQ = qCount + 1;
    setQCount(nextQ);
    if (nextQ > MAX_Q) {
      const finalPrompt = [...newMsgs, { role: "user", content: "The interview is now complete. Please give me a detailed performance report in this exact JSON format with no extra text: {\"score\":75,\"grade\":\"B+\",\"verdict\":\"Good performance\",\"strengths\":[\"strength1\",\"strength2\",\"strength3\"],\"weaknesses\":[\"weakness1\",\"weakness2\"],\"tips\":[\"improvement tip1\",\"tip2\",\"tip3\"],\"topic_scores\":[{\"topic\":\"Topic Name\",\"score\":80}],\"next_steps\":\"What to study next\"}" }];
      try {
        const raw = await callGroq(finalPrompt);
        const clean = raw.replace(/```json/g, "").replace(/```/g, "").trim();
        setReport(JSON.parse(clean));
        setPhase("report");
      } catch {
        setReport({ score: 70, grade: "B", verdict: "Good effort! Keep practicing.", strengths: ["Attempted all questions", "Showed basic understanding"], weaknesses: ["Need more depth in answers", "Practice more examples"], tips: ["Study core concepts daily", "Practice on LeetCode", "Read documentation"], topic_scores: [{ topic: domain.label, score: 70 }], next_steps: "Continue practicing " + domain.label + " concepts" });
        setPhase("report");
      }
    } else {
      const reply = await callGroq(newMsgs);
      setMessages(m => [...m, { role: "assistant", content: reply }]);
    }
    setLoading(false);
  };

  const reset = () => {
    setPhase("select"); setDomain(null); setMessages([]);
    setAnswer(""); setQCount(0); setTimer(0); setReport(null); setError("");
  };

  const visibleMsgs = messages.filter(m => m.role !== "system");

  return (
    <AppShell activePath="/mock-interview">
      <div className="space-y-5">

        {phase === "select" && (
          <div className="space-y-5">
            <div className="rounded-[2rem] border border-slate-200/80 bg-white/70 p-6 dark:border-white/10 dark:bg-white/5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-2xl bg-violet-500/15 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
                  <Brain className="w-5 h-5 text-violet-500" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900 dark:text-white">AI Mock Interview</h1>
                  <p className="text-slate-500 text-xs">7 questions � AI feedback � Performance report</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                {[["7", "Questions"], ["~10 min", "Duration"], ["AI Report", "After Interview"]].map(([v, l]) => (
                  <div key={l} className="bg-slate-50 dark:bg-white/5 rounded-2xl p-3 border border-slate-200 dark:border-white/10">
                    <div className="text-slate-900 dark:text-white font-black text-lg">{v}</div>
                    <div className="text-slate-400 text-xs">{l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[2rem] border border-slate-200/80 bg-white/70 p-6 dark:border-white/10 dark:bg-white/5">
              <h2 className="text-slate-900 dark:text-white font-bold mb-4">Select Your Domain</h2>
              <div className="grid md:grid-cols-2 gap-3">
                {DOMAINS.map(d => (
                  <button key={d.id} onClick={() => startInterview(d)}
                    className="flex items-center gap-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 hover:border-violet-500/40 hover:bg-violet-500/5 transition-all group text-left">
                    <span className="text-2xl">{d.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-slate-800 dark:text-white font-semibold text-sm">{d.label}</div>
                      <div className="text-slate-400 text-xs mt-0.5">{d.desc}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-violet-500 transition-colors flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {phase === "interview" && (
          <div className="rounded-[2rem] border border-slate-200/80 bg-white/70 dark:border-white/10 dark:bg-white/5 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-white/10">
              <div className="flex items-center gap-3">
                <span className="text-xl">{domain && domain.icon}</span>
                <div>
                  <div className="text-slate-900 dark:text-white font-bold text-sm">{domain && domain.label} Interview</div>
                  <div className="text-slate-400 text-xs">Question {Math.min(qCount, MAX_Q)} of {MAX_Q}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-white/5 px-3 py-1.5 rounded-xl">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-600 dark:text-slate-300 text-sm font-mono">{fmt(timer)}</span>
                </div>
                <div className="flex gap-1">
                  {Array.from({ length: MAX_Q }).map((_, i) => (
                    <div key={i} className={"w-2 h-2 rounded-full " + (i < qCount - 1 ? "bg-violet-500" : i === qCount - 1 ? "bg-violet-500 animate-pulse" : "bg-slate-200 dark:bg-white/10")} />
                  ))}
                </div>
                <button onClick={reset} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-all">
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div ref={chatRef} className="h-96 overflow-y-auto p-5 space-y-4">
              {visibleMsgs.map((msg, i) => (
                <div key={i} className={"flex gap-3 " + (msg.role === "user" ? "flex-row-reverse" : "")}>
                  <div className={"w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 " + (msg.role === "assistant" ? "bg-violet-500/20 border border-violet-500/30" : "bg-cyan-500/20 border border-cyan-500/30")}>
                    {msg.role === "assistant" ? <Bot className="w-4 h-4 text-violet-500" /> : <User className="w-4 h-4 text-cyan-500" />}
                  </div>
                  <div className={"max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed " + (msg.role === "assistant" ? "bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 rounded-tl-sm" : "bg-violet-600 text-white rounded-tr-sm")}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-violet-500" />
                  </div>
                  <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
                    <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
            </div>
            <div className="border-t border-slate-200 dark:border-white/10 p-4">
              <div className="flex gap-3">
                <textarea rows={2} value={answer} onChange={e => setAnswer(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendAnswer(); } }}
                  placeholder="Type your answer here... (Press Enter to submit)"
                  disabled={loading}
                  className="flex-1 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-4 py-3 text-sm text-slate-700 dark:text-slate-300 resize-none focus:outline-none focus:border-violet-500 transition-colors disabled:opacity-50" />
                <button onClick={sendAnswer} disabled={loading || !answer.trim()}
                  className="w-12 h-12 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white rounded-2xl flex items-center justify-center transition-all self-end">
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-slate-400 text-xs mt-2 text-center">Answer all {MAX_Q} questions to get your performance report</p>
            </div>
          </div>
        )}

        {phase === "report" && report && (
          <div className="space-y-5">
            <div className={"rounded-[2rem] border-2 p-8 text-center " + (report.score >= 75 ? "border-green-500/30 bg-green-500/5" : report.score >= 50 ? "border-amber-500/30 bg-amber-500/5" : "border-red-500/30 bg-red-500/5")}>
              <Trophy className={"w-12 h-12 mx-auto mb-4 " + (report.score >= 75 ? "text-green-500" : report.score >= 50 ? "text-amber-500" : "text-red-500")} />
              <div className={"text-8xl font-black mb-2 " + (report.score >= 75 ? "text-green-500" : report.score >= 50 ? "text-amber-500" : "text-red-500")}>{report.score}</div>
              <div className="text-slate-400 text-sm mb-2">Interview Score / 100</div>
              <div className={"inline-block px-4 py-1.5 rounded-full text-sm font-bold mb-4 " + (report.score >= 75 ? "bg-green-500/15 text-green-600" : report.score >= 50 ? "bg-amber-500/15 text-amber-600" : "bg-red-500/15 text-red-600")}>Grade: {report.grade}</div>
              <p className="text-slate-700 dark:text-slate-300 font-medium">{report.verdict}</p>
              <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full mt-4 overflow-hidden">
                <div className={"h-full rounded-full transition-all duration-1000 " + (report.score >= 75 ? "bg-green-500" : report.score >= 50 ? "bg-amber-500" : "bg-red-500")} style={{ width: report.score + "%" }} />
              </div>
              <div className="mt-4 flex justify-center gap-2">
                <span className="text-slate-500 text-sm">{domain && domain.label}</span>
                <span className="text-slate-300">�</span>
                <span className="text-slate-500 text-sm">{fmt(timer)} total time</span>
                <span className="text-slate-300">�</span>
                <span className="text-slate-500 text-sm">{MAX_Q} questions</span>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              <div className="bg-green-500/5 border border-green-500/20 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <h3 className="text-green-600 dark:text-green-400 font-bold text-sm uppercase tracking-wider">Your Strengths</h3>
                </div>
                {(report.strengths || []).map((s, i) => (
                  <div key={i} className="flex items-start gap-2 mb-3 bg-green-500/5 rounded-xl p-3">
                    <span className="text-green-500 font-bold flex-shrink-0">+</span>
                    <p className="text-slate-700 dark:text-slate-300 text-sm">{s}</p>
                  </div>
                ))}
              </div>
              <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <h3 className="text-red-600 dark:text-red-400 font-bold text-sm uppercase tracking-wider">Areas to Improve</h3>
                </div>
                {(report.weaknesses || []).map((w, i) => (
                  <div key={i} className="flex items-start gap-2 mb-3 bg-red-500/5 rounded-xl p-3">
                    <span className="text-red-500 font-bold flex-shrink-0">-</span>
                    <p className="text-slate-700 dark:text-slate-300 text-sm">{w}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-5">
              <h3 className="text-slate-900 dark:text-white font-bold mb-4 text-sm uppercase tracking-wider">Topic-wise Performance</h3>
              {(report.topic_scores || []).map((t, i) => (
                <div key={i} className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600 dark:text-slate-300 font-medium">{t.topic}</span>
                    <span className={"font-bold " + (t.score >= 75 ? "text-green-500" : t.score >= 50 ? "text-amber-500" : "text-red-500")}>{t.score}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className={"h-full rounded-full " + (t.score >= 75 ? "bg-green-500" : t.score >= 50 ? "bg-amber-500" : "bg-red-500")} style={{ width: t.score + "%" }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-5">
              <h3 className="text-amber-600 font-bold mb-4 text-sm uppercase tracking-wider">Tips to Improve</h3>
              {(report.tips || []).map((t, i) => (
                <div key={i} className="flex items-start gap-2 mb-3">
                  <span className="text-amber-500 font-bold text-sm flex-shrink-0">{i + 1}</span>
                  <p className="text-slate-700 dark:text-slate-300 text-sm">{t}</p>
                </div>
              ))}
            </div>
            <div className="bg-violet-500/5 border border-violet-500/20 rounded-2xl p-5">
              <h3 className="text-violet-600 font-bold mb-2 text-sm uppercase tracking-wider">Next Steps</h3>
              <p className="text-slate-700 dark:text-slate-300 text-sm">{report.next_steps}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={reset} className="flex-1 bg-violet-600 hover:bg-violet-500 text-white font-semibold py-3 rounded-2xl text-sm transition-all flex items-center justify-center gap-2">
                <RotateCcw className="w-4 h-4" />Try Another Domain
              </button>
              <button onClick={() => startInterview(domain)} className="flex-1 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 font-semibold py-3 rounded-2xl text-sm hover:border-violet-500/40 transition-all flex items-center justify-center gap-2">
                <RotateCcw className="w-4 h-4" />Retry Same Domain
              </button>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}