const fs = require("fs");

const filePath = "C:/Users/Dell/Desktop/campus Os/2026-04-20-you-are-a-senior-full-stack-2/apps/web/src/app/resume-checker/page.tsx";

let code = fs.readFileSync(filePath, "utf8");

const badLine = `const t = "CampusOS Resume Report\nScore: " + result.score + "/100\nVerdict: " + result.verdict + "\n\nStrengths:\n" + (result.strengths || []).join("\n") + "\n\nMissing:\n" + (result.missing || []).join("\n");`;

const goodLine = `const lines = ["CampusOS Resume Report", "Score: " + result.score + "/100", "Verdict: " + result.verdict, "", "Strengths:", (result.strengths || []).join(", "), "", "Missing:", (result.missing || []).join(", ")]; const t = lines.join("\\n");`;

code = code.replace(badLine, goodLine);

fs.writeFileSync(filePath, code, "utf8");
console.log("Fixed!");
