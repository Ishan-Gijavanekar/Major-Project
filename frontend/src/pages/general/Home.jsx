import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Users,
  MessageSquare,
  ShieldCheck,
  Workflow,
  Wallet,
  Star,
  ArrowRight,
  Sparkles,
  Menu,
  X,
} from "lucide-react";

const features = [
  {
    icon: <Users className="w-8 h-8" />,
    title: "Role-Based Dashboards",
    desc: "Separate experiences for Freelancers, Clients, and Admins ensure everyone sees relevant data and tools.",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    icon: <MessageSquare className="w-8 h-8" />,
    title: "Real-Time Communication",
    desc: "Chat instantly using Socket.IO with typing indicators and read receipts for seamless collaboration.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: <Wallet className="w-8 h-8" />,
    title: "Milestone Payments",
    desc: "Integrated Stripe / Razorpay systems ensure secure and transparent milestone-based transactions.",
    gradient: "from-emerald-500 to-green-500",
  },
  {
    icon: <ShieldCheck className="w-8 h-8" />,
    title: "Secure Authentication",
    desc: "JWT-based login and role-based access control keep your data and transactions safe.",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    icon: <Workflow className="w-8 h-8" />,
    title: "Project Lifecycle Tracking",
    desc: "From Open → In Progress → Submitted → Completed — track every stage of your project clearly.",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    icon: <Star className="w-8 h-8" />,
    title: "Skill Verification & Reviews",
    desc: "Profiles include ratings, portfolios, and verified skill tests to build trust and credibility.",
    gradient: "from-indigo-500 to-blue-500",
  },
];

const Home = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white flex flex-col relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `linear-gradient(rgba(34,197,94,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.03) 1px, transparent 1px)`,
          backgroundSize: '100px 100px',
          maskImage: 'radial-gradient(ellipse 80% 50% at 50% 50%, black, transparent)'
        }}
      ></div>

      {/* ===== NAVBAR ===== */}
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
            {['Home', 'Features', 'About'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
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

          {/* Mobile Menu Button */}
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
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-gray-950/95 backdrop-blur-xl border-t border-gray-800/50"
          >
            <div className="px-6 py-4 space-y-4">
              <a href="#home" className="block text-gray-300 hover:text-white transition">Home</a>
              <a href="#features" className="block text-gray-300 hover:text-white transition">Features</a>
              <a href="#about" className="block text-gray-300 hover:text-white transition">About</a>
              <Link to="/login" className="block text-gray-300 hover:text-white transition">Login</Link>
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

      {/* ===== HERO SECTION ===== */}
      <section
        id="home"
        className="relative flex flex-col md:flex-row items-center justify-center text-center md:text-left px-6 md:px-16 pt-32 md:pt-40 pb-20 md:pb-32"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/5 to-transparent pointer-events-none"></div>
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-1 relative z-10"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block mb-6 px-4 py-2 rounded-full bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 backdrop-blur-sm"
          >
            <span className="text-green-400 text-sm font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              The Future of Freelancing
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight">
            Empowering{" "}
            <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Freelancers
            </span>{" "}
            and{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
              Clients
            </span>{" "}
            to Collaborate Smarter
          </h2>
          
          <p className="text-gray-400 text-lg md:text-xl mb-10 max-w-2xl leading-relaxed">
            GigScape bridges the gap between freelancers and clients with
            real-time communication, milestone-based payments, and transparent
            workflows.
          </p>
          
          <div className="flex flex-col sm:flex-row sm:justify-start justify-center gap-4">
            <Link
              to="/register"
              className="group relative px-8 py-4 rounded-xl font-bold overflow-hidden transition-all hover:scale-105 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:shadow-2xl hover:shadow-green-500/50"
            >
              <span className="relative z-10 flex items-center justify-center gap-2 text-lg">
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            
            <a
              href="#features"
              className="group px-8 py-4 rounded-xl font-bold border-2 border-green-500/30 bg-green-500/5 hover:bg-green-500/10 hover:border-green-500/50 transition-all backdrop-blur-sm"
            >
              <span className="flex items-center justify-center gap-2 text-lg bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                Explore Features
              </span>
            </a>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 flex flex-wrap gap-8 justify-center md:justify-start"
          >
            <div className="text-center md:text-left">
              <div className="text-3xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                10K+
              </div>
              <div className="text-gray-500 text-sm">Active Users</div>
            </div>
            <div className="text-center md:text-left">
              <div className="text-3xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                50K+
              </div>
              <div className="text-gray-500 text-sm">Projects Completed</div>
            </div>
            <div className="text-center md:text-left">
              <div className="text-3xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                98%
              </div>
              <div className="text-gray-500 text-sm">Satisfaction Rate</div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8, x: 50 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex-1 mt-12 md:mt-0 flex justify-center relative"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
            <img
              src="homepage.jpg"
              alt="Freelancer Illustration"
              className="w-80 md:w-[32rem] relative z-10 drop-shadow-2xl"
            />
          </div>
        </motion.div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section id="features" className="relative py-24 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/50 to-transparent pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-block mb-4 px-4 py-2 rounded-full bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 backdrop-blur-sm">
              <span className="text-green-400 text-sm font-semibold">FEATURES</span>
            </div>
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6">
              Why Choose{" "}
              <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                GigScape?
              </span>
            </h3>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Everything you need to succeed in the freelance economy, powered by cutting-edge technology
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="group relative"
              >
                <div className="relative h-full bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-800/50 group-hover:border-gray-700/50 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-green-500/10">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </div>
                  
                  <h4 className="text-xl md:text-2xl font-bold mb-4 text-white group-hover:text-green-400 transition-colors">
                    {feature.title}
                  </h4>
                  
                  <p className="text-gray-400 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== OBJECTIVES SECTION ===== */}
      <section id="about" className="relative py-24 md:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,197,94,0.1),transparent_70%)] pointer-events-none"></div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto px-6 text-center relative z-10"
        >
          <div className="inline-block mb-4 px-4 py-2 rounded-full bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 backdrop-blur-sm">
            <span className="text-green-400 text-sm font-semibold">OUR MISSION</span>
          </div>
          
          <h3 className="text-4xl md:text-5xl lg:text-6xl font-black mb-8">
            Our Mission &{" "}
            <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Objectives
            </span>
          </h3>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-3xl blur-2xl"></div>
            <p className="relative text-gray-300 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto bg-gradient-to-br from-gray-900/60 to-gray-950/60 backdrop-blur-sm p-8 md:p-12 rounded-3xl border border-gray-800/50">
              GigScape is a smart freelance platform that empowers freelancers to
              showcase their skills, connect with meaningful work opportunities,
              and collaborate transparently with clients. Our mission is to build
              trust, fairness, and transparency through role-based experiences,
              verified profiles, milestone payments, and global opportunities.
            </p>
          </div>
        </motion.div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="relative py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 p-12 md:p-16"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_50%)]"></div>
            
            <div className="relative z-10 text-center">
              <h3 className="text-3xl md:text-5xl font-black text-white mb-6">
                Ready to Transform Your Freelance Journey?
              </h3>
              <p className="text-white/90 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
                Join thousands of freelancers and clients already collaborating on GigScape
              </p>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-xl font-bold text-lg hover:scale-105 transition-transform shadow-2xl"
              >
                Start Your Success Story
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
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
              <a href="#home" className="hover:text-green-400 transition">Home</a>
              <a href="#features" className="hover:text-green-400 transition">Features</a>
              <a href="#about" className="hover:text-green-400 transition">About</a>
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

export default Home;