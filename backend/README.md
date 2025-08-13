# Backend (Node.js + Express + MongoDB + Socket.IO)

## Quick Start
```bash
cd backend
npm i
cp .env.example .env
# put your Atlas URI in .env
npm run dev
```

### Routes
- `GET /api/health` – health check
- `GET /api/chats` – list chats by `wa_id` with last message preview
- `GET /api/messages/:wa_id` – list all messages in a conversation
- `POST /api/messages` – create a (demo) outgoing text message
- `PATCH /api/messages/status` – update a message status by `id` or `meta_msg_id`

### WebSocket Events
- `message:new` – emitted when a new message is created
- `message:update` – emitted when a message status is updated

### Process Payloads
Place webhook JSON files into `backend/payloads`, then run:
```bash
npm run process:payloads
```
The script will insert messages and apply status updates.
