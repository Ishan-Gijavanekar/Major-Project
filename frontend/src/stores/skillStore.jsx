import { create } from "zustand";
import { axiosInstance } from "../api/axios";

export const useSkillStore = create((set, get) => ({
    skills: [],
    isLoading: false,
    error: null,

    addSkill: async (skill) => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.post("/skills/addSkill", skill);
            return res.data;
        } catch (error) {
            console.log("Error in addSkill: ", error);
            set({ error });
        } finally {
            set({ isLoading: false });
        }
    },

    getSkills: async () => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.get("/skills/getSkills");
            set({ skills: res.data.skills });
            return res.data;
        } catch (error) {
            console.log("Error in getSkills: ", error);
            set({ error });
        } finally {
            set({ isLoading: false });
        }
    },

    deleteSkill: async (id) => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.delete(`/skills/deleteSkill/${id}`);
            return res.data;
        } catch (error) {
            console.log("Error in deleteSkill: ", error);
            set({ error });
        } finally {
            set({ isLoading: false });
        }
    },

    getSkillById: async (id) => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.get(`/skills/getSkillById/${id}`);
            return res.data;
        } catch (error) {
            console.log("Error in getSkillById: ", error);
            set({ error });
        } finally {
            set({ isLoading: false });
        }
    },

    updateSkill: async (id, skill) => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.put(`/skills/updateSkill/${id}`, skill);
            return res.data;
        } catch (error) {
            console.log("Error in updateSkill: ", error);
            set({ error });
        } finally {
            set({ isLoading: false });
        }
    },
}))