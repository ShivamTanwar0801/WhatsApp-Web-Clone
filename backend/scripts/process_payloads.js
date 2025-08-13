/**
 * Script: scripts/process_payloads.js
 * Usage: npm run process:payloads
 *
 * Reads all JSON files from ./payloads and:
 *  - Inserts new messages into 'processed_messages'
 *  - Applies status updates (sent/delivered/read) using id or meta_msg_id
 *
 * Place the sample payloads JSON files into backend/payloads before running.
 */
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import Message from '../models/Message.js';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ Missing MONGODB_URI');
  process.exit(1);
}

const PAYLOADS_DIR = path.resolve('./payloads');

/**
 * Normalize a WhatsApp message object into our DB format.
 */
function normalizeMessage(m, contact) {
  return {
    id: m.id || m.message_id || undefined,
    meta_msg_id: m.meta_msg_id || m.id || undefined,
    wa_id: contact?.wa_id || m.wa_id || m.from || m.to || 'unknown',
    name: contact?.profile?.name || m.name || m.profile_name || undefined,
    from: m.from,
    to: m.to,
    type: m.type || 'text',
    text: m.text?.body || m.text || '',
    payload: m,
    timestamp: m.timestamp ? new Date(Number(m.timestamp) * 1000) : new Date(),
    status: 'sent',
    statusHistory: [{ status: 'sent', timestamp: new Date() }]
  };
}

/**
 * Extract the actual WhatsApp payload from different formats.
 */
function extractPayloadData(payload) {
  // If it's in the webhook wrapper format
  if (payload.metaData?.entry?.[0]?.changes?.[0]?.value) {
    return payload.metaData.entry[0].changes[0].value;
  }
  // If already in "value" format or flat
  return payload;
}

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB');

  if (!fs.existsSync(PAYLOADS_DIR)) {
    console.error(`❌ Payloads directory not found: ${PAYLOADS_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(PAYLOADS_DIR).filter(f => f.endsWith('.json'));
  console.log(`📂 Found ${files.length} JSON files`);

  for (const file of files) {
    const fullPath = path.join(PAYLOADS_DIR, file);
    const raw = fs.readFileSync(fullPath, 'utf-8');
    let rawPayload;
    try {
      rawPayload = JSON.parse(raw);
    } catch (e) {
      console.warn(`⚠️ Skipping invalid JSON: ${file}`);
      continue;
    }

    const payload = extractPayloadData(rawPayload);

    // Handle status updates
    if (payload.statuses || (Array.isArray(payload) && payload.every(p => p.status || p.status_type))) {
      const statuses = payload.statuses || payload;
      for (const st of statuses) {
        const id = st.id;
        const meta = st.meta_msg_id;
        const status = st.status || st.status_type;
        if (!status) continue;

        const query = id ? { id } : { meta_msg_id: meta };
        const updated = await Message.findOneAndUpdate(
          query,
          { $set: { status }, $push: { statusHistory: { status, timestamp: new Date() } } },
          { new: true }
        );
        if (updated) {
          console.log(`🔄 Updated status for ${updated.id || updated.meta_msg_id} -> ${status}`);
        } else {
          console.log(`⚠️ No message found for status payload: ${id || meta}`);
        }
      }
    }

    // Handle message inserts
    if (payload.messages) {
      const contacts = payload.contacts || [];
      for (let i = 0; i < payload.messages.length; i++) {
        const m = payload.messages[i];
        const contact = contacts[i] || contacts[0] || null;
        const doc = normalizeMessage(m, contact);

        const query = doc.id ? { id: doc.id } : { meta_msg_id: doc.meta_msg_id };
        const saved = await Message.findOneAndUpdate(query, { $setOnInsert: doc }, { upsert: true, new: true });
        console.log(`💾 Inserted/Found message for ${saved.id || saved.meta_msg_id}`);
      }
    }
  }

  await mongoose.disconnect();
  console.log('✅ Done processing payloads.');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
