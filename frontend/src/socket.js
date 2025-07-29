// src/socket.js
import { io } from "socket.io-client";

const socket = io("https://ecommerce-project-production-28e7.up.railway.app", {
  withCredentials: true,
});

export default socket;
