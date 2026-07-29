import {
  pgTable,
  timestamp,
  uuid,
  varchar,
  boolean,
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
