import express from "express";
import {
  registerUser,
  verifyEmail,
  loginUser,
  logout,
  forgetPassword,
  resetPassword,
  changePassword,
  getProfile,
  uploadPortfolio,
  updatePhoto,
  deleteUser,
  getAllUsers,
} from "../controllers/user.js";
import { secure } from "../middlewares/auth.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/verifyEmail/:token", verifyEmail);
router.post("/login", loginUser);
router.post("/logout", secure, logout);
router.post("/forgetPassword", forgetPassword);
router.post("/resetPassword/:token", resetPassword);
router.post("/changePassword", changePassword);
router.get("/getProfile", secure, getProfile);
router.post("/uploadPortfolio", secure, uploadPortfolio);
router.post("/updatePhoto", secure, upload.single("photo"), updatePhoto);
router.delete("/deleteUser/:id", secure, deleteUser);
router.get("/getUsers",secure, getAllUsers);

export default router;
