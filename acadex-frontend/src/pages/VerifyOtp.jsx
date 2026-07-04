import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowRight } from "lucide-react";

import { verifyOtp } from "../services/authService";
import { useAuth } from "../context/AuthContext";

export default function VerifyOtp() {
  const navigate = useNavigate();

  const location = useLocation();

  const { loginUser } = useAuth();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    setError("");

    try {
      const res = await verifyOtp(email, otp);

      if (res.success) {
        loginUser(res.data);

        navigate("/");
      } else {
        setError(res.message);
      }
    } catch (err) {
      console.error(err);

      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    navigate("/register");

    return null;
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-xl"
      >
        <div className="bg-gradient-to-r from-blue-700 to-indigo-700 px-8 py-10">
          <h1 className="text-4xl font-bold text-white">Verify OTP</h1>

          <p className="text-blue-100 mt-2">
            Enter the verification code sent to
          </p>

          <p className="text-white font-semibold mt-2 break-all">{email}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="rounded-2xl bg-red-50 border border-red-200 text-red-600 px-4 py-3">
              {error}
            </div>
          )}

          <div>
            <label className="font-semibold text-slate-700">
              Verification Code
            </label>

            <div className="mt-2 relative">
              <ShieldCheck
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none tracking-[0.5em] text-center text-lg"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl py-4 font-semibold flex items-center justify-center gap-3 transition disabled:opacity-70"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                Verify OTP
                <ArrowRight size={20} />
              </>
            )}
          </button>

          <div className="text-center">
            <p className="text-slate-600">
              Wrong email?{" "}
              <Link
                to="/register"
                className="font-semibold text-blue-600 hover:text-blue-700"
              >
                Register Again
              </Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
