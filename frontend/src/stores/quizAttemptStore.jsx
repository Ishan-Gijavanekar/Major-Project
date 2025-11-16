import { create } from "zustand";
import { axiosInstance } from "../api/axios";

export const useQuizAttemptStore = create((set, get) => ({
    quizAttempts: [],
    isLoading: false,
    error: null,

    startAttempt: async (id) => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.post(`/quizAttempts/startAttempt/${id}`);
            console.log(res);
            
            return res.data;
        } catch (error) {
            console.log("Error in startAttempt: ", error);
            set({ error });
        } finally {
            set({ isLoading: false });
        }
    },

    submitAttempt: async (id,data) => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.post(`/quizAttempts/submitAttempt/${id}`,data);
            return res.data;
        } catch (error) {
            console.log("Error in submitAttempt: ", error);
            set({ error });
        } finally {
            set({ isLoading: false });
        }
    },

    getAllAttempts: async () => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.get("/quizAttempts/getAllAttempts");
            set({ quizAttempts: res.data.quizAttempts });
            return res.data;
        } catch (error) {
            console.log("Error in getAllAttempts: ", error);
            set({ error });
        } finally {
            set({ isLoading: false });
        }
    },

    getAttemptById: async (id) => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.get(`/quizAttempts/getAttemptById/${id}`);
            return res.data;
        } catch (error) {
            console.log("Error in getAttemptById: ", error);
            set({ error });
        } finally {
            set({ isLoading: false });
        }
    },

    getMyAttempts: async () => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.get("/quizAttempts/getMyAttempts");
            set({ quizAttempts: res.data.attempts });
            console.log(res);
            
            return res.data;
        } catch (error) {
            console.log("Error in getMyAttempts: ", error);
            set({ error });
        } finally {
            set({ isLoading: false });
        }
    },
}))