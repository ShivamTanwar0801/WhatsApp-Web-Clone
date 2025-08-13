import { useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";

export default function MessagesPage() {
  const [messagesCache, setMessagesCache] = useState({}); // store messages per chat

  return (
    <div className="flex h-screen">
      {/* Left panel: Sidebar */}
      <Sidebar />

      {/* Right panel: Chat window or placeholder */}
      <div className="flex-1">
        <ChatWindow
          messagesCache={messagesCache}
          setMessagesCache={setMessagesCache}
        />
      </div>
    </div>
  );
}
