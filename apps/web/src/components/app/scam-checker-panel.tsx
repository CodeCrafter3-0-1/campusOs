"use client";
import { useState } from "react";
import { ShieldCheck, ShieldX, AlertTriangle, CheckCircle, XCircle, AlertCircle, Eye, Lock, Globe, MessageSquare, DollarSign, User, Phone, ExternalLink, Copy, RotateCcw } from "lucide-react";

async function analyzeScam(text: string) {
  const fmt = {
    verdict: "SCAM",
    confidence: 85,
    risk_level: "HIGH",
    summary: "2-3 sentence overall analysis",
    what_to_do_now: "Exact next steps the student should take",
    red_flags: [{ flag: "flag title", detail: "why this is suspicious", severity: "HIGH" }],
    green_flags: [{ flag: "flag title", detail: "why this seems legitimate" }],
    domain_analysis: { verdict: "SUSPICIOUS", detail: "analysis of email domain and contact info" },
    language_analysis: { verdict: "SUSPICIOUS", detail: "analysis of urgency and pressure tactics" },
    payment_analysis: { verdict: "SCAM", detail: "any payment requests mentioned" },
    identity_analysis: { verdict: "SAFE", detail: "analysis of who is reaching out" },
    safe_percentage: 15,
    scam_percentage: 85,
    similar_scams: ["Type of known scam this resembles"],
    verification_steps: ["Step 1 to verify", "Step 2"],
    report_to: ["Where to report this scam"]
  };

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + process.env.NEXT_PUBLIC_GROQ_API_KEY
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      max_tokens: 2048,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: "You are a scam detection expert for Indian student job market. Always respond with ONLY a valid JSON object matching the exact format given. No extra text, no markdown."
        },
        {
          role: "user",
          content: "Analyze this text for job scam indicators. Reply ONLY with JSON in this exact format: " + JSON.stringify(fmt) + "\n\nText to analyze:\n" + text
        }
      ]
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || "API error " + res.status);
  }

  const data = await res.json();
  const raw = (data.choices?.[0]?.message?.content || "").trim();
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Invalid response from AI. Please try again.");
  return JSON.parse(jsonMatch[0]);
}

const EXAMPLES = [
  { label: "Fake Internship", text: "Urgent internship offer! You have been selected. Pay Rs 2000 registration fee today. Contact HR on WhatsApp: 9876543210. hrteam@gmail.com. Joining in 24 hours or offer expires." },
  { label: "Real Job Post", text: "Tata Consultancy Services is hiring Software Developer Trainees. Apply at careers.tcs.com. Eligibility: B.Tech/MCA 2024/2025 batch. CGPA above 6. No fees required. Interview process: Online test, Technical round, HR round." },
  { label: "Suspicious LinkedIn", text: "Hi, I saw your profile and you are perfect for our opening. We offer work from home job, Rs 50000 per month, just 2 hours daily. No experience needed. Send your Aadhar and bank details to start immediately." },
];

function RiskMeter({ score }: { score: number }) {
  const color = score >= 70 ? "text-red-500" : score >= 40 ? "text-amber-500" : "text-green-500";
  const bg = score >= 70 ? "bg-red-500" : score >= 40 ? "bg-amber-500" : "bg-green-500";
  const label = score >= 70 ? "HIGH RISK" : score >= 40 ? "MEDIUM RISK" : "LOW RISK";
  return (
    <div className="text-center">
      <div className={"text-7xl font-black " + color}>{score}%</div>
      <div className={"text-xs font-bold tracking-widest mt-1 " + color}>{label}</div>
      <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full mt-3 overflow-hidden">
        <div className={"h-full rounded-full transition-all duration-1000 " + bg} style={{ width: score + "%" }} />
      </div>
      <div className="flex justify-between text-xs text-slate-400 mt-1">
        <span>Safe</span><span>Risky</span><span>Scam</span>
      </div>
    </div>
  );
}

