const fs = require("fs");
const path = "C:/Users/Dell/Desktop/campus Os/2026-04-20-you-are-a-senior-full-stack-2/apps/web/src/app/resume-checker/page.tsx";
let code = fs.readFileSync(path, "utf8");
code = code.replace(
  'import { ExternalLink, Download, RefreshCw, CheckCircle, XCircle, AlertCircle, BookOpen, Youtube, Lightbulb, Target, TrendingUp, Award, Briefcase, FileText } from "lucide-react";',
  'import { ExternalLink, Download, RefreshCw, CheckCircle, XCircle, AlertCircle, BookOpen, PlayCircle, Lightbulb, Target, TrendingUp, Award, Briefcase, FileText } from "lucide-react";'
);
code = code.replace(/<Youtube /g, "<PlayCircle ");
code = code.replace(/<Youtube\/>/g, "<PlayCircle/>");
fs.writeFileSync(path, code, "utf8");
console.log("Fixed! Youtube replaced with PlayCircle.");
