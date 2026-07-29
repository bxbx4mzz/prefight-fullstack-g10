import type Anthropic from "@anthropic-ai/sdk";
import { anthropic, CHAT_MODEL } from "../lib/Anthropic.js";
import { eventTools } from "../tools/Event.tools.js";
import * as eventService from "./event.service.js";
import { getHistory, saveMessage } from "./chat.service.js";

const SYSTEM_PROMPT = `You are a calendar assistant. You help the user add, edit, delete,
and review their tasks/events using the provided tools. Always call a tool to read or
change data — never claim to have done something without actually calling the matching
tool. Priority is a number from 1 (highest) to 5 (lowest); default to 3 if the user
doesn't specify one. Keep replies short and confirm what changed.`;

const MAX_TOOL_ROUNDS = 4; // safety cap so a confused model can't loop forever

async function runTool(userId: string, name: string, input: any) {
  switch (name) {
    case "list_events":
      return eventService.listEvents(userId, input);
    case "create_event":
      return eventService.createEvent(userId, input);
    case "update_event":
      return eventService.updateEvent(userId, input.id, input);
    case "delete_event":
      return eventService.deleteEvent(userId, input.id);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export async function chat(userId: string, userMessage: string): Promise<string> {
  await saveMessage(userId, "user", userMessage);

  const history = await getHistory(userId);
  const messages: Anthropic.MessageParam[] = history.map((m) => ({
    role: m.role === "assistant" ? "assistant" : "user",
    content: m.content,
  }));

  let round = 0;
  let finalText = "";

  while (round < MAX_TOOL_ROUNDS) {
    round++;

    const response = await anthropic.messages.create({
      model: CHAT_MODEL,
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      tools: eventTools,
      messages,
    });

    const toolUses = response.content.filter(
      (b): b is Anthropic.ToolUseBlock => b.type === "tool_use"
    );
    const textBlocks = response.content.filter(
      (b): b is Anthropic.TextBlock => b.type === "text"
    );
    finalText = textBlocks.map((b) => b.text).join("\n");

    if (response.stop_reason !== "tool_use" || toolUses.length === 0) {
      break; // model is done, no more tools to run
    }

    // echo the assistant's tool-use turn back into the conversation
    messages.push({ role: "assistant", content: response.content });

    const toolResults: Anthropic.ToolResultBlockParam[] = [];
    for (const use of toolUses) {
      try {
        const result = await runTool(userId, use.name, use.input);
        toolResults.push({
          type: "tool_result",
          tool_use_id: use.id,
          content: JSON.stringify(result ?? null),
        });
      } catch (err) {
        toolResults.push({
          type: "tool_result",
          tool_use_id: use.id,
          content: `Error: ${(err as Error).message}`,
          is_error: true,
        });
      }
    }
    messages.push({ role: "user", content: toolResults });
  }

  await saveMessage(userId, "assistant", finalText);
  return finalText;
}