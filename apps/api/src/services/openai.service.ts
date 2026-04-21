import OpenAI from "openai";
import { env } from "../config/env";

const client = env.OPENAI_API_KEY ? new OpenAI({ apiKey: env.OPENAI_API_KEY }) : null;

export async function maybeGenerateAiInsight(prompt: string) {
  if (!client) {
    return null;
  }

  const response = await client.responses.create({
    model: env.OPENAI_MODEL,
    input: prompt,
  });

  return response.output_text;
}
