import React, { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Loader, ShieldCheck } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore.jsx";
import toast from "react-hot-toast";

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const { resetPassword, isLoading } = useAuthStore();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState("form"); 


  const handleReset = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const res = await resetPassword(token, { password });

    if (res?.message === "Password reset successfull") {
      toast.success("Password reset successfully!");
      setStatus("success");
      setTimeout(() => navigate("/login"), 2000);
    } else {
      toast.error("Invalid or expired reset link");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl p-8 text-center"
      >
        {status === "form" && (
          <>
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
              Reset Password
            </h2>

            <form onSubmit={handleReset} className="space-y-6">
              {/* New Password */}
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-700 bg-opacity-40 border border-gray-600 rounded-lg pl-10 pr-3 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-gray-700 bg-opacity-40 border border-gray-600 rounded-lg pl-10 pr-3 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none transition duration-200"
              >
                {isLoading ? (
                  <Loader className="w-6 h-6 animate-spin mx-auto" />
                ) : (
                  "Reset Password"
                )}
              </motion.button>
            </form>
          </>
        )}

        {/* Success State */}
        {status === "success" && (
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center gap-4"
          >
            <ShieldCheck className="w-16 h-16 text-green-400" />
            <p className="text-green-400 text-xl font-semibold">
              Password Reset Successfully!
            </p>
            <p className="text-gray-300">Redirecting to login...</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;
