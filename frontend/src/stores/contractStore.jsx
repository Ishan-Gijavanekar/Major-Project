import { create } from 'zustand'
import {axiosInstance} from '../api/axios.js'

export const useContractStore = create((set, get) => ({
    contracts: [],
    isLoading: false,
    error: null,
    getAllContracts: async () => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.get("/contracts/getAdminStats");
            set({ contracts: res.data.contracts });
            return res.data;
        } catch (error) {
            console.log("Error in getAllContracts: ", error);
            set({ error });
        } finally {
            set({ isLoading: false });
        }
    },
    getMyContracts:async()=>{
        try{
            set({ isLoading: true });
            const res = await axiosInstance.get("/contracts/getMyContracts");
            return res.data;

        }catch(error){
            console.log("Error in getMyContracts: ", error);
            set({ error });
        }
    }
}))

