import { useState, type ReactNode } from "react";
import { Sidebar, type MainView } from "./Sidebar";
import { ChatDrawer, type ChatMessage } from "../chat/ChatDrawer";
import OverviewBoard from "../../pages/OverviewBoard";
import CalendarBoard from "../../pages/CalendarBoard";
import { api } from "../../api/client";
import "./layout.css";

async function sendMessage(text: string): Promise<string> {
  const { data } = await api.post<{ reply: string }>("/api/chat", { message: text });
  return data.reply;
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

  const handleSend = async (text: string) => {
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setSending(true);
    try {
      const reply = await sendMessage(text);
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
        onNavigate={setActiveView}
        chatOpen={chatOpen}
        onToggleChat={() => setChatOpen((v) => !v)}
        onLogout={onLogout}
      />

      <main className="app-shell__main">
        {children ?? (activeView === "calendar" ? <CalendarBoard /> : <OverviewBoard />)}
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