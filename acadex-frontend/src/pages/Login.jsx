import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight } from "lucide-react";

import { login } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { requestNotificationPermission } from "../firebase/messaging";
import { registerFcmToken } from "../services/firebaseNotificationService";

export default function Login() {
  const navigate = useNavigate();

  const { loginUser } = useAuth();

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    setError("");

    try {
      const res = await login(form.email, form.password);

      if (res.success) {
        loginUser(res.data);

        try {
          const token = await requestNotificationPermission();

          if (token) {
            await registerFcmToken(token);

            console.log("FCM Token Registered Successfully");
          }
        } catch (err) {
          console.error(err);
        }

        navigate("/");
      } else {
        if (res.message === "Email is not verified. OTP resent to your email") {
          navigate("/verify-otp", {
            state: {
              email: form.email,
            },
          });

          return;
        }

        setError(res.message);
      }
    } catch (err) {
      console.error(err);

      setError("Something went wrong.");
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
          <h1 className="text-4xl font-bold text-white">Welcome Back</h1>

          <p className="text-blue-100 mt-2">Login to continue to Acadex.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="rounded-2xl bg-red-50 border border-red-200 text-red-600 px-4 py-3">
              {error}
            </div>
          )}

          <div>
            <label className="font-semibold text-slate-700">Email</label>

            <div className="mt-2 relative">
              <Mail
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700">Password</label>

            <div className="mt-2 relative">
              <Lock
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl py-4 font-semibold flex items-center justify-center gap-3 transition disabled:opacity-70"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                Logging In...
              </>
            ) : (
              <>
                Login
                <ArrowRight size={20} />
              </>
            )}
          </button>

          <div className="text-center">
            <p className="text-slate-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-blue-600 hover:text-blue-700"
              >
                Register
              </Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
