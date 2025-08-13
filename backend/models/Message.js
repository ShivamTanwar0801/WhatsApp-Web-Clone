import mongoose from 'mongoose';

const StatusEnum = ['sent', 'delivered', 'read', 'failed'];

const StatusHistorySchema = new mongoose.Schema({
  status: { type: String, enum: StatusEnum, required: true },
  timestamp: { type: Date, default: Date.now },
}, { _id: false });

const MessageSchema = new mongoose.Schema({
  // WhatsApp identifiers
  id: { type: String, index: true },          // WA message id (if present)
  meta_msg_id: { type: String, index: true }, // Alternate id used by status payloads
  wa_id: { type: String, index: true, required: true }, // user/phone number
  name: { type: String }, // contact name (if available)

  // Direction and participants
  from: { type: String }, // sender wa_id
  to: { type: String },   // receiver wa_id

  // Content
  type: { type: String, default: 'text' },
  text: { type: String },
  payload: { type: Object }, // store full raw message if needed

  // Timestamps
  timestamp: { type: Date, default: Date.now },

  // Status
  status: { type: String, enum: StatusEnum, default: 'sent' },
  statusHistory: { type: [StatusHistorySchema], default: [] },
}, { timestamps: true });

// Compound index to speed up lookups
MessageSchema.index({ wa_id: 1, timestamp: -1 });

export default mongoose.model('Message', MessageSchema);
