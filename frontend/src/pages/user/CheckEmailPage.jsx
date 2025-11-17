import React from "react";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CheckEmailPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl p-8 text-center"
      >
        <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
          Verify Your Email
        </h2>

        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center gap-4"
        >
          <Mail className="w-14 h-14 text-green-400" />

          <p className="text-gray-300 text-lg">
            We’ve sent a verification link to your email. Please check your
            inbox and click the link to activate your account.
          </p>

          <p className="text-gray-400 text-sm">
            Didn’t receive the email? Check your spam folder.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CheckEmailPage;
