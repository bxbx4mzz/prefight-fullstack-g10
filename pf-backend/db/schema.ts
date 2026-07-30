import { pgTable, serial, text, date, time } from 'drizzle-orm/pg-core';

export const eventsTable = pgTable('events', {
  id: serial('id').primaryKey(), 
  title: text('title').notNull(),
  description: text('description'),
  date: date('date').notNull(), 
  time: time('time').notNull(), 
});