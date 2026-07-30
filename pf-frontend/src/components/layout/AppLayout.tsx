import { useState, type ReactNode } from "react";
import { Sidebar, type MainView } from "./Sidebar";
import { ChatDrawer, type ChatMessage } from "../chat/ChatDrawer";
import "./layout.css";
import { useNavigate } from "react-router-dom";

// Replace with a real call to POST /api/chat (see ai.service.ts on the backend).
// Kept here as a stub so this component is runnable on its own.
async function fakeSendMessage(text: string): Promise<string> {
  await new Promise((r) => setTimeout(r, 500));
  return `(stub reply) You said: "${text}"`;
}

type AppLayoutProps = {
  userName: string;
  onLogout: () => void;
  /** Optional: render your own content in the main area instead of the built-in placeholders. */
  children?: ReactNode;
};

export function AppLayout({ userName, onLogout, children }: AppLayoutProps) {
  const [activeView, setActiveView] = useState<MainView>("calendar");
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sending, setSending] = useState(false);
  const navigate = useNavigate();
   const handleNavigate = (view: MainView) => {
    setActiveView(view);

    if (view === "calendar") {
      navigate("/calendar");
    }

    if (view === "overview") {
      navigate("/dashboard");
    }
  };

  const handleSend = async (text: string) => {
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setSending(true);
    try {
      const reply = await fakeSendMessage(text);
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "assistant", content: reply },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="app-shell">
      <Sidebar
        userName={userName}
        activeView={activeView}
        onNavigate={handleNavigate}
        chatOpen={chatOpen}
        onToggleChat={() => setChatOpen((v) => !v)}
        onLogout={onLogout}
      />

      <main className="app-shell__main">
        {children ??
          (activeView === "calendar" ? <CalendarPlaceholder /> : <OverviewPlaceholder />)}
      </main>

      <ChatDrawer
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        messages={messages}
        onSend={handleSend}
        sending={sending}
      />
    </div>
  );
}

function CalendarPlaceholder() {
  return (
    <section>
      <h1>Calendar</h1>
      <p style={{ color: "var(--shell-text-dim)" }}>
        Swap this for the real calendar grid component.
      </p>
    </section>
  );
}

function OverviewPlaceholder() {
  return (
    <section>
      <h1>Overview</h1>
      <p style={{ color: "var(--shell-text-dim)" }}>
        Swap this for the priority-sorted task overview.
      </p>
    </section>
  );
}