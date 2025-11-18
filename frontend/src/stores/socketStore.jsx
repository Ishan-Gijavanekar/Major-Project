import { create } from "zustand";
import { io } from "socket.io-client";
import { useAuthStore } from "./authStore";
import { useMessageStore } from "./messageStore";

export const useSocketStore = create((set, get) => ({
  socket: null,
  isConnected: false,

  connectSocket: () => {
    const { authUser } = useAuthStore.getState();
    if (!authUser) return;

    // Always create a new socket to avoid duplicates (can enhance with check)
    const socket = io("http://localhost:5000", {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log(`Connected to socket: ${socket.id}`);
      set({ socket, isConnected: true });
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
      set({ socket: null, isConnected: false });
    });

    socket.on("newMessage", (msg) => {
      // Insert message into message store in real time
      useMessageStore.getState().addSocketMessage(msg);
    });

    socket.on("userTyping", (data) => {
      console.log(`User ${data.userId} is typing...`);
    });

    set({ socket }); // Save the socket instance
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, isConnected: false });
    }
  },

  joinRoom: (roomId) => {
    const { socket } = get();
    if (socket && roomId) {
      socket.emit("joinRoom", roomId);
    }
  },

  leaveRoom: (roomId) => {
    const { socket } = get();
    if (socket && roomId) {
      socket.emit("leaveRoom", roomId);
    }
  },

  sendSocketMessage: (roomId, message) => {
    const { socket } = get();
    const { authUser } = useAuthStore.getState();
    if (socket && message) {
      // Use the same property names for consistency
      socket.emit("sendMessage", {
        room: roomId,
        message,
        sender: authUser, // complete user object if needed
        createdAt: new Date().toISOString(),
      });
    }
  },

  markMessageAsRead: (roomId, messageIds) => {
    const { socket } = get();
    const { authUser } = useAuthStore.getState();
    if (socket && messageIds) {
      socket.emit("markRead", {
        roomId,
        userId: authUser._id,
        messageIds,
      });
    }
  },
}));
