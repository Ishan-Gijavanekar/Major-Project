import { create } from 'zustand';
import { axiosInstance } from '../api/axios.js';


export const useChatRoomStore = create ((set, get) => ({
    chatRooms: [],
    isLoading: false,
    error: null,

    createRoom: async (id) => {
        try {
            set({ isLoading: true });
            await axiosInstance.post(`/chatRooms/createRoom/${id}`);
            set({ error: null });
        } catch (error) {
            console.log(`Error in createRoom: ${error}`);
            set({ error });
        } finally {
            set({ isLoading: false });
        }
    },

    getUserChatRoom: () => {
        try {
            set({ isLoading: true });
            axiosInstance.get('/chatRooms/getUserChatRoom').then((res) => {
                set({ chatRooms: res.data.chatRooms });
            });
            set({ error: null });
        } catch (error) {
            console.log(`Error in getUserChatRoom: ${error}`);
            set({ error });
        } finally {
            set({ isLoading: false });
        }
    },

    getChatRoomById: async (id) => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.get(`/chatRooms/getChatRoomById/${id}`);
            return res.data;
        } catch (error) {
            console.log(`Error in getChatRoomById: ${error}`);
            set({ error });
        } finally {
            set({ isLoading: false });
        }
    },

    updateChatRoom: async (id, data) => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.put(`/chatRooms/updateChatRoom/${id}`, data);
            return res.data;
        } catch (error) {
            console.log(`Error in updateChatRoom: ${error}`);
            set({ error });
        } finally {
            set({ isLoading: false });
        }
    },

    deleteChatRoom: async (id) => {
        try {
            set({ isLoading: true });
            await axiosInstance.delete(`/chatRooms/deleteChatRoom/${id}`);
            return true;
        } catch (error) {
            console.log(`Error in deleteChatRoom: ${error}`);
            set({ error });
        } finally {
            set({ isLoading: false });
        }
    }
}))