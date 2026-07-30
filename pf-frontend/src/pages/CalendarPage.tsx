import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";

interface CalendarEvent {
  id: number;
  title: string;
  description?: string;
  date: string;
  time?: string;
}

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [currentMonth, setCurrentMonth] = useState(dayjs());

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<number | null>(null);

  const [selectedDate, setSelectedDate] = useState("");
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventTime, setNewEventTime] = useState("");
  const [newEventDesc, setNewEventDesc] = useState("");

  async function fetchCalendarData() {
    try {
      const res = await axios.get<CalendarEvent[]>("/api/calendar/events");
      setEvents(res.data);
    } catch (error) {
      console.error("Error fetching calendar data:", error);
    }
  }

  useEffect(() => {
    fetchCalendarData();
  }, []);

  const prevMonth = () => setCurrentMonth(currentMonth.subtract(1, "month"));
  const nextMonth = () => setCurrentMonth(currentMonth.add(1, "month"));
  const goToToday = () => setCurrentMonth(dayjs());

  const openNewEventModal = (dateStr: string) => {
    setSelectedDate(dateStr);
    setNewEventTitle("");
    setNewEventTime("");
    setNewEventDesc("");
    setEditingEventId(null);
    setIsModalOpen(true);
  };

  const openEditEventModal = (e: React.MouseEvent, event: CalendarEvent) => {
    e.stopPropagation();
    setSelectedDate(event.date);
    setNewEventTitle(event.title);
    setNewEventTime(event.time || "");
    setNewEventDesc(event.description || "");
    setEditingEventId(event.id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingEventId(null);
  };

  const handleSaveEvent = async () => {
    if (!newEventTitle.trim()) return;

    try {
      const eventPayload = {
        title: newEventTitle,
        description: newEventDesc,
        date: selectedDate,
        time: newEventTime,
        color: "#1a73e8",
      };

      if (editingEventId) {
        await axios.put(`/api/calendar/events/${editingEventId}`, eventPayload);
      } else {
        await axios.post("/api/calendar/events", eventPayload);
      }

      fetchCalendarData();
      closeModal();
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

  const handleDeleteEvent = async () => {
    if (!editingEventId) return;

    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      await axios.delete(`/api/calendar/events/${editingEventId}`);
      fetchCalendarData();
      closeModal();
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const startOfMonth = currentMonth.startOf("month");
  const startDayOfWeek = startOfMonth.day();
  const startDate = startOfMonth.subtract(startDayOfWeek, "day");
  const calendarDays = Array.from({ length: 42 }, (_, i) => startDate.add(i, "day"));
  const todayStr = dayjs().format("YYYY-MM-DD");

  return (
    <div className="flex h-screen w-screen bg-[#121212] text-[#e0e0e0] font-sans box-border overflow-hidden">
      {/* Sidebar Left */}
      <aside className="w-[220px] min-w-[220px] border-r border-[#333333] flex flex-col justify-between p-5 bg-[#181818]">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-full border-2 border-white bg-[#333]"></div>
            <span className="text-[#ff5555] font-medium text-lg">user</span>
          </div>
          <nav className="flex flex-col gap-2.5">
            <a href="#" className="text-white no-underline text-base py-2 border-b border-[#2a2a2a] block">
              calendar
            </a>
            <a href="#" className="text-[#b0b0b0] hover:text-white no-underline text-base py-2 border-b border-[#2a2a2a] block transition-colors">
              overview
            </a>
          </nav>
        </div>
        <div>
          <button className="bg-transparent border-none text-[#ff5555] text-base cursor-pointer text-left p-0 outline-none">
            logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h1 className="m-0 text-3xl font-medium capitalize text-white">{currentMonth.format("MMMM YYYY")}</h1>
          <div className="flex gap-2.5">
            <button onClick={goToToday} className="bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white border border-[#444] px-4 py-2 rounded cursor-pointer text-base transition-colors">
              Today
            </button>
            <button onClick={prevMonth} className="bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white border border-[#444] px-4 py-2 rounded cursor-pointer text-base transition-colors">
              {"<"}
            </button>
            <button onClick={nextMonth} className="bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white border border-[#444] px-4 py-2 rounded cursor-pointer text-base transition-colors">
              {">"}
            </button>
          </div>
        </div>

        <div className="border border-[#333333] rounded-lg flex-1 flex flex-col bg-[#181818] overflow-hidden">
          {/* Weekday Header */}
          <div className="grid grid-cols-7 border-b border-[#333333] bg-[#1f1f1f]">
            {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
              <div key={day} className="py-2.5 text-center text-xs font-semibold text-[#888888] tracking-wider">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 grid-rows-5 flex-1">
            {calendarDays.map((dayObj, index) => {
              const dateStr = dayObj.format("YYYY-MM-DD");
              const isToday = dateStr === todayStr;
              const isCurrentMonth = dayObj.isSame(currentMonth, "month");

              const dayEvents = events.filter((e) => dayjs(e.date).format("YYYY-MM-DD") === dateStr);

              const isRightBorder = (index + 1) % 7 !== 0;
              const isBottomBorder = index < 35;

              return (
                <div
                  key={dateStr}
                  className={`p-1.5 flex flex-col relative bg-[#181818] cursor-pointer hover:bg-[#222222] transition-colors ${
                    isRightBorder ? "border-r border-[#2a2a2a]" : ""
                  } ${isBottomBorder ? "border-b border-[#2a2a2a]" : ""}`}
                  onClick={() => openNewEventModal(dateStr)}
                >
                  <div className="flex justify-center items-center mb-1 text-xs">
                    {dayObj.date() === 1 && (
                      <span className="text-[#aaa] mr-1 font-medium">{dayObj.format("MMM")} </span>
                    )}
                    <span
                      className={`w-6 h-6 inline-flex items-center justify-center rounded-full font-medium ${
                        isToday
                          ? "bg-[#1a73e8] text-white font-bold"
                          : isCurrentMonth
                          ? "text-[#cccccc]"
                          : "text-[#555555]"
                      }`}
                    >
                      {dayObj.date()}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1 overflow-y-auto flex-1">
                    {dayEvents.map((evt) => (
                      <div
                        key={evt.id}
                        className="text-xs px-2 py-0.5 rounded-full text-white truncate font-normal bg-[#1a73e8]"
                        onClick={(e) => openEditEventModal(e, evt)}
                      >
                        {evt.time && <span className="mr-1 font-bold">{evt.time}</span>}
                        {evt.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Sidebar Right */}
      <aside className="w-[260px] min-w-[260px] border-l border-[#333333] flex flex-col p-5 bg-[#181818]">
        <div>
          <h2 className="m-0 font-normal text-xl text-white">chat</h2>
          <h3 className="m-0 font-normal pl-2 text-[#888] text-base">AI</h3>
        </div>
        <div className="flex-1 flex items-end pb-5">
          <div className="w-full flex flex-col">
            <span className="text-3xl text-[#666]">...</span>
            <span className="text-3xl text-[#666] text-right">...</span>
          </div>
        </div>
        <div>
          <input
            type="text"
            className="w-full bg-[#252525] border border-[#444444] rounded-full h-[38px] text-white px-4 outline-none focus:border-[#1a73e8]"
            placeholder=""
          />
        </div>
      </aside>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div
          className="fixed inset-0 w-screen h-screen bg-black/60 flex justify-center items-center z-[1000]"
          onClick={closeModal}
        >
          <div
            className="bg-[#242424] border border-[#444] rounded-lg w-[400px] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="m-0 text-2xl font-medium text-white">{editingEventId ? "Edit Event" : "Add Event"}</h2>
              <button
                className="bg-transparent border-0 text-[#aaa] text-2xl cursor-pointer hover:text-white p-0 outline-none"
                onClick={closeModal}
              >
                ×
              </button>
            </div>

            <p className="text-[#aaa] mb-5 text-sm">
              Date: {dayjs(selectedDate).format("dddd, MMMM D, YYYY")}
            </p>

            <input
              type="text"
              className="w-full bg-[#2a2a2a] border border-[#444] rounded text-white text-base p-2.5 mb-3 outline-none focus:border-[#1a73e8] placeholder-[#777]"
              placeholder="Event Title"
              value={newEventTitle}
              onChange={(e) => setNewEventTitle(e.target.value)}
              autoFocus
            />

            <input
              type="time"
              className="w-full bg-[#2a2a2a] border border-[#444] rounded text-white text-base p-2.5 mb-3 outline-none focus:border-[#1a73e8] cursor-pointer [color-scheme:dark]"
              value={newEventTime}
              onChange={(e) => setNewEventTime(e.target.value)}
            />

            <textarea
              className="w-full bg-[#2a2a2a] border border-[#444] rounded text-white text-base p-2.5 mb-6 outline-none focus:border-[#1a73e8] min-h-[80px] resize-y font-sans"
              placeholder="Add description..."
              value={newEventDesc}
              onChange={(e) => setNewEventDesc(e.target.value)}
            ></textarea>

            <div className="flex justify-between items-center">
              {editingEventId ? (
                <button
                  className="bg-transparent text-[#ff5555] border border-[#ff5555] px-4 py-2 rounded cursor-pointer font-medium hover:bg-[#ff5555] hover:text-white transition-all"
                  onClick={handleDeleteEvent}
                >
                  Delete
                </button>
              ) : (
                <div></div>
              )}

              <div className="flex gap-3">
                <button
                  className="bg-transparent text-[#aaa] border-0 px-4 py-2 rounded cursor-pointer font-medium hover:bg-[#333] hover:text-white"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  className="bg-[#1a73e8] text-white border-0 px-6 py-2 rounded cursor-pointer font-medium hover:bg-[#1557b0] transition-colors"
                  onClick={handleSaveEvent}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}