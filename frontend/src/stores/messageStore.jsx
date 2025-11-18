import { create } from "zustand";
import { axiosInstance } from "../api/axios.js";

export const useMessageStore = create((set, get) => ({
    message: [],
    isLoading: false,
    error: null,

    sendMessage: async (data) => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.post("/messages/sendMessage", data);
            return res.data;
        } catch (error) {
            console.log(`Error in sendMessage: ${error}`);
            set({ error });
        } finally {
            set({ isLoading: false });
        }
    },

    getMessages: async (id) => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.get(`/messages/getMessages/${id}`);
            set({ message: res.data.messages });
            return res.data;
        } catch (error) {
            console.log(`Error in getMessages: ${error}`);
            set({ error });
        } finally {
            set({ isLoading: false });
        }
    },

    markMessageAsRead: async (id) => {
        try {
            set({ isLoading: true });
            await axiosInstance.put(`/messages/markMessageAsRead/${id}`);
            return true;
        } catch (error) {
            console.log(`Error in markMessageAsRead: ${error}`);
            set({ error });
        } finally {
            set({ isLoading: false });
        }
    },

    deleteMessage: async (id) => {
        try {
            set({ isLoading: true });
            await axiosInstance.delete(`/messages/deleteMessage/${id}`);
            return true;
        } catch (error) {
            console.log(`Error in deleteMessage: ${error}`);
            set({ error });
        } finally {
            set({ isLoading: false });
        }
    },

    addSocketMessage: (newMsg) => {
    // Only add if for current room
        set(state => ({
             message: [...state.message, newMsg],
            }));
        },

        clearMessages: () => {
        set({ message: [] });
    },
}))