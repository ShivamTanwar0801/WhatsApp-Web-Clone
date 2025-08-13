import { useState } from "react";

export default function MessageInput({ onSend }) {
  const [text, setText] = useState("");

  const handleSendClick = () => {
    if (text.trim()) {
      onSend(text);
      setText("");
    }
  };

  return (
    <div className="p-3 border-t border-gray-700 flex gap-2">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 p-2 rounded-lg bg-gray-800 text-white focus:outline-none"
        onKeyDown={(e) => e.key === "Enter" && handleSendClick()}
      />
      <button
        onClick={handleSendClick}
        className="bg-green-500 px-4 py-2 rounded-lg hover:bg-green-600"
      >
        Send
      </button>
    </div>
  );
}
