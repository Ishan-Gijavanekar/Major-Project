import { create } from "zustand";
import { axiosInstance } from "../api/axios";

export const useWalletStore = create((set, get) => ({
    wallet: [],
    isLoading: false,
    error: null,

    createWallet: async (data) => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.post("/wallets/createWallet", data);
            return res.data;
        } catch (error) {
            console.log("Error in createWallet: ", error);
            set({ error });
        } finally {
            set({ isLoading: false });
        }
    },

    getWallet: async () => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.get("/wallets/getWallet");
            return res.data;
        } catch (error) {
            console.log("Error in getWallet: ", error);
            set({ error });
        } finally {
            set({ isLoading: false });
        }
    },

    getWalletBalance: async () => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.get("/wallets/getWalletBalance");
            return res.data;
        } catch (error) {
            console.log("Error in getWalletBalance: ", error);
            set({ error });
        } finally {
            set({ isLoading: false });
        }
    },

    depositFunds: async (data) => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.post("/wallets/depositFunds", data);
            return res.data;
        } catch (error) {
            console.log("Error in depositFunds: ", error);
            set({ error });
        } finally {
            set({ isLoading: false });
        }
    },
    
    withdrawFunds: async (data) => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.post("/wallets/withdrawFunds", data);
            return res.data;
        } catch (error) {
            console.log("Error in withdrawFunds: ", error);
            set({ error });
        } finally {
            set({ isLoading: false });
        }
    },

    holdFunds: async (data) => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.post("/wallets/holdFunds", data);
            return res.data;
        } catch (error) {
            console.log("Error in holdFunds: ", error);
            set({ error });
        } finally {
            set({ isLoading: false });
        }
    },

    releseHolds: async (data) => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.post("/wallets/releseHolds", data);
            return res.data;
        } catch (error) {
            console.log("Error in releseHolds: ", error);
            set({ error });
        } finally {
            set({ isLoading: false });
        }
    },

    getWalletTransactions: async () => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.get("/wallets/getWalletTransactions");
            return res.data;
        } catch (error) {
            console.log("Error in getWalletTransactions: ", error);
            set({ error });
        } finally {
            set({ isLoading: false });
        }
    },
}))