import { create } from "zustand";
import { axiosInstance } from "../api/axios";

export const usePraposalStore = create((set, get) => ({
    praposals: [],
    isLoading: false,
    error: null,

    submitPraposal: async (praposal) => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.post("/praposals/submitPraposal",praposal);
            console.log(res);
            
            return res.data;
        } catch (error) {
            console.log("Error in submitPraposal: ", error);
            set({ error });
        } finally {
            set({ isLoading: false });
        }
    },

    getMyPraposal: async () => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.get("/praposals/getMyPraposal");
            return res.data;
        } catch (error) {
            console.log("Error in getMyPraposal: ", error);
            set({ error });
        } finally {
            set({ isLoading: false });
        }
    },

    withdrawPraposal: async (id) => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.put(`/praposals/withdrawPraposal/${id}`);
            return res.data;
        } catch (error) {
            console.log("Error in withdrawPraposal: ", error);
            set({ error });
        } finally {
            set({ isLoading: false });
        }
    },

    getJobPraposals: async (id) => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.get(`/praposals/getJobPraposals/${id}`);
            return res.data;
        } catch (error) {
            console.log("Error in getJobPraposals: ", error);
            set({ error });
        } finally {
            set({ isLoading: false });
        }
    },

    getPraposalById: async (id) => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.get(`/praposals/getPraposalById/${id}`);
            return res.data;
        } catch (error) {
            console.log("Error in getPraposalById: ", error);
            set({ error });
        } finally {
            set({ isLoading: false });
        }
    },

    updatePraposalStatus: async (id, data) => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.put(`/praposals/updatePraposalStatus/${id}`, data);
            return res.data;
        } catch (error) {
            console.log("Error in updatePraposalStatus: ", error);
            set({ error });
        } finally {
            set({ isLoading: false });
        }
    },

    adminGetAllPraposals: async () => {
        try {    
            set({ isLoading: true });
            const res = await axiosInstance.get("/praposals/adminGetAllPraposals");
            return res.data;
        } catch (error) {
            console.log("Error in adminGetAllPraposals: ", error);
            set({ error });
        } finally {
            set({ isLoading: false });
        }
    },

    deletePraposal: async (id) => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.delete(`/praposals/deletePraposal/${id}`);
            return res.data;
        } catch (error) {
            console.log("Error in deletePraposal: ", error);
            set({ error });
        } finally {
            set({ isLoading: false });
        }
    },
}))