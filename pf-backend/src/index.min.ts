import "dotenv/config";
import express from "express";
import { dbClient } from "@db/client.js";
import { eventsTable } from "@db/schema.js";
 
const app = express();
app.use(express.json());
 
app.post("/calendar/events", async (req, res) => {
  try {
    const { title, description, date, time } = req.body;
 
    await dbClient.insert(eventsTable).values({
      title,
      description: description || null,
      date,
      time: time || null,
    });
 
    res.status(201).json({ message: "บันทึก Event สำเร็จ!" });
  } catch (error) {
    console.error("Error inserting event:", error);
    res.status(500).json({ error: "ไม่สามารถบันทึกข้อมูลได้" });
  }
});
 
app.get("/calendar/events", async (req, res) => {
  try {
    const results = await dbClient.query.eventsTable.findMany();
    res.json(results);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "ไม่สามารถดึงข้อมูลได้" });
  }
});
 
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
 