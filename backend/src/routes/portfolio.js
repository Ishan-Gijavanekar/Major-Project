import express from 'express';
import { createPortfolio, addAssets, updatePortfolio, getPortfolio, getAllPortfolios, deleteportfolio } from "../controllers/portfolio.js";
import { secure } from '../middlewares/auth.js';

const router = express.Router();

router.post("/createPortfolio", secure, createPortfolio);
router.put("/addAssets/:id", secure, addAssets);
router.put("/updatePortfolio/:id", secure, updatePortfolio);
router.get("/getPortfolio/:id", secure, getPortfolio);
router.get("/getAllPortfolios", secure, getAllPortfolios);
router.delete("/deleteportfolio/:id", secure, deleteportfolio);


export default router;