function AnalysisCard({ icon: Icon, title, verdict, detail }: { icon: any; title: string; verdict: string; detail: string }) {
  const colors: Record<string, string[]> = {
    safe: ["bg-green-500/5", "border-green-500/20", "text-green-500"],
    suspicious: ["bg-amber-500/5", "border-amber-500/20", "text-amber-500"],
    scam: ["bg-red-500/5", "border-red-500/20", "text-red-500"],
  };
  const v = (verdict || "suspicious").toLowerCase();
  const [bg, border, text] = colors[v] || colors.suspicious;
  return (
    <div className={"rounded-2xl border p-4 " + bg + " " + border}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className={"w-4 h-4 " + text} />
        <span className={"text-xs font-bold uppercase tracking-wider " + text}>{title}</span>
        <span className={"ml-auto text-xs font-bold px-2 py-0.5 rounded-full border " + bg + " " + border + " " + text}>{verdict}</span>
      </div>
      <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">{detail}</p>
    </div>
  );
}

export function ScamCheckerPanel() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const analyze = async () => {
    if (!input.trim()) { setError("Paste a job posting or message first."); return; }
    setError(""); setLoading(true); setResult(null);
    try { setResult(await analyzeScam(input)); }
    catch (e: any) { setError("Error: " + e.message); }
    setLoading(false);
  };

  const copy = () => {
    if (!result) return;
    const lines = ["CampusOS Scam Analysis Report", "========================", "Verdict: " + result.verdict, "Scam Risk: " + result.scam_percentage + "%", "Summary: " + result.summary, "", "RED FLAGS:"];
    (result.red_flags || []).forEach((f: any) => lines.push("- " + f.flag + ": " + f.detail));
    lines.push("", "WHAT TO DO NOW:", result.what_to_do_now);
    navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const verdictConfig: Record<string, any> = {
    SAFE: { icon: ShieldCheck, color: "text-green-500", bg: "bg-green-500/10 border-green-500/30", label: "SAFE" },
    SUSPICIOUS: { icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-500/10 border-amber-500/30", label: "SUSPICIOUS" },
    SCAM: { icon: ShieldX, color: "text-red-500", bg: "bg-red-500/10 border-red-500/30", label: "SCAM DETECTED" },
  };
  const vc = result ? (verdictConfig[result.verdict] || verdictConfig.SUSPICIOUS) : null;

  return (
    <div className="space-y-5">
      <div className="rounded-[2rem] border border-slate-200/80 bg-white/70 p-6 dark:border-white/10 dark:bg-white/5">
        <div className="flex items-center gap-2 mb-4">
          <Eye className="w-4 h-4 text-cyan-500" />
          <span className="text-cyan-600 dark:text-cyan-300 text-xs font-bold uppercase tracking-wider">Quick Examples</span>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {EXAMPLES.map(ex => (
            <button key={ex.label} onClick={() => setInput(ex.text)}
              className="px-3 py-1.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:border-cyan-500/40 hover:text-cyan-600 transition-all">
              {ex.label}
            </button>
          ))}
        </div>
        <textarea rows={6} value={input} onChange={e => setInput(e.target.value)}
          placeholder="Paste the full job posting, WhatsApp message, email, or internship offer here..."
          className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 text-sm text-slate-700 dark:text-slate-300 resize-none focus:outline-none focus:border-cyan-500 transition-colors leading-relaxed" />
        {error && (
          <div className="mt-3 bg-red-500/10 border border-red-500/30 rounded-xl p-3">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
        <div className="flex gap-3 mt-4">
          <button onClick={analyze} disabled={loading}
            className="flex-1 bg-slate-950 dark:bg-white hover:opacity-90 disabled:opacity-50 text-white dark:text-slate-950 font-semibold py-3 rounded-2xl text-sm transition-all flex items-center justify-center gap-2">
            {loading
              ? (<><div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />Analyzing...</>)
              : (<><ShieldX className="w-4 h-4" />Analyze for Scam</>)}
          </button>
          {result && (
            <button onClick={() => { setResult(null); setInput(""); }}
              className="px-4 py-3 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-500 hover:border-red-500/30 hover:text-red-500 transition-all">
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {loading && (
        <div className="rounded-[2rem] border border-slate-200/80 bg-white/70 p-12 text-center dark:border-white/10 dark:bg-white/5">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
          <p className="text-slate-800 dark:text-white font-bold text-lg mb-2">AI is scanning for scam signals...</p>
          <div className="space-y-2 mt-4 max-w-xs mx-auto">
            {["Checking domain trust signals","Analyzing language patterns","Detecting payment requests","Verifying contact credibility","Generating safety report"].map((s, i) => (
              <div key={i} className="flex items-center gap-2 text-slate-400 text-sm">
                <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse" style={{ animationDelay: i * 200 + "ms" }} />
                {s}
              </div>
            ))}
          </div>
        </div>
      )}

      {result && vc && (
        <div className="space-y-5">
          <div className={"rounded-[2rem] border-2 p-8 " + vc.bg}>
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="text-center flex-shrink-0">
                <vc.icon className={"w-16 h-16 mx-auto mb-4 " + vc.color} />
                <div className={"text-2xl font-black px-6 py-2 rounded-2xl border-2 " + vc.bg + " " + vc.color}>{vc.label}</div>
                <div className="mt-4"><RiskMeter score={result.scam_percentage} /></div>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                  <h2 className="text-slate-900 dark:text-white font-bold text-xl">Analysis Summary</h2>
                  <button onClick={copy} className="flex items-center gap-1.5 text-xs border border-slate-200 dark:border-white/10 px-3 py-1.5 rounded-xl text-slate-500 hover:border-cyan-500/30 hover:text-cyan-500 transition-all">
                    <Copy className="w-3.5 h-3.5" />{copied ? "Copied!" : "Copy Report"}
                  </button>
                </div>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-4">{result.summary}</p>
                <div className="flex gap-4 flex-wrap">
                  <div className="text-center"><div className="text-green-500 font-black text-2xl">{result.safe_percentage}%</div><div className="text-slate-400 text-xs">Safe signals</div></div>
                  <div className="w-px bg-slate-200 dark:bg-white/10" />
                  <div className="text-center"><div className="text-red-500 font-black text-2xl">{result.scam_percentage}%</div><div className="text-slate-400 text-xs">Scam signals</div></div>
                  <div className="w-px bg-slate-200 dark:bg-white/10" />
                  <div className="text-center"><div className="text-slate-800 dark:text-white font-black text-2xl">{result.red_flags?.length || 0}</div><div className="text-slate-400 text-xs">Red flags</div></div>
                  <div className="w-px bg-slate-200 dark:bg-white/10" />
                  <div className="text-center"><div className="text-slate-800 dark:text-white font-black text-2xl">{result.green_flags?.length || 0}</div><div className="text-slate-400 text-xs">Green flags</div></div>
                </div>
              </div>
            </div>
          </div>

          <div className={"rounded-[2rem] border-2 p-6 " + (result.scam_percentage >= 70 ? "border-red-500/40 bg-red-500/5" : result.scam_percentage >= 40 ? "border-amber-500/40 bg-amber-500/5" : "border-green-500/40 bg-green-500/5")}>
            <div className="flex items-start gap-3">
              <AlertCircle className={"w-5 h-5 flex-shrink-0 mt-0.5 " + (result.scam_percentage >= 70 ? "text-red-500" : result.scam_percentage >= 40 ? "text-amber-500" : "text-green-500")} />
              <div>
                <h3 className="text-slate-900 dark:text-white font-bold mb-2">What You Should Do RIGHT NOW</h3>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">{result.what_to_do_now}</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <XCircle className="w-4 h-4 text-red-500" />
                <h3 className="text-red-500 font-bold text-sm uppercase tracking-wider">Red Flags ({result.red_flags?.length || 0})</h3>
              </div>
              {result.red_flags?.length > 0 ? result.red_flags.map((f: any, i: number) => (
                <div key={i} className="mb-4 bg-red-500/5 border border-red-500/10 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-red-500 font-semibold text-sm">{f.flag}</span>
                    <span className={"text-xs font-bold px-2 py-0.5 rounded-full " + (f.severity === "HIGH" ? "bg-red-500/20 text-red-500" : "bg-amber-500/20 text-amber-500")}>{f.severity}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">{f.detail}</p>
                </div>
              )) : <p className="text-slate-400 text-sm">No red flags detected</p>}
            </div>
            <div className="bg-green-500/5 border border-green-500/20 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <h3 className="text-green-500 font-bold text-sm uppercase tracking-wider">Green Flags ({result.green_flags?.length || 0})</h3>
              </div>
              {result.green_flags?.length > 0 ? result.green_flags.map((f: any, i: number) => (
                <div key={i} className="mb-4 bg-green-500/5 border border-green-500/10 rounded-xl p-3">
                  <span className="text-green-500 font-semibold text-sm block mb-1">{f.flag}</span>
                  <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">{f.detail}</p>
                </div>
              )) : <p className="text-slate-400 text-sm">No green flags detected</p>}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <AnalysisCard icon={Globe} title="Domain Analysis" verdict={result.domain_analysis?.verdict} detail={result.domain_analysis?.detail} />
            <AnalysisCard icon={MessageSquare} title="Language Analysis" verdict={result.language_analysis?.verdict} detail={result.language_analysis?.detail} />
            <AnalysisCard icon={DollarSign} title="Payment Analysis" verdict={result.payment_analysis?.verdict} detail={result.payment_analysis?.detail} />
            <AnalysisCard icon={User} title="Identity Analysis" verdict={result.identity_analysis?.verdict} detail={result.identity_analysis?.detail} />
          </div>

          <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-5">
            <h3 className="text-slate-700 dark:text-white font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <Lock className="w-4 h-4 text-cyan-500" />Steps to Verify if This is Real
            </h3>
            {(result.verification_steps || []).map((s: string, i: number) => (
              <div key={i} className="flex items-start gap-3 mb-3 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-xl p-3">
                <div className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-500 text-xs font-bold flex-shrink-0">{i + 1}</div>
                <p className="text-slate-600 dark:text-slate-300 text-sm">{s}</p>
              </div>
            ))}
          </div>

          {result.report_to?.length > 0 && (
            <div className="bg-violet-500/5 border border-violet-500/20 rounded-2xl p-5">
              <h3 className="text-violet-600 dark:text-violet-400 font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                <Phone className="w-4 h-4" />Where to Report This Scam
              </h3>
              {result.report_to.map((r: string, i: number) => (
                <div key={i} className="flex items-center gap-2 mb-2">
                  <ExternalLink className="w-3.5 h-3.5 text-violet-500 flex-shrink-0" />
                  <p className="text-slate-600 dark:text-slate-300 text-sm">{r}</p>
                </div>
              ))}
              <div className="mt-4 pt-4 border-t border-violet-500/20">
                <p className="text-violet-600 dark:text-violet-400 text-xs font-semibold">National Cyber Crime Helpline: 1930 | cybercrime.gov.in</p>
              </div>
            </div>
          )}

          <div className="bg-slate-900 dark:bg-white/5 border border-slate-700 dark:border-white/10 rounded-2xl p-5">
            <h3 className="text-white font-bold text-sm mb-3">Student Safety Reminders</h3>
            <div className="grid md:grid-cols-2 gap-2">
              {["Legitimate companies NEVER ask for registration or security fees","Real HR teams use company email, not Gmail or WhatsApp","No genuine job offer expires in 24 hours","Never share Aadhar, PAN, or bank details before joining","Always verify company on LinkedIn and official website","Call the company directly using numbers from their official site"].map((tip, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-cyan-400 text-xs mt-0.5 flex-shrink-0">*</span>
                  <p className="text-slate-300 text-xs">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
