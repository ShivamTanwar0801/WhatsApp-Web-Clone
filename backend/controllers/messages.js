import Message from "../models/Message.js";
import { StatusCodes } from "http-status-codes";

/** Build a chat list: one entry per wa_id with last message preview */
export async function listChats(req, res) {
  const pipeline = [
    { $sort: { timestamp: -1 } },
    {
      $group: {
        _id: "$wa_id",
        lastMessageAt: { $first: "$timestamp" },
        lastText: { $first: "$text" },
        lastStatus: { $first: "$status" },
        name: { $first: "$name" },
      },
    },
    {
      $project: {
        wa_id: "$_id",
        _id: 0,
        lastMessageAt: 1,
        lastText: 1,
        lastStatus: 1,
        name: 1,
      },
    },
    { $sort: { lastMessageAt: -1 } },
  ];
  const chats = await Message.aggregate(pipeline);
  return res.status(StatusCodes.OK).json(chats);
}

/** Fetch a conversation by wa_id */
export async function getConversation(req, res) {
  const { wa_id } = req.params;
  const messages = await Message.find({ wa_id }).sort({ timestamp: 1 }).lean();
  return res.status(StatusCodes.OK).json(messages);
}

/** Create (send) a message (demo only) */
export async function sendMessage(req, res) {
  const io = req.app.get("io");
  const { wa_id, text, from, to, name } = req.body;

  if (!wa_id || !text) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "wa_id and text are required" });
  }

  let finalName = name;
  if (!finalName) {
    const lastMsg = await Message.findOne({ wa_id }).sort({ timestamp: -1 });
    if (lastMsg?.name) {
      finalName = lastMsg.name;
    }
  }

  const doc = await Message.create({
    wa_id,
    text,
    from,
    to,
    name: finalName,
    type: "text",
    status: "sent",
    statusHistory: [{ status: "sent", timestamp: new Date() }],
    timestamp: new Date(),
  });

  io.to(wa_id).emit("message:new", doc);
  return res.status(StatusCodes.CREATED).json(doc);
}

/** Update status of a message by id or meta_msg_id */
export async function updateStatus(req, res) {
  try {
    const io = req.app.get("io");
    const { id, meta_msg_id, status } = req.body;

    if (!status) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "status is required" });
    }

    const query = id ? { id } : meta_msg_id ? { meta_msg_id } : null;
    if (!query) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "id or meta_msg_id is required" });
    }

    const doc = await Message.findOneAndUpdate(
      query,
      {
        $set: { status },
        $push: { statusHistory: { status, timestamp: new Date() } },
      },
      { new: true }
    );

    if (doc?.wa_id) {
      io.to(doc.wa_id).emit("message:update", doc);
    }

    return res.status(StatusCodes.OK).json({ ok: true, updated: !!doc });
  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Server error" });
  }
}
