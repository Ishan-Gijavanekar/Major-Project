import React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Loader, CheckCircle } from "lucide-react";
import Input from "../../components/Input";
import {Link} from "react-router-dom";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        // navigate("/login");
        console.log("Redirect to login");
      }, 2000);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="p-8">
          <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
            Reset Password
          </h2>

          {!isSuccess ? (
            <>
              <p className="text-center text-gray-400 mb-6">
                Please enter your new password below.
              </p>

              <form onSubmit={handleSubmit}>
                <Input
                  icon={Lock}
                  type="password"
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <Input
                  icon={Lock}
                  type="password"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />

                {error && (
                  <p className="text-red-500 text-sm font-semibold mb-4">
                    {error}
                  </p>
                )}

                <div className="mb-6">
                  <p className="text-xs text-gray-400">Password must:</p>
                  <ul className="text-xs text-gray-400 mt-2 space-y-1">
                    <li className={password.length >= 8 ? "text-green-400" : ""}>
                      • Be at least 8 characters long
                    </li>
                    <li className={password === confirmPassword && password ? "text-green-400" : ""}>
                      • Match the confirmation password
                    </li>
                  </ul>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader className="w-6 h-6 animate-spin mx-auto" />
                  ) : (
                    "Reset Password"
                  )}
                </motion.button>
              </form>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6"
            >
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Password Reset Successfully!
              </h3>
              <p className="text-gray-400 mb-4">
                Your password has been updated successfully.
              </p>
              <p className="text-sm text-gray-500">
                Redirecting to login...
              </p>
              <Link to={"/login"} className="text-green-400 hover:underline">
              Login
            </Link>
            </motion.div>
          )}
        </div>

        {!isSuccess && (
          <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
            <p className="text-sm text-gray-400">
              Remember your password?{" "}
              <a href="#" className="text-green-400 hover:underline">
                Back to Login
              </a>
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;