import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Zap, ArrowRight, Mail, Lock } from "lucide-react";

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

const Signin = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Load user from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await axios.post("http://localhost:5001/api/auth/signin", {
        email,
        password,
      });

      if (result.data.msg === "Success") {
        localStorage.setItem("user", JSON.stringify(result.data.user));
        setUser(result.data.user);
        navigate("/dashboard");
      } else {
        setError("Please check your credentials and try again.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

 const handleLogout = () => {
  localStorage.removeItem("user");
  setUser(null); // Update state
  navigate("/signin");
};

  useEffect(() => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    try {
      setUser(JSON.parse(storedUser));
    } catch (e) {
      console.error("Failed to parse user from localStorage", e);
    }
  }
}, []);

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 flex flex-col justify-center items-center p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-indigo-900/20 border border-indigo-400/20 rounded-xl p-8 backdrop-blur-sm"
      >
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-6"
        >
          {/* Logo/Header */}
          <motion.div variants={item} className="text-center">
            <div className="inline-flex items-center justify-center p-3 bg-indigo-400/10 rounded-lg border border-indigo-400/30 mb-4">
              <Zap className="text-indigo-400" size={24} strokeWidth={2} />
            </div>
            <h2 className="text-2xl font-bold text-white">
              {user ? (
                <>
                  Welcome, <span className="text-indigo">{user.name}</span>
                </>
              ) : (
                <>
                  Sign in to <span className="text-indigo-400">XLYZER</span>
                </>
              )}
            </h2>
            <p className="text-indigo-200 mt-2 text-sm">
              {user
                ? "You’re already logged in. Go to your dashboard or sign out."
                : "Enter your credentials to access your dashboard"}
            </p>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-red-900/30 border border-red-400/30 text-red-200 text-sm rounded-lg"
            >
              {error}
            </motion.div>
          )}

          {/* Conditional Content */}
          {user ? (
            <motion.div
              variants={item}
              className="text-center flex items-center p-2 gap-7 justify-center"
            >
              <button
                onClick={handleLogout}
                className="mt-4 inline-block px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition"
              >
                Sign Out
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="mt-4 inline-block px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition"
              >
                Dashboard
              </button>
            </motion.div>
          ) : (
            <>
              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <motion.div variants={item}>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-indigo-200 mb-2"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-indigo-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={email}
                      autoComplete="email"
                      className="block w-full pl-10 bg-indigo-900/30 border border-indigo-400/30 rounded-lg py-2.5 px-4 text-white placeholder-indigo-400/70 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                    />
                  </div>
                </motion.div>

                <motion.div variants={item}>
                  <div className="flex items-center justify-between mb-2">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-indigo-200"
                    >
                      Password
                    </label>
                    <Link
                      to="/forgot"
                      className="text-xs text-indigo-400 hover:text-indigo-300"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-indigo-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={password}
                      autoComplete="current-password"
                      className="block w-full pl-10 bg-indigo-900/30 border border-indigo-400/30 rounded-lg py-2.5 px-4 text-white placeholder-indigo-400/70 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>
                </motion.div>

                <motion.div variants={item}>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full flex justify-center items-center py-2.5 px-4 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white font-medium transition-all duration-200 ${
                      isLoading ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                    whileHover={!isLoading ? { scale: 1.02 } : {}}
                    whileTap={!isLoading ? { scale: 0.98 } : {}}
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Signing in...
                      </span>
                    ) : (
                      <>
                        Sign In <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </button>
                </motion.div>
              </form>

              <motion.div
                variants={item}
                className="text-center text-sm text-indigo-300"
              >
                Don’t have an account?{" "}
                <Link
                  to="/signup"
                  className="font-medium text-indigo-400 hover:text-indigo-300"
                >
                  Sign up
                </Link>
              </motion.div>
            </>
          )}
        </motion.div>
      </motion.div>

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
      `}</style>
    </div>
  );
};

export default Signin;
