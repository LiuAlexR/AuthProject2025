import { useRef, useState, useEffect, type ChangeEvent } from "react";
import React from "react";
import { useLocation } from "react-router";
import { motion } from "framer-motion";

interface MFARequest {
  jwt: string;
  password: number;
}


export default function LoginMFA() {
  const jwt: string = useLocation().state.jwt;
  const NUMBERS = RegExp("^[0-9]+$");
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState<boolean>(false);
  const digitRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Autofocus on first input
  useEffect(() => {
    if (digitRefs.current[0]) {
      digitRefs.current[0].focus();
    }
  }, []);

  const makeRequest = async () => {
    setLoading(true);
    setMessage(null);
    setIsError(false);

    const req: MFARequest = {
      jwt: jwt,
      password: Number.parseInt(digits.join("")),
    };

    try {
      const response = await fetch("http://localhost:8081/verify_login_2fa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Verification failed. Please try again.");
      }

      const data = await response.json();
      console.log(data);
      setMessage("Verification successful!");
      setIsError(false);
    } catch (error: any) {
      console.log(error);
      setMessage(error.message || "An error occurred. Please try again.");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  const changeHandler = (e: ChangeEvent<HTMLInputElement>, idx: number) => {
    const input = e.target.value;
    
    // Allow empty string for deletion
    if (input !== "" && !NUMBERS.test(input)) {
      e.target.value = "";
      return;
    }
    
    const newDigits = [...digits];
    newDigits[idx] = input;
    setDigits(newDigits);

    // Auto-submit when last digit is entered
    if (idx === 5 && input !== "") {
      setTimeout(() => {
        makeRequest();
      }, 300); // Small delay for better UX
    } else if (idx < 5 && input !== "") {
      const next = digitRefs.current[idx + 1];
      if (next) {
        next.focus();
      }
    }
  };

  const backspaceHandler = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      const current = digitRefs.current[index];
      if (current && current.value === "" && index !== 0) {
        const prev = digitRefs.current[index - 1];
        if (prev) {
          prev.focus();
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Magical Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.3, 0.1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.4, 0.1],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      {/* Main Content */}
      <motion.div
        className="relative z-10 w-full max-w-2xl"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Two-Factor Authentication
          </h1>
          <p className="text-white/70 text-lg">
            Enter the 6-digit code from your authenticator app
          </p>
        </motion.div>

        {/* MFA Input Container */}
        <motion.div
          className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="flex justify-center gap-4 mb-8">
            {digits.map((digit, idx) => (
              <motion.input
                key={idx}
                ref={(el) => { digitRefs.current[idx] = el; }}
                type="text"
                maxLength={1}
                value={digit}
                className="w-16 h-16 md:w-20 md:h-20 text-center text-2xl md:text-3xl font-bold bg-white/20 border-2 border-white/30 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-4 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 backdrop-blur-sm"
                onChange={(e) => changeHandler(e, idx)}
                onKeyDown={(e) => backspaceHandler(e, idx)}
                placeholder="•"
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  scale: digit ? 1.1 : 1, 
                  y: 0,
                  boxShadow: digit 
                    ? "0 0 30px rgba(59, 130, 246, 0.5), 0 0 60px rgba(147, 51, 234, 0.3)"
                    : "0 0 0px rgba(59, 130, 246, 0)"
                }}
                transition={{ 
                  duration: 0.5, 
                  delay: idx * 0.1,
                  type: "spring",
                  stiffness: 300,
                  damping: 20
                }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 0 20px rgba(59, 130, 246, 0.4)"
                }}
                whileFocus={{ 
                  scale: 1.1,
                  boxShadow: "0 0 30px rgba(59, 130, 246, 0.6)"
                }}
              />
            ))}
          </div>

          {/* Status Message */}
          {message && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-xl text-center text-sm font-medium ${
                isError
                  ? "bg-red-500/20 text-red-200 border border-red-500/30"
                  : "bg-green-500/20 text-green-200 border border-green-500/30"
              }`}
            >
              {message}
            </motion.div>
          )}

          {/* Loading State */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center gap-3 mt-6"
            >
              <motion.div
                className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <span className="text-white/80">Verifying code...</span>
            </motion.div>
          )}

        </motion.div>

        {/* Magical Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
