import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  MessageSquare,
  ShieldCheck,
  Workflow,
  Wallet,
  Star,
  Sparkles,
  Menu,
  X,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

// --------------------- FEATURES LIST --------------------- //
const features = [
  {
    icon: <Users className="w-8 h-8" />,
    title: "Role-Based Dashboards",
    desc: "Dedicated dashboards designed uniquely for freelancers, clients, and admins.",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    icon: <MessageSquare className="w-8 h-8" />,
    title: "Real-Time Messaging",
    desc: "Socket.IO powered chat with typing indicators, read receipts, and instant delivery.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: <Wallet className="w-8 h-8" />,
    title: "Milestone Payment System",
    desc: "Secure payments with Stripe / Razorpay integration and built-in wallet support.",
    gradient: "from-emerald-500 to-green-500",
  },
  {
    icon: <ShieldCheck className="w-8 h-8" />,
    title: "Secure Authentication",
    desc: "JWT authentication with role-based access control ensures safe user workflows.",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    icon: <Workflow className="w-8 h-8" />,
    title: "Project Lifecycle Tracking",
    desc: "Every project moves through Open → In Progress → Submitted → Completed.",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    icon: <Star className="w-8 h-8" />,
    title: "Skill Verification & Trust",
    desc: "Skill tests, portfolios, and ratings help maintain transparency and trust.",
    gradient: "from-indigo-500 to-blue-500",
  },
];

const FeaturesPage = () => {

  // NAVBAR SCROLL EFFECT
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white relative overflow-hidden">

      {/* ===================== NAVBAR ===================== */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`w-full fixed top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-gray-950/80 backdrop-blur-xl border-b border-gray-800/50 shadow-2xl"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          
          {/* Logo */}
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl md:text-3xl font-black relative"
          >
            <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
              GigScape
            </span>
            <Sparkles className="w-4 h-4 text-green-400 absolute -top-1 -right-5 animate-pulse" />
          </motion.h1>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {["Home", "Features", "About"].map((item) => (
              <a
                key={item}
                href={`/${item.toLowerCase()}`}
                className="text-gray-300 hover:text-white transition-colors font-medium relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-green-400 to-emerald-400 group-hover:w-full transition-all duration-300"></span>
              </a>
            ))}

            <Link
              to="/login"
              className="text-gray-300 hover:text-white transition-colors font-medium px-4 py-2"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="relative px-6 py-2.5 rounded-xl font-semibold overflow-hidden group bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:shadow-lg hover:shadow-green-500/50 transition-all"
            >
              <span className="relative z-10 flex items-center gap-2">
                Sign Up
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>

          {/* Mobile Toggle Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-gray-950/95 backdrop-blur-xl border-t border-gray-800/50"
          >
            <div className="px-6 py-4 space-y-4">
              <a href="/" className="block text-gray-300 hover:text-white transition">
                Home
              </a>
              <a href="/features" className="block text-gray-300 hover:text-white transition">
                Features
              </a>
              <a href="/about" className="block text-gray-300 hover:text-white transition">
                About
              </a>

              <Link to="/login" className="block text-gray-300 hover:text-white transition">
                Login
              </Link>

              <Link
                to="/register"
                className="block text-center bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-3 rounded-xl font-semibold"
              >
                Sign Up
              </Link>
            </div>
          </motion.div>
        )}
      </motion.nav>

      {/* ================= BACKGROUND GRAPHICS ================= */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "0.5s" }}
        ></div>
      </div>

      {/* Grid Overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `linear-gradient(rgba(34,197,94,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(34,197,94,0.03) 1px, transparent 1px)`,
          backgroundSize: "100px 100px",
          maskImage:
            "radial-gradient(ellipse 80% 50% at 50% 50%, black, transparent)",
        }}
      ></div>

      {/* ===================== HEADER ===================== */}
      <section className="pt-40 pb-20 text-center px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-block mb-6 px-4 py-2 rounded-full bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 backdrop-blur-sm">
            <span className="text-green-400 text-sm font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Explore Features
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black mb-6">
            Built for the Future of{" "}
            <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Freelancing
            </span>
          </h1>

          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            GigScape provides smart collaboration tools, transparent workflows, and a secure
            environment for clients and freelancers to build meaningful work relationships.
          </p>
        </motion.div>
      </section>

      {/* ===================== FEATURES GRID ===================== */}
      <section className="pb-32 px-6 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className="group"
            >
              <div className="relative h-full bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-800/50 group-hover:border-gray-700/50 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-green-500/10">

                {/* Icon */}
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <div className="text-white">{feature.icon}</div>
                </div>

                <h3 className="text-xl md:text-2xl font-bold mb-4 group-hover:text-green-400 transition-colors">
                  {feature.title}
                </h3>

                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===================== FOOTER ===================== */}
      <footer className="relative bg-gray-950 py-12 border-t border-gray-800/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <h4 className="text-2xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2">
                GigScape
              </h4>
              <p className="text-gray-500 text-sm">
                Empowering the Future of Work
              </p>
            </div>

            <div className="flex gap-8 text-sm text-gray-400">
              <a href="/" className="hover:text-green-400 transition">Home</a>
              <a href="/features" className="hover:text-green-400 transition">Features</a>
              <a href="/about" className="hover:text-green-400 transition">About</a>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-800/50 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} GigScape. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
};

export default FeaturesPage;
