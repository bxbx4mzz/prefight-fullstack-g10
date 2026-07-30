import { eq } from "drizzle-orm";
import { dbClient, dbConn } from "@db/client.js";
import { eventsTable } from "@db/schema.js";

async function insertData() {
  await dbClient.insert(eventsTable).values({
    title: "Finish reading",
    description: "Read the drizzle docs",
    date: "2026-08-01",
    time: "09:00",
  });
  dbConn.end();
}

async function queryData() {
  const results = await dbClient.query.eventsTable.findMany();
  console.log(results);
  dbConn.end();
}

async function updateData() {
  const results = await dbClient.query.eventsTable.findMany();
  if (results.length === 0) dbConn.end();

  const id = results[0].id;
  await dbClient
    .update(eventsTable)
    .set({
      title: "Updated title",
    })
    .where(eq(eventsTable.id, id));
  dbConn.end();
}

async function deleteData() {
  const results = await dbClient.query.eventsTable.findMany();
  if (results.length === 0) dbConn.end();

  const id = results[0].id;
  await dbClient.delete(eventsTable).where(eq(eventsTable.id, id));
  dbConn.end();
}

// insertData();
queryData();
// updateData();
// deleteData();