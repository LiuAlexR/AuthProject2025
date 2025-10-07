import { motion } from "framer-motion";
import "./Login.css";
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { RustServer } from "../../serverCallsEnum";
interface Inputs {
  username: string;
  password: string;
}
export default function Login() {
  const nav = useNavigate();
  const [inputs, setInputs] = useState<Inputs>({ username: "", password: "" });
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState<boolean>(false);
  const handleChange = (
    event: FormEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const target = event.target as HTMLInputElement; // Cast event.target to HTMLInputElement
    const name = target.name;
    const value = target.value;

    setInputs((values) => ({ ...values, [name]: value }));
  };
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setMessage(null);
    setIsError(false);
    setLoading(true);
    const dataToSend = {
      ...inputs,
    };

    try {
      const CONNECTION = RustServer.PORT + RustServer.LOGIN;

      const response = await fetch(CONNECTION, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });
      if (!response.ok) {
        const errorData = await response.json(); // Parse error response body
        throw new Error(
          errorData.message || "Failed to submit form. Please try again.",
        );
      }
      const result = await response.json(); // Parse successful response body

      // Set success message and clear the form
      setMessage("Your message has been sent successfully!");
      setIsError(false);
      setInputs({ username: "", password: "" }); // Clear form fields

      nav("/login-mfa", { state: { jwt: result } });
    } catch (error: any) {
      console.error("Error submitting form:", error);
      // Set error message
      setMessage(
        error.message ||
          "An unexpected error occurred. Please try again later.",
      );
      setIsError(true);
    } finally {
      setLoading(false); // Set loading state to false regardless of success or failure
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      {/* Main Content */}
      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Welcome Back
          </h1>
          <p className="text-white/70 text-lg">Sign in to your account</p>
        </motion.div>

        {/* Login Form */}
        <motion.div
          className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <label className="block text-white/80 text-sm font-medium mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={inputs.username}
                onChange={handleChange}
                placeholder="Enter your username"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                required
              />
            </motion.div>

            {/* Password Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <label className="block text-white/80 text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={inputs.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                required
              />
            </motion.div>

            {/* Error/Success Message */}
            {message && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 rounded-xl text-sm ${
                  isError
                    ? "bg-red-500/20 text-red-200 border border-red-500/30"
                    : "bg-green-500/20 text-green-200 border border-green-500/30"
                }`}
              >
                {message}
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <motion.div
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </motion.button>
          </form>

          {/* Additional Links */}
          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <a
              href="#"
              className="text-white/60 hover:text-white/80 text-sm transition-colors duration-300"
            >
              Forgot your password?
            </a>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
