import { parse } from "tldts";
import { dataStore } from "../repositories/data-store";
import { ScamVerdict } from "../types";
import { createId } from "../utils/id";
import { maybeGenerateAiInsight } from "./openai.service";

const suspiciousKeywords = ["registration fee", "security deposit", "urgent joining", "whatsapp hr", "guaranteed job"];
const trustedDomains = ["linkedin.com", "internshala.com", "wellfound.com", "greenhouse.io", "lever.co"];

function calculateRisk(input: string) {
  const normalized = input.toLowerCase();
  let score = 15;
  const reasons: string[] = [];
  const urlMatch = input.match(/https?:\/\/[^\s]+/i);
  const parsed = parse(urlMatch?.[0] ?? "");

  if (urlMatch) {
    if (!trustedDomains.some((domain) => (parsed.domain ?? "").includes(domain))) {
      score += 12;
      reasons.push("The domain is not in CampusOS trusted recruiting sources.");
    } else {
      score -= 10;
      reasons.push("The domain aligns with known recruiting or application platforms.");
    }
  } else {
    score += 10;
    reasons.push("No formal application domain was supplied.");
  }

  if (parsed.domain && !urlMatch?.[0].startsWith("https://")) {
    score += 8;
    reasons.push("The link is not using HTTPS.");
  }

  suspiciousKeywords.forEach((keyword) => {
    if (normalized.includes(keyword)) {
      score += 14;
      reasons.push(`Detected suspicious phrase: "${keyword}".`);
    }
  });

  if (/gmail\.com|yahoo\.com|hotmail\.com/i.test(normalized)) {
    score += 9;
    reasons.push("The opportunity references a generic email domain instead of an official company mailbox.");
  }

  if (/immediate|today only|limited slots|dm now|urgent/i.test(normalized)) {
    score += 10;
    reasons.push("Urgency-heavy language is commonly used in scam outreach.");
  }

  score = Math.max(0, Math.min(100, score));

  let verdict: ScamVerdict = "safe";
  if (score >= 65) {
    verdict = "scam";
  } else if (score >= 35) {
    verdict = "suspicious";
  }

  return {
    verdict,
    confidence: score,
    reasons,
  };
}

export async function analyzeScam(input: string) {
  const analysis = calculateRisk(input);
  const aiSummary = await maybeGenerateAiInsight(
    `You are a scam analyst for students. Assess this opportunity text or link and explain the risk in 3 bullet-style sentences:\n${input}`,
  );

  const report = dataStore.addScamReport({
    id: createId("scam"),
    input,
    verdict: analysis.verdict,
    confidence: analysis.confidence,
    reasons: analysis.reasons,
    createdAt: new Date().toISOString(),
  });

  return {
    ...report,
    aiSummary:
      aiSummary ??
      "CampusOS flagged a mix of domain uncertainty, recruiter trust issues, and urgency patterns commonly seen in fake job outreach.",
  };
}
