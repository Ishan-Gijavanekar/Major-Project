import { create } from "zustand";
import { io } from "socket.io-client";
import { useAuthStore } from "./authStore";

export const useSocketStore = create((set, get) => ({
    socket: null,
    isConnected: false,

    connectSocket: () => {
        const { authUser } = useAuthStore.getState();
        if (!authUser) return;

        const socket = io("http://localhost:5000", {
            transports: ["websocket"],
        });

        socket.on("connect", () => {
            console.log(`Connected to socket with id: ${socket.id}`);
            set({ socket, isConnected: true });
        });

        socket.on("disconnect", () => {
            console.log(`Disconnected from socket with id: ${socket.id}`);
            set({ socket, isConnected: false });
        });

        socket.on("newMessage", (message) => {
            console.log(`New message: ${message}`);
        });

        socket.on("userTyping", (data) => {
            console.log(`User ${data} is typing...`);
        });
    },

    disconnectSocket: () => {
        const {socket} = get();

        if (socket) {
            socket.disconnect();
            console.log("Disconnected from socket");
            set({ socket: null, isConnected: false });
        }
    },

    joinRoom: (roomId) => {
        const {socket} = get();
        if (socket && roomId) {
            socket.emit("joinRoom", roomId);
        }
    },

    leaveRoom: (roomId) => {
        const {socket} = get();
        if (socket && roomId) {
            socket.emit("leaveRoom", roomId);
        }
    },

    sendMessage: (roomId, message) => {
        const {socket} = get();
        const { authUser } = useAuthStore.getState();
        if (socket && message) {
            socket.emit("sendMessage", {
                room: roomId,
                sender: authUser._id,
                message,
            });
        }
    },


    markMessageasRead: (roomId, messageIds) => {
        const {socket} = get();
        const { authUser } = useAuthStore.getState();
        if (socket && messageIds) {
            socket.emit("markMessageasRead", {
                room: roomId,
                sender: authUser._id,
                messageIds,
            });
        }
    },
}))