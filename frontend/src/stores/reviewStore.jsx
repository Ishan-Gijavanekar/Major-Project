import {create} from "zustand";
import {axiosInstance} from "../api/axios";

export const useReviewStore = create((set, get) => ({
    reviews: [],
    isLoading: false,
    error: null,

    createReview: async (data) => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.post("/reviews/createReview", data);
            return res.data;
        } catch (error) {
            console.log("Error in createReview: ", error);
            set({ error });
        } finally {
            set({ isLoading: false });
        }
    },

    getJobReviews: async (id) => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.get(`/reviews/getJobReviews/${id}`);
            return res.data;
        } catch (error) {
            console.log("Error in getJobReviews: ", error);
            set({ error });
        } finally {
            set({ isLoading: false });
        }
    },

    getReviewById: async (id) => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.get(`/reviews/getReviewById/${id}`);
            return res.data;
        } catch (error) {
            console.log("Error in getReviewsById: ", error);
            set({ error });
        } finally {
            set({ isLoading: false });
        }
    },

    getReviewOfFreelancer: async (id) => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.get(`/reviews/getReviewOfFreelancer/${id}`);
            return res.data;
        } catch (error) {
            console.log("Error in getReviewOfFreelancer: ", error);
            set({ error });
        } finally {
            set({ isLoading: false });
        }
    },

    updateReviews: async (id, data) => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.put(`/reviews/updateReviews/${id}`, data);
            return res.data;
        } catch (error) {
            console.log("Error in updateReviews: ", error);
            set({ error });
        } finally {
            set({ isLoading: false });
        }
    },

    deleteReview: async (id) => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.delete(`/reviews/deleteReview/${id}`);
            return res.data;
        } catch (error) {
            console.log("Error in deleteReview: ", error);
            set({ error });
        } finally {
            set({ isLoading: false });
        }
    },

    getAllReviews: async () => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.get("/reviews/getAllReviews");
            return res.data;
        } catch (error) {
            console.log("Error in getAllReviews: ", error);
            set({ error });
        } finally {
            set({ isLoading: false });
        }
    },
}))