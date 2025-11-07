import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Users,
  MessageSquare,
  ShieldCheck,
  Workflow,
  Wallet,
  Star,
} from "lucide-react";

const features = [
  {
    icon: <Users className="w-8 h-8 text-green-400" />,
    title: "Role-Based Dashboards",
    desc: "Separate experiences for Freelancers, Clients, and Admins ensure everyone sees relevant data and tools.",
  },
  {
    icon: <MessageSquare className="w-8 h-8 text-green-400" />,
    title: "Real-Time Communication",
    desc: "Chat instantly using Socket.IO with typing indicators and read receipts for seamless collaboration.",
  },
  {
    icon: <Wallet className="w-8 h-8 text-green-400" />,
    title: "Milestone Payments",
    desc: "Integrated Stripe / Razorpay systems ensure secure and transparent milestone-based transactions.",
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-green-400" />,
    title: "Secure Authentication",
    desc: "JWT-based login and role-based access control keep your data and transactions safe.",
  },
  {
    icon: <Workflow className="w-8 h-8 text-green-400" />,
    title: "Project Lifecycle Tracking",
    desc: "From Open → In Progress → Submitted → Completed — track every stage of your project clearly.",
  },
  {
    icon: <Star className="w-8 h-8 text-green-400" />,
    title: "Skill Verification & Reviews",
    desc: "Profiles include ratings, portfolios, and verified skill tests to build trust and credibility.",
  },
];

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* ===== NAVBAR ===== */}
      <nav className="w-full bg-gray-800 bg-opacity-60 backdrop-blur-md border-b border-gray-700 fixed top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-extrabold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
            GigScape
          </h1>
          <div className="hidden md:flex space-x-8 font-medium">
            <a href="#hero" className="hover:text-green-400 transition">
              Home
            </a>
            <a href="#features" className="hover:text-green-400 transition">
              Features
            </a>
            <a href="#about" className="hover:text-green-400 transition">
              About
            </a>
            <Link to="/login" className="hover:text-green-400 transition">
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-2 rounded-md font-semibold shadow-md hover:from-green-600 hover:to-emerald-700 transition"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* ===== HERO SECTION ===== */}
      <section
        id="hero"
        className="flex flex-col md:flex-row items-center justify-center text-center md:text-left px-6 md:px-16 pt-32 md:pt-40 pb-16"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1"
        >
          <h2 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            Empowering{" "}
            <span className="text-green-400">Freelancers</span> and{" "}
            <span className="text-emerald-400">Clients</span> to Collaborate
            Smarter
          </h2>
          <p className="text-gray-300 mb-8 max-w-lg">
            GigScape bridges the gap between freelancers and clients with
            real-time communication, milestone-based payments, and transparent
            workflows.
          </p>
          <div className="flex flex-col sm:flex-row sm:justify-start justify-center gap-4">
            <Link
              to="/signup"
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg font-semibold shadow-md hover:from-green-600 hover:to-emerald-700 transition"
            >
              Get Started
            </Link>
            <a
              href="#features"
              className="px-6 py-3 border border-green-500 text-green-400 rounded-lg font-semibold hover:bg-green-500 hover:text-white transition"
            >
              Learn More
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="flex-1 mt-12 md:mt-0 flex justify-center"
        >
          <img
            src="https://cdn3d.iconscout.com/3d/premium/thumb/freelancer-working-on-laptop-3d-illustration-download-in-png-blend-fbx-gltf-file-formats--job-workspace-career-people-pack-business-illustrations-6615804.png"
            alt="Freelancer Illustration"
            className="w-80 md:w-[28rem]"
          />
        </motion.div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section id="features" className="py-20 bg-gray-800 bg-opacity-40">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
            Why Choose GigScape?
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.03 }}
                className="bg-gray-800 bg-opacity-60 rounded-2xl p-6 shadow-lg hover:shadow-green-700/30 transition"
              >
                <div className="flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h4 className="text-xl font-semibold mb-3 text-green-400 text-center">
                  {feature.title}
                </h4>
                <p className="text-gray-300 text-sm text-center">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== OBJECTIVES SECTION ===== */}
      <section id="about" className="py-20 bg-gray-900">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h3 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
            Our Mission & Objectives
          </h3>
          <p className="text-gray-300 leading-relaxed max-w-3xl mx-auto">
            GigScape is a smart freelance platform that empowers freelancers to
            showcase their skills, connect with meaningful work opportunities,
            and collaborate transparently with clients. Our mission is to build
            trust, fairness, and transparency through role-based experiences,
            verified profiles, milestone payments, and global opportunities.
          </p>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-gray-800 py-6 text-center border-t border-gray-700">
        <p className="text-gray-400 text-sm">
          © {new Date().getFullYear()} GigScape — Empowering the Future of Work.
        </p>
      </footer>
    </div>
  );
};

export default Home;
