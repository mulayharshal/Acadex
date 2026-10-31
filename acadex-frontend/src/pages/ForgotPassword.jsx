import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, ArrowRight, ArrowLeft, KeyRound } from "lucide-react";
import { forgotPassword } from "../services/authService";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState(location.state?.email || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await forgotPassword(trimmedEmail);

      if (res.success) {
        navigate("/reset-password", {
          state: {
            email: trimmedEmail,
            initialMessage: res.message || "OTP has been sent to your email.",
          },
        });
      } else {
        setError(res.message || "Failed to send reset code. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Something went wrong. Please check your network and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-xl"
      >
        <div className="bg-gradient-to-r from-blue-700 to-indigo-700 px-8 py-10">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-white mb-4">
            <KeyRound size={26} />
          </div>
          <h1 className="text-3xl font-bold text-white">Forgot Password?</h1>
          <p className="text-blue-100 mt-2 text-sm leading-relaxed">
            Enter the email address associated with your account and we'll send you an OTP to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="rounded-2xl bg-red-50 border border-red-200 text-red-600 px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="font-semibold text-slate-700">Email Address</label>
            <div className="mt-2 relative">
              <Mail
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your registered email"
                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none transition"
                required
                autoFocus
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl py-4 font-semibold flex items-center justify-center gap-3 transition disabled:opacity-70 shadow-md hover:shadow-lg"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                Sending OTP...
              </>
            ) : (
              <>
                Send Reset Code
                <ArrowRight size={20} />
              </>
            )}
          </button>

          <div className="space-y-3 pt-2 text-center text-sm text-slate-600">
            <div>
              Already have an OTP?{" "}
              <Link
                to="/reset-password"
                className="font-semibold text-blue-600 hover:text-blue-700"
              >
                Reset Password
              </Link>
            </div>

            <div>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 font-medium text-slate-500 hover:text-slate-800 transition"
              >
                <ArrowLeft size={16} />
                Back to Login
              </Link>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
