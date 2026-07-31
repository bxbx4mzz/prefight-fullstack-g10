import { Router } from "express";
import * as eventService from "../service/event.service.js";

export const eventsRouter = Router();

// same auth note as chat/overview routes — replace with the real user id
eventsRouter.get("/", async (req, res) => {
  const userId = (req as any).user?.id;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  const events = await eventService.listEvents(userId, req.query as any);
  res.json(events);
});

eventsRouter.post("/", async (req, res) => {
  console.log("BODY:", req.body);
  const userId = (req as any).user?.id;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const { title, description, start_time, end_time, priority, status } = req.body ?? {};
  if (!title || !start_time) {
    return res.status(400).json({ error: "title and start_time are required" });
  }

  const event = await eventService.createEvent(userId, {
    title,
    description,
    start_time,
    end_time,
    priority,
    status: status ?? "TODO",
  });
  res.status(201).json(event);
});

eventsRouter.patch("/:id", async (req, res) => {
  const userId = (req as any).user?.id;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const event = await eventService.updateEvent(userId, req.params.id, req.body ?? {});
  if (!event) return res.status(404).json({ error: "Not found" });
  res.json(event);
});

eventsRouter.delete("/:id", async (req, res) => {
  const userId = (req as any).user?.id;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const event = await eventService.deleteEvent(userId, req.params.id);
  if (!event) return res.status(404).json({ error: "Not found" });
  res.json(event);
});