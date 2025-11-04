import { axiosInstance } from "../api/axios.js";
import { create } from "zustand";

export const useAuthSore = create((set, get) => {
    authUser: null;
    isLoading: false;
    error: null;

    checkAuth = async () => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.get("/users/getProfile");
            set({ authUser: res.data.user });
        } catch (error) {
            console.log("Error in checkAuth: ", error);
            set({ error });
        } finally {
            set({ isLoading: false });
        }
    }

    const login = async (data) => {
        try {
            const res = await axiosInstance.post("/users/login", data);
            set({ authUser: res.data.user });
            return res.data;
        } catch (error) {
            console.log(`Error in login: ${error}`);
            set({ error });
        } finally {
            set({ isLoading: false });
        }
    }

    const logout = async () => {
        try {
            set({ isLoading: true });
            await axiosInstance.post("/users/logout");
            set({ authUser: null });
        } catch (error) {
            console.log("Error in logout: ", error);
            set({ error });
        } finally {
            set({ isLoading: false });
        }
    }

    const register = async (data) => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.post("/users/register", data);
            return res.data;
        } catch (error) {
            console.log("Error in register: ", error);
            set({ error });
        } finally {
            set({ isLoading: false });
        }
    }

    const verifyEmail = async (token) => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.post(`/users/verifyEmail/${token}`);
            return res.data;
        } catch (error) {
            console.log("Error in verifyEmail: ", error);
            set({ error });
        } finally {
            set({ isLoading: false });
        }
    }

    const forgetPassword = async (data) => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.post("/users/forgetPassword", data);
            return res.data;
        } catch (error) {
            
        } finally {
            set({ isLoading: false });
        }
    } 

    const resetPassword = async (token, data) => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.post(`/users/resetPassword/${token}`, data);
            return res.data;
        } catch (error) {
            console.log("Error in resetPassword: ", error);
            set({ error });
        } finally {
            set({ isLoading: false });
        }
    }

    const changePassword = async (data) => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.post("/users/changePassword", data);
            return res.data;
        } catch (error) {
            console.log("Error in changePassword: ", error);
            set({ error });
        } finally {
            set({ isLoading: false });
        }
    }

    const uploadPortfolio = async (data) => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.post("/users/uploadPortfolio", data);
            return res.data;
        } catch (error) {
            console.log("Error in uploadPortfolio: ", error);
            set({ error });
        } finally {
            set({ isLoading: false });
        }
    }

    const updatePhoto = async (data) => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.post("/users/updatePhoto", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return res.data;
        } catch (error) {
            console.log("Error in updatePhoto: ", error);
            set({ error });
        } finally {
            set({ isLoading: false });
        }
    }

    const deleteUser = async() => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.delete("/users/deleteUser");
            return res.data;
            set({ authUser: null });
        } catch (error) {
            console.log("Error in deleteUser: ", error);
            set({ error });
        } finally {
            set({ isLoading: false });
        }
    }

})