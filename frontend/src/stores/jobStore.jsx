import { create } from 'zustand'
import { axiosInstance } from '../api/axios'

export const useJobStore = create((set, get) => ({
    jobs: [],
    isLoading: false,
    error: null,
    
    createJob: async (data) => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.post("/jobs/createJob", data);
            return res.data;
        } catch (error) {
            console.log("Error in createJob: ", error);
            set({ error });
        } finally {
            set({ isLoading: false });
        }
    },

    uploadAttachments: async (data) => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.post("/jobs/uploadAttachments", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            });
            return res.data;
        } catch (error) {
            console.log("Error in uploadAttachments: ", error);
            set({ error });
        } finally {
            set({ isLoading: false });
        }
    },

    updateJob: async (id, data) => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.put(`/jobs/updateJob/${id}`, data);
            return res.data;
        } catch (error) {
            console.log("Error in updateJob: ", error);
            set({ error });
        } finally {
            set({ isLoading: false });
        }
    },

    deleteJob: async (id) => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.delete(`/jobs/deleteJob/${id}`);
            return res.data;
        } catch (error) {
            console.log("Error in deleteJob: ", error);
            set({ error });
        } finally {
            set({ isLoading: false });
        }
    },

    updateJonStatus: async (id, data) => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.put(`/jobs/updateJobStatus/${id}`, data);
            return res.data;
        } catch (error) {
            console.log("Error in updateJobStatus: ", error);
            set({ error });
        } finally {
            set({ isLoading: false });
        }
    },

    getAllMyJobs: async () => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.get("/jobs/getAllMyJobs");
            return res.data;
        } catch (error) {
            console.log("Error in getAllMyJobs: ", error);
            set({ error });
        } finally {
            set({ isLoading: false });
        }
    },

    getJobById: async (id) => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.get(`/jobs/getJobById/${id}`);
            return res.data;
        } catch (error) {
            console.log("Error in getJobById: ", error);
            set({ error });
        } finally {
            set({ isLoading: false });
        }
    },

    getJobs: async () => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.get("/jobs/getJobs");
            return res.data;
        } catch (error) {
            console.log("Error in getJobs: ", error);
            set({ error });
        } finally {
            set({ isLoading: false });
        }
    },

    getJobByIdFreelancer: async (id) => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.get(`/jobs/getJobByIdFreelancer/${id}`);
            return res.data;
        } catch (error) {
            console.log("Error in getJobByIdFreelancer: ", error);
            set({ error });
        } finally {
            set({ isLoading: false });
        }
    },

    getAllJobs: async () => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.get("/jobs/getAllJobs");
         
            set({ jobs: res.data.jobs });
            // console.log(get().jobs);
            return res.data;
        } catch (error) {
            console.log("Error in getAllJobs: ", error);
            set({ error });
        } finally {
            set({ isLoading: false });
        }
    },

    featuredaJob: async (id) => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.put(`/jobs/featuredaJob/${id}`);
            return res.data;
        } catch (error) {
            console.log("Error in featuredaJob: ", error);
            set({ error });
        } finally {
            set({ isLoading: false });
        }
    },

    adminDeleteJob: async (id) => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.delete(`/jobs/adminDeleteJob/${id}`);
            return res.data;
        } catch (error) {
            console.log("Error in adminDeleteJob: ", error);
            set({ error });
        } finally {
            set({ isLoading: false });
        }
    },
}))