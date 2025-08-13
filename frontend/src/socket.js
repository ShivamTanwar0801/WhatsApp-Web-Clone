// src/socket.js
import { io } from "socket.io-client";

export const socket = io("http://localhost:4000", {
  transports: ["websocket", "polling"], // ensures proper transport
  withCredentials: true,
});
