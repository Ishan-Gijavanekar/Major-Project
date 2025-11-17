import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader, MailCheck } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore.jsx";
import toast from "react-hot-toast";

const VerifyEmailPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const { verifyEmail, isLoading } = useAuthStore();
  const [status, setStatus] = useState("verifying"); 
  // verifying | success | failed

  useEffect(() => {
    const verify = async () => {
      const res = await verifyEmail(token);

      if (res?.message === "Email verified Successfully") {
        toast.success("Email verified successfully!");
        setStatus("success");
        setTimeout(() => navigate("/login"), 3000);
      } else {
        toast.error("Invalid or expired verification link");
        setStatus("failed");
      }
    };

    verify();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl p-8 text-center"
      >
        <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
          Email Verification
        </h2>

        {/* Loader State */}
        {status === "verifying" && (
          <div className="flex flex-col items-center gap-4">
            <Loader className="w-10 h-10 animate-spin text-green-400" />
            <p className="text-gray-300 text-lg">Verifying your email...</p>
          </div>
        )}

        {/* Success State */}
        {status === "success" && (
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="flex flex-col items-center gap-4"
          >
            <MailCheck className="w-14 h-14 text-green-400" />
            <p className="text-green-400 text-lg font-semibold">
              Email verified successfully! Redirecting to login...
            </p>
          </motion.div>
        )}

        {/* Failed State */}
        {status === "failed" && (
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="flex flex-col items-center gap-4"
          >
            <p className="text-red-400 text-lg font-semibold">
              Invalid or expired verification link
            </p>

            <button
              onClick={() => navigate("/login")}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-emerald-700 shadow-md transition-all"
            >
              Go to Login
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default VerifyEmailPage;
