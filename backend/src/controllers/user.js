import User from "../models/user.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendEmail } from "../utils/email.js";
import bcrypt from "bcryptjs";
import { cloudinary } from "../utils/cloudinary.js";
import Milestone from "../models/milestone.js";
import Contract from "../models/contract.js";
import Praposal from "../models/praposal.js";
import Review from "../models/Reviews.js";
import QuizAttempt from "../models/quizAttempt.js";
import mongoose from "mongoose";
import { count } from "console";

const generateToken = (id, role) => {
  const token = jwt.sign(
    {
      userId: id,
      role,
    },
    process.env.JWT_KEY,
    {
      expiresIn: process.env.JWT_EXPIRY,
    }
  );

  return token;
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(401).json({ message: "All fields are required" });
    }

    const userExsists = await User.findOne({ email });
    if (userExsists) {
      return res.status(401).json({ message: "User already exsists" });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      emailToken: verificationToken,
      isVerified: false,
    });

    await user.save();

    const verifyUrl = `http://localhost:5173/verify/${verificationToken}`;
    await sendEmail({
      to: email,
      subject: "Verify Your Email Address",
      html: `
            <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
            <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); padding: 30px;">
                <h2 style="color: #333333;">Welcome to GigScape 🎉</h2>
                <p style="font-size: 16px; color: #555555;">
                Thanks for signing up! To get started, please verify your email address by clicking the button below:
                </p>
                <div style="text-align: center; margin: 30px 0;">
                <a href="${verifyUrl}" style="background-color: #007bff; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 5px; font-weight: bold; display: inline-block;">
                  Verify Email
                </a>
             </div>
             <p style="font-size: 14px; color: #888888;">
               If the button doesn't work, you can also copy and paste this link into your browser:
             </p>
             <p style="font-size: 14px; color: #007bff; word-break: break-all;">
               ${verifyUrl}
             </p>
                <hr style="border: none; border-top: 1px solid #eeeeee; margin: 40px 0;">
                <p style="font-size: 12px; color: #aaaaaa; text-align: center;">
                  If you didn’t sign up for GigScape, you can safely ignore this email.
                 </p>
            </div>
            </div>
        `,
      text: `Thanks for signing up! Please verify your email by visiting: ${verifyUrl}`,
    });

    return res.status(200).json({
      user,
      message: "User registered successfully",
    });
  } catch (error) {
    console.log(`Error in register controller: ${error}`);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const token = req.params.token;
    const user = await User.findOne({ emailToken: token });
    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    user.isVerified = true;
    user.emailToken = null;
    await user.save();

    return res.status(200).json({ message: "Email verified Successfully" });
  } catch (error) {
    console.log(`Error in verifyEmail controller: ${error}`);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    if (!user.isVerified) {
      return res.status(403).json({ message: "Email not verified." });
    }

    const token = generateToken(user._id, user.role);

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({
      user,
      token,
      message: "Login Successfull",
    });
  } catch (error) {
    console.log(`Error in login controller: ${error}`);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    });
    res.status(200).json({ message: "Logout Successfull" });
  } catch (error) {
    console.log(`Error in logout controller: ${error}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const forgetPassword = async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "No user found" });
    }
    const token = crypto.randomBytes(32).toString("hex");
    user.emailToken = token;
    await user.save();

    const resetUrl = `http://localhost:5173/reset-password/${token}`;
    await sendEmail({
      to: user.email,
      subject: "Password Reset",
      html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background: #f8f9fa; border-radius: 8px;">
        <h2 style="color: #333; text-align: center;">Reset Your Password</h2>
          <p style="color: #555; font-size: 15px;">
            We received a request to reset your password. Click the button below to proceed.
          </p>

        <div style="text-align: center; margin: 25px 0;">
          <a href="${resetUrl}"
            style="
              background: #4f46e5;
              color: white;
              padding: 12px 20px;
              border-radius: 6px;
              text-decoration: none;
              font-size: 16px;
              display: inline-block;
            "
          >
            Reset Password
          </a>
        </div>

        <p style="color: #555; font-size: 14px;">
          If the button doesn't work, copy and paste the link below into your browser:
        </p>

        <p style="word-break: break-all; color: #0066cc; font-size: 14px;">
          ${resetUrl}
        </p>

        <hr style="margin: 30px 0;" />

        <p style="font-size: 13px; color: #999;">
          If you did not request a password reset, please ignore this email.  
        </p>
      </div>
    `,
      text: "This email is in regard to reset the password",
    });

    res.status(200).json({ message: "Password reste email sent" });
  } catch (error) {
    console.log(`Error in forgetPassword Controller: ${error}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const password = req.body.password;
    const user = await User.findOne({ emailToken: token });
    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    user.password = await bcrypt.hash(password, 12);
    user.emailToken = null;
    await user.save();

    res.status(200).json({ message: "Password reset successfull" });
  } catch (error) {
    console.log(`Error in reset password controller: ${error}`);
    return res.status(500).json({ message: "Internal; server error" });
  }
};

const changePassword = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { password } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect Old Password" });
    }
    user.password = await bcrypt.hash(password, 12);
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.log(`Error in change password controller: ${error}`);
    return res.status(500).json({ message: "Internal; server error" });
  }
};

