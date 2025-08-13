import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import { socket } from "../socket"; // import Socket.IO client

export default function ChatWindow() {
  const { id } = useParams(); // chat ID (wa_id)
  const [messages, setMessages] = useState([]);
  const [chatInfo, setChatInfo] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!id) return;

    fetch(`${import.meta.env.VITE_API_BASE}/messages/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setMessages(data);
        if (data.length > 0) {
          setChatInfo({ name: data[0].name, wa_id: data[0].wa_id });
        }
      })
      .catch((err) => console.error(err));

    // Join chat room via Socket.IO
    socket.emit("joinChat", id);

    // Listen for new messages
    const handleNewMessage = (msg) => {
      if (msg.wa_id === id) setMessages((prev) => [...prev, msg]);
    };

    // Listen for status updates
    const handleStatusUpdate = (msg) => {
      if (msg.wa_id === id) {
        setMessages((prev) =>
          prev.map((m) => (m._id === msg._id ? msg : m))
        );
      }
    };

    socket.on("message:new", handleNewMessage);
    socket.on("message:update", handleStatusUpdate);

    return () => {
      socket.off("message:new", handleNewMessage);
      socket.off("message:update", handleStatusUpdate);
    };
  }, [id]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (text) => {
    if (!text.trim()) return;

    const tempMsg = {
      id: Date.now(),
      text,
      timestamp: new Date().toISOString(),
      status: "sent",
      from: "me",
      wa_id: id,
    };

    setMessages((prev) => [...prev, tempMsg]);
    socket.emit("sendMessage", tempMsg); // send via socket

    try {
      await fetch(`${import.meta.env.VITE_API_BASE}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wa_id: id, text }),
      });
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  if (!id) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500 italic">
        Select a chat to start messaging
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full bg-gray-900 text-white">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-gray-800 border-b border-gray-700 shadow-md">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-lg font-bold">
          {chatInfo?.name?.[0]?.toUpperCase() || "?"}
        </div>
        <div className="flex flex-col">
          <span className="font-semibold">{chatInfo?.name || "Unknown"}</span>
          <span className="text-xs text-gray-400">{chatInfo?.wa_id}</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-gray-700">
        {messages.map((msg) => {
          const isOwn = msg.from !== id;
          return (
            <MessageBubble
              key={msg.id || msg.timestamp || msg._id}
              text={msg.text}
              timestamp={msg.timestamp}
              status={msg.status}
              isOwn={isOwn}
            />
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-700 bg-gray-800 p-2">
        <MessageInput onSend={handleSend} />
      </div>
    </div>
  );
}
