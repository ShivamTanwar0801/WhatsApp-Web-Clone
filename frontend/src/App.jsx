import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";

export default function App() {
  return (
    <div className="h-screen flex bg-gray-900 text-white">
      {/* Left panel (Sidebar with ChatList) */}
      <Sidebar />

      {/* Right panel (ChatWindow or placeholder) */}
      <Routes>
        <Route
          path="/"
          element={
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <img
                src="https://cdn-icons-png.flaticon.com/512/134/134914.png"
                alt="Chat placeholder"
                className="w-24 h-24 opacity-70 mb-4"
              />
              <h2 className="text-lg font-semibold">Welcome to Chat App</h2>
              <p className="text-sm text-gray-500">Select a chat to start messaging</p>
            </div>
          }
        />
        <Route path="/message/:id" element={<ChatWindow />} />
      </Routes>
    </div>
  );
}