const getProfile = async (req, res) => {
  try {
    const userId = req.user?.userId;

    const user = await User.findById(userId)
      .populate("skills")
      .select("-password");
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    res.status(200).json({
      user,
      message: "User fetched successfully",
    });
  } catch (error) {
    console.log(`Error in getProfile controller: ${error}`);
    return res.status(500).json({ message: "Internal; server error" });
  }
};

const uploadPortfolio = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { bio, skills, hourlyRate, company, location, social } = req.body;
    if (bio) user.bio = bio;
    if (skills) user.skills = skills;
    if (hourlyRate && user.role === "freelancer") user.hourlyRate = hourlyRate;
    if (company && user.role === "client") user.company = company;
    if (location) {
      if (!location.city || !location.state || !location.country) {
        return res
          .status(404)
          .json({ message: "Location not in proper format" });
      }
      user.location = location;
    }
    if (social) {
      user.social = social;
    }

    await user.save();
    res.status(200).json({
      user,
      message: "Portfolio uploaded successfully",
    });
  } catch (error) {
    console.log(`Error in uploading portfolio controller: ${error}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updatePhoto = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    let url = "";
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      url = result.secure_url;
    }

    user.avatar.url = url;
    user.avatar.public_id = url;

    await user.save();

    res.status(200).json({ message: "Photo uploaded successfully" });
  } catch (error) {
    console.log(`Error in upldating the photo: ${error}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user?.userId;
    const user = await User.findById(userId);
    if (!user && user.role === "admin") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.log(`Error in delete user controller: ${error}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const user = await User.findById(req.user?.userId);
    if (!user || user.role !== "admin") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const users = await User.find();
    res.status(200).json({ users });
  } catch (error) {
    console.error(`Error in getAllUsers controller: ${error}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const calculateStats = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const user = await User.findById(userId);
    if (!user || user.role !== "freelancer") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const contracts = await Contract.find({ freelancer: userId });
    if (!contracts) {
      return res.status(404).json({ message: "No contracts found" });
    }

    const completedJobs = contracts.filter(c => c.status === "completed").length;
    console.log(completedJobs);

    const contractIds = contracts.map(c => c._id);

    const releasedMileStone = await Milestone.aggregate([
      {
        $match: {
          contract: { $in: contractIds },
          status: "completed",
        }
      },
      {
        $group: {
          _id: null,
          total: {$sum: "$amount"}
        }
      }
    ]);

    const earning = releasedMileStone.length > 0 ? releasedMileStone[0].total : 0;

    const totalRelavantContracts = contracts.filter(
      c => c.status !== "pending" && c.status !== "cancelled"
    ).length;

    const successRate = totalRelavantContracts > 0 ?
      Math.round((completedJobs / totalRelavantContracts) * 100) : 0;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          "stats.completedJobs": completedJobs,
          "stats.earning": earning,
          "stats.successRate": successRate,
        },
      },
      {
        new: true,
      },
    );

    console.log(updatedUser);

    res.status(200).json({ user: updatedUser, message: "Stats Updated Successfully" });
  } catch (error) {
    console.log(`Error in calculateStats controller: ${error}`);
    return res.status(500).json({ message: "Internal server error" });
  }
}

