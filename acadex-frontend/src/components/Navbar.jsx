import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LogOut,
  User,
  House,
  BookOpen,
  FolderGit2,
  Upload,
  ChevronDown,
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getProfile } from "../services/userService";

export default function Navbar() {
  const { isLoggedIn, logoutUser } = useAuth();

  const navigate = useNavigate();

  const [uploadOpen, setUploadOpen] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (isLoggedIn) {
      loadProfile();
    }
  }, [isLoggedIn]);

  const loadProfile = async () => {
    try {
      const res = await getProfile();

      if (res.success) {
        setProfile(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const navClass = ({ isActive }) =>
    `relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
      isActive
        ? "bg-blue-600 text-white shadow-md"
        : "text-slate-600 hover:bg-slate-100 hover:text-blue-600"
    }`;

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}

        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
            <BookOpen size={20} className="text-white" />
          </div>

          <div>
            <h1 className="font-bold text-xl text-slate-800 tracking-tight">
              Acadex
            </h1>

            <p className="text-[11px] text-slate-400 -mt-1">
              Learn • Share • Build
            </p>
          </div>
        </Link>

        {/* Navigation */}

        <div className="hidden md:flex items-center gap-2">
          <NavLink to="/" className={navClass}>
            <span className="flex items-center gap-2">
              <House size={17} />
              Home
            </span>
          </NavLink>

          <NavLink to="/notes" className={navClass}>
            <span className="flex items-center gap-2">
              <BookOpen size={17} />
              Notes
            </span>
          </NavLink>

          <NavLink to="/projects" className={navClass}>
            <span className="flex items-center gap-2">
              <FolderGit2 size={17} />
              Projects
            </span>
          </NavLink>

          {isLoggedIn && (
            <div className="relative">
              <button
                onClick={() => setUploadOpen(!uploadOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-blue-600 transition"
              >
                <Upload size={17} />
                Upload
                <ChevronDown size={16} />
              </button>

              {uploadOpen && (
                <div className="absolute top-12 left-0 w-48 rounded-2xl bg-white border border-slate-200 shadow-lg py-2">
                  <NavLink
                    to="/upload-note"
                    onClick={() => setUploadOpen(false)}
                    className="block px-4 py-3 hover:bg-slate-100 transition"
                  >
                    📄 Upload Note
                  </NavLink>

                  <NavLink
                    to="/upload-project"
                    onClick={() => setUploadOpen(false)}
                    className="block px-4 py-3 hover:bg-slate-100 transition"
                  >
                    💻 Upload Project
                  </NavLink>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right */}

        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <NavLink
                to="/profile"
                className="w-11 h-11 rounded-full overflow-hidden border-2 border-blue-600 shadow-md hover:scale-105 transition flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600"
              >
                {profile?.profileImage ? (
                  <img
                    src={`http://localhost:8080/api/v1/${profile.profileImage.replace(/\\/g, "/")}`}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white font-bold text-lg">
                    {profile?.name ? profile.name.charAt(0).toUpperCase() : "U"}
                  </span>
                )}
              </NavLink>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2 text-red-600 hover:bg-red-100 transition-all duration-300"
              >
                <LogOut size={17} />
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className="px-5 py-2 rounded-xl font-medium text-slate-600 hover:bg-slate-100 transition"
              >
                Login
              </NavLink>

              <NavLink
                to="/register"
                className="px-5 py-2 rounded-xl bg-blue-600 text-white font-medium shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-300"
              >
                Register
              </NavLink>
            </>
          )}
        </div>
      </div>
    </motion.header>
  );
}
