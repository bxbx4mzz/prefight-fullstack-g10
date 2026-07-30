import express from 'express';
import cors from 'cors';
import { eq } from 'drizzle-orm'; 
import { dbClient } from "@db/client.js";
import { eventsTable } from "@db/schema.js";
const app = express();


app.use(cors());
app.use(express.json());


app.post('/api/events', async (req, res) => {
  try {
    const { title, description, date, time } = req.body;

    if (!title || !date || !time) {
      return res.status(400).json({ error: "ข้อมูลไม่ครบถ้วน (title, date, time จำเป็นต้องมี)" });
    }

    await dbClient.insert(eventsTable).values({
      title: title,
      date: date,
      description: description,
      time: time
    });

    res.status(201).json({ message: "บันทึกข้อมูลลงฐานข้อมูลสำเร็จ!" });
  } catch (error) {
    console.error("Database Insert Error:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการบันทึกข้อมูล" });
  }
});


app.get('/api/events', async (req, res) => {
  try {
    const allEvents = await dbClient.select().from(eventsTable);
    res.status(200).json(allEvents);
  } catch (error) {
    console.error("Database Fetch Error:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูล" });
  }
});


app.put('/api/events/:id', async (req, res) => {
  try {
    const eventId = Number(req.params.id); 
    const { title, description, date, time } = req.body; 

    if (isNaN(eventId)) {
      return res.status(400).json({ error: "ID ต้องเป็นตัวเลขเท่านั้น" });
    }

    await dbClient.update(eventsTable)
      .set({
        title: title,
        date: date,
        description: description,
        time: time
      })
      .where(eq(eventsTable.id, eventId)); 

    res.status(200).json({ message: "อัปเดตข้อมูลสำเร็จ!" });
  } catch (error) {
    console.error("Database Update Error:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล" });
  }
});


app.delete('/api/events/:id', async (req, res) => {
  try {
    const eventId = Number(req.params.id); // รับ ID จาก URL

    if (isNaN(eventId)) {
      return res.status(400).json({ error: "ID ต้องเป็นตัวเลขเท่านั้น" });
    }

    await dbClient.delete(eventsTable)
      .where(eq(eventsTable.id, eventId));

    res.status(200).json({ message: "ลบข้อมูลสำเร็จ!" });
  } catch (error) {
    console.error("Database Delete Error:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการลบข้อมูล" });
  }
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});