import { create } from 'zustand'
import { axiosInstance } from '../api/axios'

export const useCategoryStore = create((set, get) => ({
    categories: [],
    isLoading: false,
    error: null,
    
    getAllCategories: async () => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.get("/categories");
            set({ categories: res.data.categories });
        } catch (error) {
            console.log("Error in getAllCategories: ", error);
            set({ error });
        } finally {
            set({ isLoading: false });
        }
    },

    getCategoriesByType: async (id) => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.get(`/categories/${id}`);
            set({ categories: res.data.categories });
        } catch (error) {
            console.log("Error in getCategoriesByType: ", error);
            set({ error });
        } finally {
            set({ isLoading: false });
        }
    },

    addCategory: async (data) => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.post("/categories", data);
            return res.data;
        } catch (error) {
            console.log("Error in addCategory: ", error);
            set({ error });
        } finally {
            set({ isLoading: false });
        }
    },

    updateCategory: async (id, data) => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.put(`/categories/${id}`, data);
            set({ categories: [...get().categories, res.data.category] });
        } catch (error) {
            console.log("Error in updateCategory: ", error);
            set({ error });
        } finally {
            set({ isLoading: false });
        }
    },

    deleteCategory: async (id) => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.delete(`/categories/${id}`);
            return res.data;
            set({ categories: [] });
        } catch (error) {
            console.log("Error in deleteCategory: ", error);
            set({ error });
        } finally {
            set({ isLoading: false });
        }
    },

}));