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
      const res = await axios.get<CalendarEvent[]>(
        "/api/calendar/events"
      );
      setEvents(res.data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchCalendarData();
  }, []);

  const prevMonth = () => {
    setCurrentMonth(currentMonth.subtract(1, "month"));
  };

  const nextMonth = () => {
    setCurrentMonth(currentMonth.add(1, "month"));
  };

  const goToToday = () => {
    setCurrentMonth(dayjs());
  };


  const openNewEventModal = (date: string) => {
    setSelectedDate(date);
    setNewEventTitle("");
    setNewEventTime("");
    setNewEventDesc("");
    setEditingEventId(null);
    setIsModalOpen(true);
  };


  const openEditEventModal = (
    e: React.MouseEvent,
    event: CalendarEvent
  ) => {
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

    const payload = {
      title: newEventTitle,
      description: newEventDesc,
      date: selectedDate,
      time: newEventTime,
      color: "#1a73e8",
    };

    try {
      if (editingEventId) {
        await axios.put(
          `/api/calendar/events/${editingEventId}`,
          payload
        );
      } else {
        await axios.post(
          "/api/calendar/events",
          payload
        );
      }

      await fetchCalendarData();
      closeModal();

    } catch (error) {
      console.error(error);
    }
  };


  const handleDeleteEvent = async () => {
    if (!editingEventId) return;

    if (!window.confirm("Delete event?")) return;

    try {
      await axios.delete(
        `/api/calendar/events/${editingEventId}`
      );

      await fetchCalendarData();
      closeModal();

    } catch(error) {
      console.error(error);
    }
  };


  const startOfMonth = currentMonth.startOf("month");
  const startDay = startOfMonth.day();

  const startDate = startOfMonth.subtract(
    startDay,
    "day"
  );


  const calendarDays = Array.from(
    { length: 42 },
    (_, i) => startDate.add(i,"day")
  );


  const today = dayjs().format("YYYY-MM-DD");


return (
  <div className="
    flex
    h-screen
    w-screen
    bg-[#121212]
    text-[#e0e0e0]
    font-sans
    overflow-hidden
  ">

    {/* Main Content เท่านั้น */}
    <main className="
      flex-1
      p-6
      flex
      flex-col
      overflow-hidden
    ">

      {/* Header */}
      <div className="
        flex
        items-center
        justify-between
        mb-4
      ">

        <h1 className="
          m-0
          text-3xl
          font-medium
          capitalize
          text-white
        ">
          {currentMonth.format("MMMM YYYY")}
        </h1>


        <div className="flex gap-2.5">

          <button
            onClick={goToToday}
            className="
              bg-[#2a2a2a]
              hover:bg-[#3a3a3a]
              text-white
              border
              border-[#444]
              px-4
              py-2
              rounded
            "
          >
            Today
          </button>


          <button
            onClick={prevMonth}
            className="
              bg-[#2a2a2a]
              text-white
              border
              border-[#444]
              px-4
              py-2
              rounded
            "
          >
            {"<"}
          </button>


          <button
            onClick={nextMonth}
            className="
              bg-[#2a2a2a]
              text-white
              border
              border-[#444]
              px-4
              py-2
              rounded
            "
          >
            {">"}
          </button>

        </div>

      </div>



      {/* Calendar Box */}
      <div className="
        border
        border-[#333333]
        rounded-lg
        flex-1
        flex
        flex-col
        bg-[#181818]
        overflow-hidden
      ">


        {/* Week Header */}
        <div className="
          grid
          grid-cols-7
          border-b
          border-[#333333]
          bg-[#1f1f1f]
        ">

          {
            [
              "SUN",
              "MON",
              "TUE",
              "WED",
              "THU",
              "FRI",
              "SAT"
            ].map(day => (

              <div
                key={day}
                className="
                  py-2.5
                  text-center
                  text-xs
                  font-semibold
                  text-[#888888]
                  tracking-wider
                "
              >
                {day}
              </div>

            ))
          }

        </div>



        {/* Calendar Grid */}
        <div className="
          grid
          grid-cols-7
          grid-rows-6
          flex-1
        ">

          {calendarDays.map((dayObj,index)=>{

            const dateStr =
              dayObj.format("YYYY-MM-DD");

            const isToday =
              dateStr === today;

            const isCurrentMonth =
              dayObj.isSame(
                currentMonth,
                "month"
              );


            const dayEvents =
              events.filter(
                e =>
                dayjs(e.date)
                .format("YYYY-MM-DD")
                === dateStr
              );


            return (
              <div
                key={dateStr}
                onClick={() =>
                  openNewEventModal(dateStr)
                }
                className={`
                  p-1.5
                  flex
                  flex-col
                  relative
                  bg-[#181818]
                  cursor-pointer
                  hover:bg-[#222222]
                  ${
                    (index+1)%7!==0
                    ?
                    "border-r border-[#2a2a2a]"
                    :
                    ""
                  }
                  ${
                    index<35
                    ?
                    "border-b border-[#2a2a2a]"
                    :
                    ""
                  }
                `}
              >

                <div className="
                  flex
                  justify-center
                  items-center
                  mb-1
                  text-xs
                ">

                  <span
                    className={`
                      w-6
                      h-6
                      inline-flex
                      items-center
                      justify-center
                      rounded-full
                      font-medium
                      ${
                        isToday
                        ?
                        "bg-[#1a73e8] text-white font-bold"
                        :
                        isCurrentMonth
                        ?
                        "text-[#cccccc]"
                        :
                        "text-[#555555]"
                      }
                    `}
                  >
                    {dayObj.date()}
                  </span>

                </div>


                <div className="
                  flex
                  flex-col
                  gap-1
                  overflow-y-auto
                  flex-1
                ">

                  {dayEvents.map(evt => (

                    <div
                      key={evt.id}
                      onClick={(e)=>
                        openEditEventModal(e,evt)
                      }
                      className="
                        text-xs
                        px-2
                        py-0.5
                        rounded-full
                        text-white
                        truncate
                        bg-[#1a73e8]
                      "
                    >
                      {evt.time && (
                        <span className="mr-1 font-bold">
                          {evt.time}
                        </span>
                      )}

                      {evt.title}

                    </div>

                  ))}

                </div>

              </div>
            )

          })}

        </div>

      </div>

    </main>


    {/* Modal เอาของเดิมไว้ตรงนี้ */}
    {isModalOpen && (
      // modal code เดิม
      null
    )}

  </div>
);

}