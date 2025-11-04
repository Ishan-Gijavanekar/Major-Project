import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { Mail, Lock, User, Loader } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/Input";
import PasswordStrengthMeter from "../../components/PasswordStrengthMeter.jsx";
import { useAuthStore } from "../../stores/authStore";

const SignUpPage = () => {
  const [name, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const { register, error, isLoading } = useAuthStore(); 

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword || !role) {
      toast.error("Please fill all the fields!");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    const data = { name, email, password, role: role.toLowerCase() };

    try {
      toast.loading("Creating account...");
      const res = await register(data);
      toast.success("Account created! Please verify your email.");
      toast.dismiss();
      if (res) {
        navigate("/login");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen w-[100%] flex items-center justify-center bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="p-8">
          <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
            Create Account
          </h2>

          <form onSubmit={handleSignUp}>
            <Input
              icon={User}
              type="text"
              placeholder="Name"
              value={name}
              name="name"
              onChange={(e) => setFullName(e.target.value)}
            />

            <Input
              icon={Mail}
              type="email"
              placeholder="Email Address"
              value={email}
              name="email"
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              icon={Lock}
              type="password"
              placeholder="Password"
              value={password}
              name="password"
              onChange={(e) => setPassword(e.target.value)}
            />

            <Input
              icon={Lock}
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              name="confirmPassword"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            {error && (
              <p className="text-red-500 font-semibold mt-2">{String(error)}</p>
            )}

            <div className="relative mb-6 mt-4">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <User className="size-5 text-green-500" />
              </div>
              <select
                id="role"
                name="type"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500 text-white placeholder-gray-400 transition duration-200"
              >
                <option value="" disabled>
                  Select a role
                </option>
                <option value="client">Client</option>
                <option value="Freelancer">Freelancer</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <motion.button
              className="mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader className="animate-spin mx-auto" size={24} />
              ) : (
                "Sign Up"
              )}
            </motion.button>
          </form>
        </div>

        <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
          <p className="text-sm text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="text-green-400 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUpPage;
