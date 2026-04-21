import { maybeGenerateAiInsight } from "./openai.service";

export async function analyzeResume(resumeText: string, targetRole: string) {
  const strengths: string[] = [];
  const improvements: string[] = [];

  if (resumeText.toLowerCase().includes("project")) {
    strengths.push("Projects are present, which helps demonstrate execution beyond coursework.");
  } else {
    improvements.push("Add 2 to 3 strong projects with measurable outcomes.");
  }

  if (resumeText.toLowerCase().includes("intern")) {
    strengths.push("Experience signals are visible, which improves trust with recruiters.");
  } else {
    improvements.push("Include internships, freelance work, or leadership experience if available.");
  }

  if (!/\d+%|\d+\+|increased|reduced|built/i.test(resumeText)) {
    improvements.push("Use measurable impact bullets instead of generic responsibility statements.");
  } else {
    strengths.push("Quantified achievements increase credibility and recruiter scanability.");
  }

  const aiSummary = await maybeGenerateAiInsight(
    `Review this student resume for a ${targetRole} role. Give concise actionable guidance.\nResume:\n${resumeText}`,
  );

  return {
    targetRole,
    strengths,
    improvements,
    aiSummary:
      aiSummary ??
      "The resume has a promising base, but the strongest upgrade is to make each bullet outcome-driven and tailored to the role.",
  };
}

export function analyzeSkillGap(studentSkills: string[], requiredSkills: string[]) {
  const normalizedStudentSkills = studentSkills.map((skill) => skill.toLowerCase());
  const matchedSkills = requiredSkills.filter((skill) => normalizedStudentSkills.includes(skill.toLowerCase()));
  const missingSkills = requiredSkills.filter((skill) => !normalizedStudentSkills.includes(skill.toLowerCase()));

  return {
    matchedSkills,
    missingSkills,
    completionScore: Math.round((matchedSkills.length / Math.max(requiredSkills.length, 1)) * 100),
    roadmap: missingSkills.map((skill, index) => ({
      phase: index + 1,
      skill,
      action: `Build one focused project and one revision note set for ${skill}.`,
    })),
  };
}

export async function generateCareerRoadmap(goal: string, currentSkills: string[]) {
  const aiSummary = await maybeGenerateAiInsight(
    `Create a concise 4-step roadmap for a student targeting "${goal}" with current skills: ${currentSkills.join(", ")}.`,
  );

  return {
    goal,
    currentSkills,
    roadmap: [
      "Strengthen foundations with interview-focused revision and one capstone project.",
      "Build public proof: resume, digital profile, GitHub projects, and portfolio case studies.",
      "Practice role-specific mock interviews and solve targeted job-ready assignments.",
      "Apply through verified channels and track feedback loops every week.",
    ],
    aiSummary:
      aiSummary ??
      "Your next leap comes from pairing visible proof of skill with verified opportunities and a disciplined weekly feedback loop.",
  };
}
