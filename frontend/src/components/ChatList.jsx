import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ChatList() {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(import.meta.env.VITE_API_BASE + "/chats")
      .then((res) => res.json())
      .then((data) => setChats(data))
      .catch((err) => console.error(err));
  }, []);

  const handleChatClick = (id) => {
    setActiveChat(id); // trigger animation
    setTimeout(() => {
      navigate(`/message/${id}`);
    }, 150); // wait for animation
  };

  return (
    <div className="flex-1 bg-gray-800 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600">
      {chats.map((chat) => (
        <div
          key={chat.wa_id}
          onClick={() => handleChatClick(chat.wa_id)}
          className={`flex w-full items-center gap-4 p-4 cursor-pointer hover:bg-gray-700 active:bg-gray-700 transition-all duration-150 border-b border-gray-700 ${
            activeChat === chat.wa_id
              ? "opacity-80 bg-gray-950"
              : ""
          }`}
        >
          {/* Profile Picture / Placeholder */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-lg font-bold text-white shadow-md">
            {chat.name?.[0]?.toUpperCase() || "?"}
          </div>

          {/* Chat Info */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold text-white truncate">
                {chat.name || chat.wa_id}
              </span>
              {chat.lastTimestamp && (
                <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                  {new Date(chat.lastTimestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              )}
            </div>
            <div className="text-sm text-gray-400 truncate">
              {chat.lastText || "No messages yet"}
            </div>
          </div>
        </div>
      ))}

      {chats.length === 0 && (
        <div className="flex items-center justify-center h-full text-gray-500 p-4 text-center">
          No chats available
        </div>
      )}
    </div>
  );
}
