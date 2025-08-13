// src/components/MessageBubble.jsx
export default function MessageBubble({ text, timestamp, status, isOwn }) {
  const renderTicks = () => {
    if (!isOwn || !status) return null;

    if (status === "sent") {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className="w-4 h-4 text-gray-400"
        >
          <path d="M1 14l5 5L20 5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    }

    if (status === "delivered") {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className="w-4 h-4 text-gray-400"
        >
          <path d="M1 14l5 5L20 5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 14l5 5L23 5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    }

    if (status === "read") {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className="w-4 h-4 text-blue-400"
        >
          <path d="M1 14l5 5L20 5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 14l5 5L23 5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    }

    return null;
  };

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-xs md:max-w-md p-2 rounded-lg text-sm shadow-md ${
          isOwn
            ? "bg-green-800 text-white rounded-br-none"
            : "bg-gray-700 text-white rounded-bl-none"
        }`}
      >
        <div>{text}</div>
        <div className="text-xs text-gray-200 mt-1 flex items-center gap-1 justify-end">
          {new Date(timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
          {renderTicks()}
        </div>
      </div>
    </div>
  );
}
