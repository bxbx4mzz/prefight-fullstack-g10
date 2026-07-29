import type Anthropic from "@anthropic-ai/sdk";

export const eventTools: Anthropic.Tool[] = [
  {
    name: "list_events",
    description:
      "List the user's calendar events/tasks, optionally filtered by date range, status, or priority.",
    input_schema: {
      type: "object",
      properties: {
        from: { type: "string", description: "ISO date, inclusive lower bound" },
        to: { type: "string", description: "ISO date, inclusive upper bound" },
        status: { type: "string", enum: ["pending", "done", "cancelled"] },
        priority: { type: "number", description: "1 (highest) to 5 (lowest)" },
      },
    },
  },
  {
    name: "create_event",
    description: "Create a new calendar event/task for the user.",
    input_schema: {
      type: "object",
      required: ["title", "start_time"],
      properties: {
        title: { type: "string" },
        description: { type: "string" },
        start_time: { type: "string", description: "ISO 8601 datetime" },
        end_time: { type: "string", description: "ISO 8601 datetime" },
        priority: { type: "number", description: "1 (highest) to 5 (lowest), default 3" },
      },
    },
  },
  {
    name: "update_event",
    description: "Update one or more fields on an existing event, given its id.",
    input_schema: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "string" },
        title: { type: "string" },
        description: { type: "string" },
        start_time: { type: "string" },
        end_time: { type: "string" },
        priority: { type: "number" },
        status: { type: "string", enum: ["pending", "done", "cancelled"] },
      },
    },
  },
  {
    name: "delete_event",
    description: "Delete an event by id.",
    input_schema: {
      type: "object",
      required: ["id"],
      properties: { id: { type: "string" } },
    },
  },
];