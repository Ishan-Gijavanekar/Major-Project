import { create } from "zustand";
import { axiosInstance } from "../api/axios";

export const useMilestoneStore = create((set, get) => ({
    milestones: [],
    isLoading: false,
    error: null,

    createMilestone: async (data) => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.post("/milestones/createMilestone", data);
            return res.data;
        } catch (error) {
            console.log("Error in createMilestone: ", error);
            set({ error });
        } finally {
            set({ isLoading: false });
        }
    },

    updateMilestoneStatus: async (id, data) => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.put(`/milestones/updateMileStoneStatus/${id}`, data);
            return res.data;
        } catch (error) {
            console.log("Error in updateMilestoneStatus: ", error);
            set({ error });
        } finally {
            set({ isLoading: false });
        }
    },

    attachFile: async (id, data) => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.post(`/milestones/attachFile/${id}`, data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            });
            return res.data;
        } catch (error) {
            console.log("Error in attachFile: ", error);
            set({ error });
        } finally {
            set({ isLoading: false });
        }
    },

    getMilestones: async (id) => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.get(`/milestones/getMilestones/${id}`);
            return res.data;
        } catch (error) {
            console.log("Error in getMilestones: ", error);
            set({ error });
        } finally {
            set({ isLoading: false });
        }
    },

    getMilestoneById: async (id) => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.get(`/milestones/getMilestoneById/${id}`);
            return res.data;
        } catch (error) {
            console.log("Error in getMilestoneById: ", error);
            set({ error });
        } finally {
            set({ isLoading: false });
        }
    },

    updateMilestone: async (id, data) => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.put(`/milestones/updateMileStone/${id}`, data);
            return res.data;
        } catch (error) {
            console.log("Error in updateMilestone: ", error);
            set({ error });
        } finally {
            set({ isLoading: false });
        }
    },

    deleteMilestone: async (id) => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.delete(`/milestones/deleteMilestone/${id}`);
            return res.data;
        } catch (error) {
            console.log("Error in deleteMilestone: ", error);
            set({ error });
        } finally {
            set({ isLoading: false });
        }
    },

    getAdminMilestones: async () => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.get("/milestones/getAdminMilestones");
            return res.data;
        } catch (error) {
            console.log("Error in getAdminMilestones: ", error);
            set({ error });
        } finally {
            set({ isLoading: false });
        }
    },
}))