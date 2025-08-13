// src/components/Sidebar.jsx
import ChatList from "./ChatList";
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-[30%] border-r border-gray-700 bg-gray-800 flex flex-col h-full">
      {/* Top bar */}
      <div className="p-3 border-b border-gray-700 bg-gray-900">
        <Link to="/" className="font-bold text-lg hover:text-green-400 transition-colors">
          Chats
        </Link>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        <ChatList />
      </div>
    </div>
  );
}
