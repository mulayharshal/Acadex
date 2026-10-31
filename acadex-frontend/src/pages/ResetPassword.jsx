import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { resetPassword, forgotPassword } from "../services/authService";

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState(location.state?.email || "");
  const [isEditingEmail, setIsEditingEmail] = useState(!location.state?.email);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState(
    location.state?.initialMessage || ""
  );
  const [resendCooldown, setResendCooldown] = useState(60);
  const [isSuccess, setIsSuccess] = useState(false);

  // Cooldown timer for resend OTP
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Auto redirect on success after 3 seconds
  useEffect(() => {
    let timer;
    if (isSuccess) {
      timer = setTimeout(() => {
        navigate("/login");
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [isSuccess, navigate]);

  const handleResendOtp = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError("Please enter your email address to receive an OTP.");
      return;
    }

    setResending(true);
    setError("");
    setInfoMessage("");

    try {
      const res = await forgotPassword(trimmedEmail);
      if (res.success) {
        setInfoMessage("A new verification code has been sent to your email.");
        setResendCooldown(60);
      } else {
        setError(res.message || "Could not resend OTP. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Failed to resend OTP. Please try again."
      );
    } finally {
      setResending(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedEmail = email.trim();
    const trimmedOtp = otp.trim();

    if (!trimmedEmail) {
      setError("Email address is required.");
      return;
    }

    if (!trimmedOtp || trimmedOtp.length !== 6) {
      setError("Please enter a valid 6-digit verification code.");
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setError("New password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match. Please re-check.");
      return;
    }

    setLoading(true);
    setError("");
    setInfoMessage("");

    try {
      const res = await resetPassword(trimmedEmail, trimmedOtp, newPassword);

      if (res.success) {
        setIsSuccess(true);
      } else {
        setError(res.message || "Failed to reset password. Please check your OTP.");
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Something went wrong while resetting your password."
      );
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-xl p-8 text-center"
        >
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm">
            <CheckCircle2 size={36} />
          </div>

          <h2 className="text-2xl font-bold text-slate-800">Password Reset Successful!</h2>
          <p className="text-slate-600 mt-2 text-sm leading-relaxed">
            Your password has been changed successfully. You can now log in with your new password.
          </p>

          <p className="text-xs text-slate-400 mt-4">
            Redirecting to login in 3 seconds...
          </p>

          <button
            onClick={() => navigate("/login")}
            className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl py-3.5 font-semibold transition shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            Go to Login Now
            <ArrowRight size={18} />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-xl"
      >
        <div className="bg-gradient-to-r from-blue-700 to-indigo-700 px-8 py-10">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-white mb-4">
            <ShieldCheck size={26} />
          </div>
          <h1 className="text-3xl font-bold text-white">Reset Password</h1>
          <p className="text-blue-100 mt-2 text-sm leading-relaxed">
            Enter the 6-digit code sent to your email along with your new password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {infoMessage && (
            <div className="rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 text-sm flex items-start justify-between">
              <span>{infoMessage}</span>
              <button
                type="button"
                onClick={() => setInfoMessage("")}
                className="text-emerald-500 hover:text-emerald-800 text-xs ml-2 font-bold"
              >
                ✕
              </button>
            </div>
          )}

          {error && (
            <div className="rounded-2xl bg-red-50 border border-red-200 text-red-600 px-4 py-3 text-sm">
              {error}
            </div>
          )}

          {/* Email section */}
          <div>
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-700 text-sm">Email Address</label>
              {email && !isEditingEmail && (
                <button
                  type="button"
                  onClick={() => setIsEditingEmail(true)}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  Change Email
                </button>
              )}
            </div>

            {isEditingEmail ? (
              <div className="mt-1 relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your registered email"
                  className="w-full pl-11 pr-4 py-2.5 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition"
                  required
                />
              </div>
            ) : (
              <div className="mt-1 px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium break-all flex items-center gap-2">
                <Mail size={16} className="text-slate-400 flex-shrink-0" />
                <span className="truncate">{email}</span>
              </div>
            )}
          </div>

          {/* OTP field */}
          <div>
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-700 text-sm">
                Verification Code (OTP)
              </label>
              <button
                type="button"
                disabled={resending || resendCooldown > 0}
                onClick={handleResendOtp}
                className="text-xs text-blue-600 hover:text-blue-700 disabled:text-slate-400 font-medium inline-flex items-center gap-1"
              >
                {resending ? (
                  <>
                    <RefreshCw size={12} className="animate-spin" />
                    Sending...
                  </>
                ) : resendCooldown > 0 ? (
                  `Resend in ${resendCooldown}s`
                ) : (
                  "Resend Code"
                )}
              </button>
            </div>

            <div className="mt-1 relative">
              <ShieldCheck
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="6-digit code"
                className="w-full pl-11 pr-4 py-2.5 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none tracking-[0.3em] font-mono text-center text-lg"
                required
              />
            </div>
          </div>

          {/* New Password field */}
          <div>
            <label className="font-semibold text-slate-700 text-sm">New Password</label>
            <div className="mt-1 relative">
              <Lock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full pl-11 pr-11 py-2.5 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password field */}
          <div>
            <label className="font-semibold text-slate-700 text-sm">
              Confirm New Password
            </label>
            <div className="mt-1 relative">
              <Lock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full pl-11 pr-11 py-2.5 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl py-3.5 font-semibold flex items-center justify-center gap-3 transition disabled:opacity-70 shadow-md hover:shadow-lg"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                Resetting Password...
              </>
            ) : (
              <>
                Reset Password
                <ArrowRight size={20} />
              </>
            )}
          </button>

          <div className="pt-2 text-center text-sm text-slate-600 space-y-2">
            <div>
              <Link
                to="/forgot-password"
                className="font-medium text-blue-600 hover:text-blue-700 text-xs"
              >
                Need to request another reset code?
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

