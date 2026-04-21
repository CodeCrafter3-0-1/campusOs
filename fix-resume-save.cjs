const fs = require("fs");
const path = "C:/Users/Dell/Desktop/campus Os/2026-04-20-you-are-a-senior-full-stack-2/apps/web/src/app/resume-checker/page.tsx";
let code = fs.readFileSync(path, "utf8");

// Add auth import after first import line
code = code.replace(
  'import { AppShell } from "@/components/app/app-shell";',
  'import { AppShell } from "@/components/app/app-shell";\nimport { getUser, updateUserResume } from "@/lib/auth";'
);

// Save result after setResult
code = code.replace(
  "try { setResult(await analyzeResume(text, role)); }",
  'try { const r = await analyzeResume(text, role); setResult(r); updateUserResume({ resumeScore: r.score, resumeVerdict: r.verdict, resumeStrengths: r.strengths, resumeMissing: r.missing }); }'
);

fs.writeFileSync(path, code, "utf8");
console.log("Resume checker now saves to user profile!");
