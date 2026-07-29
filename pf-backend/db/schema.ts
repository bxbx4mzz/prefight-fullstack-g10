import {
  pgTable,
  timestamp,
  uuid,
  varchar,
  boolean,
  text,
  integer,
  jsonb
} from "drizzle-orm/pg-core";

export const todoTable = pgTable("todo", {
  id: uuid("id").primaryKey().defaultRandom(),
  todoText: varchar("todo_text", { length: 255 }).notNull(),
  isDone: boolean("is_done").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date", precision: 3 }).$onUpdate(
    () => new Date()
  ),
});

export const chatMessages = pgTable("chat_messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" }) //import user from login
    .notNull(),
  role: text("role").notNull(), // 'user' | 'assistant' | 'tool'
  content: text("content").notNull(),
  toolCalls: jsonb("tool_calls"), // raw tool_use / tool_result payload, handy for debugging
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Placeholder table — check with whoever is building the calendar feature
// before this ships, so we don't end up with two different "events" tables.
// Column names here are what chat.service / overview.service expect.
export const events = pgTable("events", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" }) //import user from login
    .notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time"),
  priority: integer("priority").default(3).notNull(), // 1 (highest) – 5 (lowest)
  status: varchar("status", { length: 20 }).default("pending").notNull(), // pending | done | cancelled
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date", precision: 3 }).$onUpdate(
    () => new Date()
  ),
});