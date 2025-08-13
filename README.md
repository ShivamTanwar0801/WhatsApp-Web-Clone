# WhatsApp Web Clone (React + Node.js + Express.js + MongoDB + Socket.IO)

## Overview

A real-time chat application inspired by WhatsApp Web.

Features include:

- Real-time messaging using **Socket.IO**.
- MongoDB backend to store chats and messages.
- Chat list with last message preview.
- Status updates for messages (sent, delivered, read).
- Responsive frontend using **React** and **Tailwind CSS**.
- Supports deployment on **Vercel** (frontend) and **any Node.js server** (backend).

---

## Tech Stack

- **Frontend:** React, React Router, Tailwind CSS, Socket.IO Client
- **Backend:** Node.js, Express.js, Socket.IO Server, MongoDB, Mongoose
- **Deployment:** Vercel (frontend), any Node.js hosting for backend
- **Environment Management:** dotenv

---

## Features

1. **Real-time Messaging**

   - Messages update instantly for all users in the chat.
   - Status updates reflect live (sent, delivered, read).

2. **Chat List**

   - Displays all chats.
   - Shows last message, timestamp, and status.

3. **Message Status**

   - Messages can have multiple statuses (sent, delivered, read).
   - Status updates are emitted via Socket.IO.

4. **Responsive UI**

   - Sidebar for chat list.
   - Main panel for chat window.
   - Auto-scroll to newest messages.

5. **Deploy-Ready**

   - Can switch between localhost and production using `window.location.origin` or environment variables.

---

## Installation

### Backend

1. Clone the repo:

```bash
git clone <repo-url>
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file:

```
PORT=4000
MONGODB_URI=<your-mongodb-uri>
CLIENT_ORIGIN=http://localhost:5173
```

4. Start the backend:

```bash
npm run dev
```

---

### Frontend

1. Navigate to frontend:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` for Vite:

```
VITE_API_BASE=http://localhost:4000/api
VITE_SOCKET_URL=http://localhost:4000
```

4. Run the frontend:

```bash
npm run dev
```

---

## Socket.IO Integration

- The backend attaches Socket.IO to the HTTP server.
- Each chat has its own room identified by `wa_id`.
- Events:

  - `joinChat`: join a chat room.
  - `sendMessage`: broadcast a new message.
  - `message:new`: receive new messages.
  - `message:update`: receive status updates.

- Frontend connects automatically and updates the UI in real-time.

---

## Project Structure

```
/frontend
  /src
    /components
      ChatWindow.jsx
      ChatList.jsx
      MessageBubble.jsx
      MessageInput.jsx
      Sidebar.jsx
    /pages
      MessagesPage.jsx
    socket.js
    App.jsx
/backend
  /controllers
    messages.js
  /models
    Message.js
  /routes
    messages.js
  server.js
```

---

## Deployment

- Frontend: Deploy via **Vercel**.
- Backend: Deploy on **Node.js hosting** (Heroku, Render, Railway, etc.).
- Make sure to set `VITE_API_BASE` and `VITE_SOCKET_URL` for production.
- Socket.IO works over the same host as frontend or via CORS configuration.

---

## Notes

- Auto-scroll on new messages implemented.
- Message status updates are fully real-time.
- Works with multiple clients simultaneously.

---

## License

MIT License
