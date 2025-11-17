import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Users,
  Globe,
  Target,
  ShieldCheck,
  Workflow,
  Sparkles,
  Menu,
  X,
  ArrowRight,
  Rocket,
} from "lucide-react";

const About = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white flex flex-col relative overflow-hidden">
      {/* ===== BACKGROUND ELEMENTS ===== */}
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

      {/* GRID OVERLAY */}
      <div
        className="fixed inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `linear-gradient(rgba(34,197,94,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.03) 1px, transparent 1px)`,
          backgroundSize: "100px 100px",
          maskImage:
            "radial-gradient(ellipse 80% 50% at 50% 50%, black, transparent)",
        }}
      ></div>

      {/* ===== NAVBAR (same as Home) ===== */}
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

          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-300 hover:text-white transition-colors font-medium"
            >
              Home
            </Link>
            <a
              href="#overview"
              className="text-gray-300 hover:text-white transition-colors font-medium"
            >
              About
            </a>
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

          {/* Mobile Menu */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      {/* ===== HEADER SECTION ===== */}
      <section
        id="overview"
        className="flex flex-col items-center text-center px-6 pt-32 pb-20 md:pt-40"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl relative z-10"
        >
          <div className="inline-block mb-6 px-4 py-2 rounded-full bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 backdrop-blur-sm">
            <span className="text-green-400 text-sm font-semibold">
              ABOUT GIGSCAPE
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6">
            Redefining the Future of the{" "}
            <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Freelance Economy
            </span>
          </h1>

          <p className="text-gray-400 text-lg leading-relaxed max-w-3xl mx-auto">
            GigScape bridges freelancers and clients through a modern,
            technology-driven, transparent, and fair platform that simplifies
            work, ensures trust, and unlocks global opportunities for every
            creator.
          </p>
        </motion.div>
      </section>

      {/* ===== MISSION SECTION ===== */}
      <section className="relative py-24 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-5xl mx-auto text-center relative z-10"
        >
          <div className="inline-block mb-4 px-4 py-2 rounded-full bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 backdrop-blur-sm">
            <span className="text-green-400 text-sm font-semibold">
              OUR MISSION
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-black mb-8">
            Building a Platform Rooted in{" "}
            <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Trust & Transparency
            </span>
          </h2>

          <p className="text-gray-300 text-lg md:text-xl leading-relaxed bg-gradient-to-br from-gray-900/60 to-gray-950/60 p-10 rounded-3xl backdrop-blur-lg border border-gray-800/50">
            Our mission is to empower freelancers to showcase their skills,
            connect with meaningful work, and collaborate transparently with
            clients through verified profiles, global job opportunities,
            role-based dashboards, and milestone-based payments.
          </p>
        </motion.div>
      </section>

      {/* ===== VISION SECTION ===== */}
      <section className="relative py-24 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-5xl mx-auto text-center"
        >
          <div className="inline-block mb-4 px-4 py-2 rounded-full bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 backdrop-blur-sm">
            <span className="text-green-400 text-sm font-semibold">VISION</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-black mb-6">
            A Global Ecosystem for{" "}
            <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Work Without Borders
            </span>
          </h2>

          <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
            We envision a world where freelancers thrive, clients find the right
            talent instantly, and collaboration happens effortlessly from
            anywhere — powered by automation, verified talent, intelligent
            matching, and seamless communication.
          </p>
        </motion.div>
      </section>

      {/* ===== PLATFORM PILLARS ===== */}
      <section className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-4xl md:text-5xl font-black mb-16"
          >
            The Core Pillars of{" "}
            <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
              GigScape
            </span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <ShieldCheck className="w-10 h-10" />,
                title: "Safe & Secure",
                text: "End-to-end protection through verified users, secure authentication, and safe payments.",
              },
              {
                icon: <Workflow className="w-10 h-10" />,
                title: "Transparent Workflow",
                text: "Every step of a project is tracked — from hiring to milestones to completion.",
              },
              {
                icon: <Users className="w-10 h-10" />,
                title: "Empowering Community",
                text: "A growing network of skilled freelancers and clients collaborating globally.",
              },
            ].map((x, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="p-8 bg-gradient-to-br from-gray-900/80 to-gray-950/80 border border-gray-800/50 rounded-3xl backdrop-blur-xl hover:border-gray-700/50"
              >
                <div className="text-green-400 mb-6">{x.icon}</div>
                <h3 className="text-2xl font-bold mb-4">{x.title}</h3>
                <p className="text-gray-400">{x.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="relative py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 p-16"
          >
            <h3 className="text-3xl md:text-5xl font-black text-white text-center mb-6">
              Join the Future of Work Today
            </h3>
            <p className="text-white/90 text-lg md:text-xl text-center max-w-2xl mx-auto mb-8">
              Start building your success story — whether you're a freelancer or
              a client seeking top talent.
            </p>

            <div className="flex justify-center">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-xl font-bold text-lg hover:scale-105 transition-transform shadow-2xl"
              >
                Get Started
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="relative bg-gray-950 py-12 border-t border-gray-800/50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h4 className="text-2xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2">
            GigScape
          </h4>
          <p className="text-gray-500 text-sm">Empowering the Future of Work</p>

          <div className="mt-8 text-gray-500 text-sm">
            © {new Date().getFullYear()} GigScape. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;
