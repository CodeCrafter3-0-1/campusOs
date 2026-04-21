import { dataStore } from "../repositories/data-store";
import { maybeGenerateAiInsight } from "./openai.service";

const synonymMap: Record<string, string[]> = {
  placement: ["interview", "placement", "job", "campus"],
  react: ["react", "frontend", "ui", "javascript"],
  dsa: ["dsa", "algorithm", "data structure", "problem solving"],
  system: ["system design", "architecture", "api", "database", "backend"],
  dbms: ["dbms", "sql", "database", "normalization"],
};

function scoreQueryAgainstResource(query: string, resource: typeof dataStore.resources[number]) {
  const normalizedQuery = query.toLowerCase();
  const terms = normalizedQuery.split(/\s+/).filter(Boolean);
  let score = resource.scoreBoost ?? 0;
  const haystack = `${resource.title} ${resource.subject} ${resource.description} ${resource.tags.join(" ")}`.toLowerCase();

  for (const term of terms) {
    if (haystack.includes(term)) {
      score += 4;
    }

    for (const [topic, synonyms] of Object.entries(synonymMap)) {
      if (term.includes(topic) || synonyms.some((synonym) => normalizedQuery.includes(synonym))) {
        if (synonyms.some((synonym) => haystack.includes(synonym))) {
          score += 3;
        }
      }
    }
  }

  if (resource.offlineAvailable) {
    score += 1;
  }

  return score;
}

export async function searchResources(query: string) {
  const ranked = [...dataStore.resources]
    .map((resource) => ({
      ...resource,
      semanticScore: scoreQueryAgainstResource(query, resource),
    }))
    .sort((left, right) => right.semanticScore - left.semanticScore)
    .slice(0, 4);

  const aiSummary = await maybeGenerateAiInsight(
    `You are an educational search assistant. Summarize why these resources fit the query "${query}" in under 90 words:\n${ranked
      .map((resource) => `- ${resource.title}: ${resource.description}`)
      .join("\n")}`,
  );

  return {
    query,
    aiSummary:
      aiSummary ??
      "CampusOS used semantic topic matching, placement relevance, and offline access signals to surface the strongest learning resources.",
    results: ranked,
  };
}
