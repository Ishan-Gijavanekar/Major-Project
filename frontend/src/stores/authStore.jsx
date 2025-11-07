import { axiosInstance } from "../api/axios.js";
import { create } from "zustand";
import { useSocketStore } from "./socketStore.jsx";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isLoading: false,
  error: null,

  checkAuth: async () => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.get("/users/getProfile");
      
      set({ authUser: res.data.user });
    } catch (error) {
      console.log("Error in checkAuth: ", error);
      set({ error });
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (data) => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.post("/users/login", data);
      console.log(res);
      
      set({ authUser: res.data.user, error: null });
      useSocketStore.getState().connectSocket();

      return res.data;
    } catch (error) {
      console.log(`Error in login: ${error}`);
      console.log(error);
      set({ error: error.response?.data?.message || "Login failed" });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      set({ isLoading: true });
      await axiosInstance.post("/users/logout");
      useSocketStore.getState().disconnectSocket();
      set({ authUser: null });
    } catch (error) {
      console.log("Error in logout: ", error);
      set({ error });
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (data) => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.post("/users/register", data);
      return res.data;
    } catch (error) {
      console.log("Error in register: ", error);
      set({ error });
    } finally {
      set({ isLoading: false });
    }
  },

  verifyEmail: async (token) => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.post(`/users/verifyEmail/${token}`);
      return res.data;
    } catch (error) {
      console.log("Error in verifyEmail: ", error);
      set({ error });
    } finally {
      set({ isLoading: false });
    }
  },

  forgetPassword: async (data) => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.post("/users/forgetPassword", data);
      return res.data;
    } catch (error) {
      console.log("Error in forgetPassword: ", error);
      set({ error });
    } finally {
      set({ isLoading: false });
    }
  },

  resetPassword: async (token, data) => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.post(
        `/users/resetPassword/${token}`,
        data
      );
      return res.data;
    } catch (error) {
      console.log("Error in resetPassword: ", error);
      set({ error });
    } finally {
      set({ isLoading: false });
    }
  },

  changePassword: async (data) => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.post("/users/changePassword", data);
      return res.data;
    } catch (error) {
      console.log("Error in changePassword: ", error);
      set({ error });
    } finally {
      set({ isLoading: false });
    }
  },

  uploadPortfolio: async (data) => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.post("/users/uploadPortfolio", data);
      return res.data;
    } catch (error) {
      console.log("Error in uploadPortfolio: ", error);
      set({ error });
    } finally {
      set({ isLoading: false });
    }
  },

  updatePhoto: async (data) => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.post("/users/updatePhoto", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    } catch (error) {
      console.log("Error in updatePhoto: ", error);
      set({ error });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteUser: async () => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.delete("/users/deleteUser");
      set({ authUser: null });
      return res.data;
    } catch (error) {
      console.log("Error in deleteUser: ", error);
      set({ error });
    } finally {
      set({ isLoading: false });
    }
  },
}));
