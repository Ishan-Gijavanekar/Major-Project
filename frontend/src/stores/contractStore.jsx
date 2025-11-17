import { create } from "zustand";
import { axiosInstance } from "../api/axios.js";

export const useContractStore = create((set, get) => ({
  contracts: [],
  isLoading: false,
  error: null,
  createContracts: async (data) => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.post("/contracts/contract", data);
      return res.data;
    } catch (error) {
      console.log("Error in getAllContracts: ", error);
      set({ error });
    } finally {
      set({ isLoading: false });
    }
  },
  getAllContracts: async () => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.get("/contracts/getAdminStats");
      set({ contracts: res.data.contracts });
      return res.data;
    } catch (error) {
      console.log("Error in getAllContracts: ", error);
      set({ error });
    } finally {
      set({ isLoading: false });
    }
  },
  getMyContracts: async () => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.get("/contracts/getMyContracts");
      set({ contracts: res.data.contracts });
      return res.data;
    } catch (error) {
      console.log("Error in getMyContracts: ", error);
      set({ error });
    } finally {
      set({ isLoading: false });
    }
  },

  updateContractStatus: async (id, data) => {
    try {
      set ({ isLoading: true });
      const res = await axiosInstance.put(`/contracts/updateContractStatus/${id}`, data);
      return res.data;
    } catch (error) {
      console.log("Error in updateContractStatus: ", error);
      set ({ error });
    } finally {
      set({ isLoading: false });
    }
  }
}));
