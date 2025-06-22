import React from "react";
import {
  LineChart,
  Zap,
  ArrowRight,
  Mail,
  Cpu,
  Database,
  BarChart2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.8 } },
};

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 flex flex-col overflow-auto">
      {/* Navigation */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="py-4 px-8 flex justify-between items-center border-b border-indigo-400/20"
      >
        <div className="text-2xl font-bold text-indigo-400 tracking-tight">
          XLYZER
        </div>
        <nav className="hidden md:flex space-x-8">
          <a
            href="#features"
            className="text-indigo-200 hover:text-white text-sm font-medium transition-colors"
          >
            Features
          </a>
        </nav>
        <Link
          to="/signin"
          className="text-indigo-400 hover:text-white text-sm font-medium flex items-center transition-colors"
        >
          Sign In <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </motion.header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-8 py-12 md:py-24 max-w-4xl mx-auto text-center">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-6 w-full"
        >
          <motion.div
            variants={item}
            className="inline-flex items-center justify-center p-3 bg-indigo-400/10 rounded-lg border border-indigo-400/30 mx-auto"
          >
            <LineChart className="text-indigo-400" size={24} strokeWidth={2} />
          </motion.div>

          <motion.h1
            variants={item}
            className="text-4xl md:text-5xl font-bold text-white leading-tight"
          >
            <span className="text-indigo-400">Data Clarity</span> Without
            Complexity
          </motion.h1>

          <motion.p
            variants={item}
            className="text-lg text-indigo-200 leading-relaxed max-w-2xl mx-auto"
          >
            Powerful analytics platform designed for professionals who demand
            precision without the overhead.
          </motion.p>

          <motion.div
            variants={item}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/signin"
              className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium flex items-center justify-center transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/20"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
              <Zap className="ml-2 h-4 w-4" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-16 px-8 bg-indigo-900/10 border-t border-b border-indigo-400/10"
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-2xl font-bold text-white text-center mb-12"
          >
            Key Features
          </motion.h2>
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: <Cpu className="h-6 w-6 text-indigo-400" />,
                title: "Real-time Analytics",
                description:
                  "Process and visualize data as it comes in with sub-second latency.",
              },
              {
                icon: <Database className="h-6 w-6 text-indigo-400" />,
                title: "Unified Data Platform",
                description:
                  "Connect all your data sources in one place for complete visibility.",
              },
              {
                icon: <BarChart2 className="h-6 w-6 text-indigo-400" />,
                title: "Advanced Visualizations",
                description:
                  "Customizable dashboards with professional-grade charting tools.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={item}
                whileHover={{ y: -5 }}
                className="bg-indigo-900/20 rounded-xl p-6 border border-indigo-400/10 hover:border-indigo-400/30 transition-all duration-200"
              >
                <div className="inline-flex items-center justify-center p-3 bg-indigo-400/10 rounded-lg mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-indigo-200 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="py-12 px-8 bg-indigo-900/10 border-t border-indigo-400/10"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <div className="text-2xl font-bold text-indigo-400 mb-2">
                XLYZER
              </div>
              <p className="text-indigo-300 max-w-md">
                Advanced analytics for modern businesses. Get insights that
                matter.
              </p>
            </div>

            <motion.a
              href="mailto:contact@xlyzer.com"
              className="px-6 py-3 bg-transparent border border-indigo-400/30 text-indigo-200 hover:text-white rounded-lg font-medium flex items-center justify-center transition-all duration-200 hover:bg-indigo-400/10"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Contact Us
              <Mail className="ml-2 h-4 w-4" />
            </motion.a>
          </div>

          <div className="mt-12 pt-6 border-t border-indigo-400/10 text-center text-indigo-400/50 text-sm">
            <p>© {new Date().getFullYear()} XLYZER. All rights reserved.</p>
          </div>
        </div>
      </motion.footer>

      {/* Global Styles */}
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap");

        html,
        body,
        #__next {
          margin: 0;
          padding: 0;
          height: 100%;
        }
        body {
          font-family: "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont,
            "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          font-weight: 400;
          line-height: 1.6;
        }
        h1,
        h2,
        h3,
        h4 {
          font-weight: 700;
          letter-spacing: -0.025em;
        }
      `}</style>
    </div>
  );
}