const getFreelancersStats = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const user = await User.findById(userId);

    if (!user || user.role !== "freelancer") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const totalPraposals = await Praposal.countDocuments({ freelancer: userId });
    const acceptedPraposals = await Praposal.countDocuments({
      freelancer: new mongoose.Types.ObjectId(userId),
      status: "accepted",
    });
    const rejectedPraposals = await Praposal.countDocuments({
      freelancer: new mongoose.Types.ObjectId(userId),
      status: "rejected",
    });

    const praposalsAcceptanceRate = totalPraposals > 0 ?
    Math.round((acceptedPraposals / totalPraposals) * 100) : 0;

  const contractStats = await Contract.aggregate([
    {
      $match: {
        freelancer: new mongoose.Types.ObjectId(userId)
      }
    },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1},
        totalAmount: { $sum : "$totalAmount" },
      },
    },
  ]);

  const contractSummary = {};

  contractStats.forEach((c) => {
    contractSummary[c._id] = {
      count: c.count,
      totalAmount: c.totalAmount,
    };
  });

  const totalContracts = contractStats.reduce((a,b) => a + b.count, 0);
  const activeContracts = contractSummary['pending']?.count || 0;
  const completedContracts = contractSummary['completed']?.count || 0;
  const cancelledContracts = contractSummary['cancelled']?.count || 0;

  const contractCompletionRate = totalContracts > 0 ?
    Math.round((completedContracts / totalContracts) * 100) : 0;

  const releasedMilestones = await Milestone.aggregate([
    {
      $match: {
        status: "completed",
        currency: "usd",
        amount: { $gt: 0},
      }
    },
    {
      $lookup: {
        from: "contracts",
        localField: "contract",
        foreignField: "_id",
        as: "contract"
      }
    },
    {
      $unwind: "$contract"
    },
    {
      $match: {
        "contract.freelancer": new mongoose.Types.ObjectId(userId),
      }
    },
    {
      $group: {
        _id: null,
        totalEarning: { $sum: "$amount"}
      }
    }
  ]);

  const totalEarnings = releasedMilestones[0]?.totalEarning || 0;

  const milestoneStats = await Milestone.aggregate([
    {
      $lookup: {
        from: "contracts",
        localField: "contract",
        foreignField: "_id",
        as: "contract"
      },
    },
    { $unwind: "$contract" },
    {
      $match: {
        "contract.freelancer": new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const milestoneSummary = {};
  milestoneStats.forEach((m) => {
    milestoneSummary[m._id] = m.count
  })

  const totalMileStones = milestoneStats.reduce((a,b) => a + b.count, 0);

  const milestoneCompleteRate = totalMileStones > 0 
    ? (((milestoneSummary['completed'] || 0) / totalMileStones) * 100).toFixed(2) : 0;

  const reviewStats = await Review.aggregate([
    {
      $match: {
        reviewee: new mongoose.Types.ObjectId(userId),
      }
    },
    {
      $group: {
        _id: null,
        avgRating: { $avg: "$rating" },
        totalReviews: { $sum : 1 },
      },
    },
  ]);

  const avgRating = reviewStats[0]?.avgRating || 0;
  const totalReviews = reviewStats[0]?.totalReviews || 0;

  const quizStats = await QuizAttempt.aggregate([
    {
      $match: {user: new mongoose.Types.ObjectId(userId)}
    },
    {
      $group: {
        _id: null,
        attempts: { $sum: 1 },
        avgScore: { $avg: "$totalScore" },
        passedCount: { $sum: { $cond: ["$passed", 1 , 0] } },
      },
    },
  ]);

  const quizAttempts = quizStats[0]?.attempts || 0;
  const avgQuizScore = quizStats[0]?.avgScore || 0;
  const quizPassRate =
      quizAttempts > 0 ? ((quizStats[0]?.passedCount / quizAttempts) * 100).toFixed(2) : 0;


  const appliedJobsIds = await Praposal.find({
    freelancer: new mongoose.Types.ObjectId(userId),
  }).distinct('job');

  const appliedJobs = appliedJobsIds.length;

  return res.status(200).json({
    freelancer: req.user.userId,

    praposals: {
      total: totalPraposals,
      accepted: acceptedPraposals,
      rejected: rejectedPraposals,
      acceptanceRate: praposalsAcceptanceRate + "%",
    },

    contracts: {
      total: totalContracts,
      summary: contractSummary,
      completionRate: contractCompletionRate + "%",
    },

    earnings: {
      totalEarnings,
    },

    milestones: {
      summary: milestoneSummary,
      completionRate: milestoneCompleteRate + "%",
    },

    reviews: {
      totalReviews,
      avgRating: avgRating.toFixed(2),
    },

    quizzes: {
      attempts: quizAttempts,
      avgScore: avgQuizScore,
      passRate: quizPassRate + "%",
    },

    jobs: {
      appliedJobs: appliedJobs
    },

    updatedAt: new Date(),
  })

  } catch (error) {
    console.log(`Error in getFreelancersStats controller: ${error}`);
    return res.status(500).json({ message: "Internal server error" });
  }
}
  

export {
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
  calculateStats,
  getFreelancersStats
};
