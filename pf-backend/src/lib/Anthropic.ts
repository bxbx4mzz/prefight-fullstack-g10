import Anthropic from "@anthropic-ai/sdk";

// requires ANTHROPIC_API_KEY in your .env — get one from console.anthropic.com
export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// check docs.anthropic.com for the current model list/pricing before shipping
export const CHAT_MODEL = "claude-sonnet-5";