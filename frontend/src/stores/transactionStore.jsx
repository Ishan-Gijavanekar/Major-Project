import { create } from "zustand";
import { axiosInstance } from "../api/axios";

export const useTransactionStore = create((set, get) => ({
  transactions: [],
  isLoading: false,
  error: null,

  createStripePaymentIntent: async (data) => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.post(
        "/transactions/createStripePaymentIntent",
        data
      );
      return res.data;
    } catch (error) {
      console.log("Error in createStripePaymentIntent: ", error);
      set({ error });
    } finally {
      set({ isLoading: false });
    }
  },

  confirmStripePayment: async (data) => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.post(
        "/transactions/confirmStripePayment",
        data
      );
      return res.data;
    } catch (error) {
      console.log("Error in confirmStripePayment: ", error);
      set({ error });
    } finally {
      set({ isLoading: false });
    }
  },

  refundStripePayment: async (data) => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.post(
        "/transactions/refundStripePayment",
        data
      );
      return res.data;
    } catch (error) {
      console.log("Error in refundStripePayment: ", error);
      set({ error });
    } finally {
      set({ isLoading: false });
    }
  },

  createManualTransaction: async (data) => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.post(
        "/transactions/createManualTransaction",
        data
      );
      return res.data;
    } catch (error) {
      console.log("Error in createManualTransaction: ", error);
      set({ error });
    } finally {
      set({ isLoading: false });
    }
  },

  getTransactionById: async (id) => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.get(
        `/transactions/getTransactionById/${id}`
      );
      return res.data;
    } catch (error) {
      console.log("Error in getTransactionById: ", error);
      set({ error });
    } finally {
      set({ isLoading: false });
    }
  },

  getUserTransactions: async () => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.get("/transactions/getUserTransactions");
    console.log(res);
    
      set({ transactions: res.data.transaction });

      return res.data;
    } catch (error) {
      console.log("Error in getUserTransactions: ", error);
      set({ error });
    } finally {
      set({ isLoading: false });
    }
  },

  getAdminTransactionStats: async () => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.get(
        "/transactions/getAdminTransactionStats"
      );
      return res.data;
    } catch (error) {
      console.log("Error in getAdminTransactionStats: ", error);
      set({ error });
    } finally {
      set({ isLoading: false });
    }
  },

  updateTransactionStatus: async (id, data) => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.put(
        `/transactions/updateTransactionStatus/${id}`,
        data
      );
      return res.data;
    } catch (error) {
      console.log("Error in updateTransactionStatus: ", error);
      set({ error });
    } finally {
      set({ isLoading: false });
    }
  },
}));
