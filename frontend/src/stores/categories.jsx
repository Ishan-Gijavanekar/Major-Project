import { create } from 'zustand'
import { axiosInstance } from '../api/axios'

export const useCategoryStore = create((set, get) => ({
    cat: [],
    isLoading: false,
    error: null,
    
    getAllcat: async () => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.get("/categories/categories");  
            set({ cat: res.data.categories });
          
            
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
            set({ cat: res.data.categories });
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
            const res = await axiosInstance.post("/categories/category", data);
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
            const res = await axiosInstance.put(`/categories/category/${id}`, data);
            set({ cat: [...get().categories, res.data.category] });
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
            const res = await axiosInstance.delete(`/categories/category/${id}`);
            return res.data;
        } catch (error) {
            console.log("Error in deleteCategory: ", error);
            set({ error });
        } finally {
            set({ isLoading: false });
        }
    },

}));