import express from 'express';
import { createAsset,getAssets,getAssetsById,deleteAsset } from "../controllers/asset.js";
import { secure } from '../middlewares/auth.js';


const router = express.Router();

router.post("/createAsset", secure, createAsset);
router.get("/getAssets", secure, getAssets);
router.get("/getAssetsById/:id", secure, getAssetsById);
router.delete("/deleteAsset/:id", secure, deleteAsset);


export default router;