import { create } from "zustand";
import { axiosInstance } from "../api/axios.js";

 const useMessageStore = create((set, get) => ({
  message: [],        // all messages currently loaded (for active room)
  isLoading: false,
  error: null,

  // HTTP send – also update local state so sender sees message immediately
  
  sendMessage: async (data) => {
  try {
    set({ isLoading: true });
    const res = await axiosInstance.post("/messages/sendMessage", data);

    console.log("sendMessage response:", res.data); // TEMP: check actual shape

    const newMsg =
      res.data.chatMessage.content
    set((state) => ({
      message: [...state.message, newMsg],
      error: null,
      
    })
  );
  console.log(get().message);

    return newMsg;
  } catch (error) {
    console.log(`Error in sendMessage: ${error}`);
    set({ error });
  } finally {
    set({ isLoading: false });
  }
},


  // Load messages for a specific room
  getMessages: async (id) => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.get(`/messages/getMessages/${id}`);

      // these should already be only messages of that room
      set({ message: res.data.messages || [], error: null });

      return res.data.messages;
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

  // called from socket when a NEW message is received
  addSocketMessage: (newMsg) => {
    // 🔴 if you're keeping only current room in `message`,
    // optionally filter by room here using current active room id.

    set((state) => ({
      message: [...state.message, newMsg],
    }));
  },

  clearMessages: () => {
    set({ message: [] });
  },
}));

export  {useMessageStore};