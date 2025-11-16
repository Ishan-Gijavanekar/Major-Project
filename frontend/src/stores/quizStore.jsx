import { create } from "zustand";
import { axiosInstance } from "../api/axios";

export const useQuizStore = create((set, get) => ({
  quizes: [],
  isLoading: false,
  error: null,

  createQuiz: async (quiz) => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.post("/quizes/createQuiz", quiz);
      return res.data;
    } catch (error) {
      console.log("Error in createQuiz: ", error);
      set({ error });
    } finally {
      set({ isLoading: false });
    }
  },

  publishQuiz: async (id) => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.put(`/quizes/publishQuix/${id}`);
      return res.data;
    } catch (error) {
      console.log("Error in publishQuix: ", error);
      set({ error });
    } finally {
      set({ isLoading: false });
    }
  },

  getAllQuizes: async () => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.get("/quizes/getAllQuizes");
      set({ quizes: res.data.quizes });
      return res.data;
    } catch (error) {
      console.log("Error in getAllQuizes: ", error);
      set({ error });
    } finally {
      set({ isLoading: false });
    }
  },

  getQuizById: async (id) => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.get(`/quizes/getQuizById/${id}`);
      return res.data;
    } catch (error) {
      console.log("Error in getQuizById: ", error);
      set({ error });
    } finally {
      set({ isLoading: false });
    }
  },

  getQuizByCategory: async (id) => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.get(`/quizes/getQuizByCategory/${id}`);
      console.log(res);
      
      set({ quizes: res.data.quizes });

      return res.data;
    } catch (error) {
      console.log("Error in getQuizByCategory: ", error);
      set({ error });
    } finally {
      set({ isLoading: false });
    }
  },

  updateQuiz: async (id, quiz) => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.put(`/quizes/updateQuiz/${id}`, quiz);
      return res.data;
    } catch (error) {
      console.log("Error in updateQuiz: ", error);
      set({ error });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteQuiz: async (id) => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.delete(`/quizes/deleteQuiz/${id}`);
      return res.data;
    } catch (error) {
      console.log("Error in deleteQuiz: ", error);
      set({ error });
    } finally {
      set({ isLoading: false });
    }
  },
}));
