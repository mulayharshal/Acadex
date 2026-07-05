import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import {
  User,
  Mail,
  BookOpen,
  FolderGit2,
  Pencil,
  LogOut,
  Bookmark,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

import { getProfile } from "../services/userService";
import { getMyNotes } from "../services/noteService";
import { getMyProjects } from "../services/projectService";

export default function Profile() {
  const navigate = useNavigate();

  const { logoutUser } = useAuth();

  const [profile, setProfile] = useState(null);

  const [notesCount, setNotesCount] = useState(0);

  const [projectsCount, setProjectsCount] = useState(0);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const profileRes = await getProfile();
      const notesRes = await getMyNotes();
      const projectsRes = await getMyProjects();

      if (profileRes.success) {
        setProfile(profileRes.data);
      }

      if (notesRes.success) {
        setNotesCount(notesRes.data.length);
      }

      if (projectsRes.success) {
        setProjectsCount(projectsRes.data.length);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logoutUser();

    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="w-14 h-14 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-5">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-sm border overflow-hidden"
        >
          <div className="bg-gradient-to-r from-blue-700 to-indigo-700 h-40" />

          <div className="px-10 pb-10 -mt-16">
            {/* Avatar */}

            {profile?.profileImage ? (
              <img
                src={profile.profileImage.replace(/\\/g, "/")}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center border-4 border-white shadow-lg">
                <span className="text-5xl font-bold text-white">
                  {profile?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            )}

            {/* Profile Information */}
            {/* Name & Email */}

            <div className="mt-6">
              <h1 className="text-4xl font-bold text-slate-800">
                {profile?.name}
              </h1>

              <div className="flex items-center gap-2 mt-3 text-slate-500">
                <Mail size={18} />

                <span>{profile?.email}</span>
              </div>
            </div>

            <div className="mt-8 bg-slate-50 rounded-3xl border p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-5">
                Personal Information
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-slate-500">Username</p>

                  <p className="font-semibold text-slate-800 mt-1">
                    {profile?.username || "Not Added"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">Mobile</p>

                  <p className="font-semibold text-slate-800 mt-1">
                    {profile?.mobile || "Not Added"}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-sm text-slate-500">Bio</p>

                <p className="text-slate-700 mt-2 leading-7">
                  {profile?.bio || "No bio added yet."}
                </p>
              </div>
            </div>

            {/* Statistics */}

            <div className="grid md:grid-cols-2 gap-6 mt-10">
              <div className="rounded-3xl bg-blue-50 border border-blue-100 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-500">Notes Uploaded</p>

                    <h2 className="text-4xl font-bold text-blue-700 mt-3">
                      {notesCount}
                    </h2>
                  </div>

                  <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center">
                    <BookOpen size={30} className="text-white" />
                  </div>
                </div>
              </div>

              <div className="rounded-3xl bg-purple-50 border border-purple-100 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-500">Projects Uploaded</p>

                    <h2 className="text-4xl font-bold text-purple-700 mt-3">
                      {projectsCount}
                    </h2>
                  </div>

                  <div className="w-16 h-16 rounded-2xl bg-purple-600 flex items-center justify-center">
                    <FolderGit2 size={30} className="text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}

            <div className="mt-12">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">
                Quick Actions
              </h2>

              <div className="grid md:grid-cols-2 gap-5">
                <motion.div
                  whileHover={{ y: -5 }}
                  className="rounded-3xl border bg-white p-6 cursor-pointer shadow-sm hover:shadow-lg transition"
                  onClick={() => navigate("/my-notes")}
                >
                  <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center mb-5">
                    <BookOpen size={28} className="text-blue-600" />
                  </div>

                  <h3 className="text-xl font-bold text-slate-800">My Notes</h3>

                  <p className="text-slate-500 mt-2">
                    View, edit and manage all your uploaded notes.
                  </p>
                </motion.div>

                <motion.div
                  whileHover={{ y: -5 }}
                  className="rounded-3xl border bg-white p-6 cursor-pointer shadow-sm hover:shadow-lg transition"
                  onClick={() => navigate("/my-projects")}
                >
                  <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center mb-5">
                    <FolderGit2 size={28} className="text-purple-600" />
                  </div>

                  <h3 className="text-xl font-bold text-slate-800">
                    My Projects
                  </h3>

                  <p className="text-slate-500 mt-2">
                    Manage all your uploaded projects.
                  </p>
                </motion.div>

                <motion.div
                  whileHover={{ y: -5 }}
                  className="rounded-3xl border bg-white p-6 cursor-pointer shadow-sm hover:shadow-lg transition"
                  onClick={() => navigate("/saved-notes")}
                >
                  <div className="w-14 h-14 rounded-2xl bg-yellow-100 flex items-center justify-center mb-5">
                    <Bookmark size={28} className="text-yellow-600" />
                  </div>

                  <h3 className="text-xl font-bold text-slate-800">
                    Saved Notes
                  </h3>

                  <p className="text-slate-500 mt-2">
                    View all your bookmarked notes.
                  </p>
                </motion.div>

                <motion.div
                  whileHover={{ y: -5 }}
                  className="rounded-3xl border bg-white p-6 cursor-pointer shadow-sm hover:shadow-lg transition"
                  onClick={() => navigate("/saved-projects")}
                >
                  <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center mb-5">
                    <Bookmark size={28} className="text-purple-600" />
                  </div>

                  <h3 className="text-xl font-bold text-slate-800">
                    Saved Projects
                  </h3>

                  <p className="text-slate-500 mt-2">
                    View all your bookmarked projects.
                  </p>
                </motion.div>

                <motion.div
                  whileHover={{ y: -5 }}
                  className="rounded-3xl border bg-white p-6 cursor-pointer shadow-sm hover:shadow-lg transition"
                  onClick={() => navigate("/edit-profile")}
                >
                  <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center mb-5">
                    <Pencil size={28} className="text-green-600" />
                  </div>

                  <h3 className="text-xl font-bold text-slate-800">
                    Edit Profile
                  </h3>

                  <p className="text-slate-500 mt-2">
                    Update your personal information.
                  </p>
                </motion.div>

                <motion.div
                  whileHover={{ y: -5 }}
                  className="rounded-3xl border bg-white p-6 cursor-pointer shadow-sm hover:shadow-lg transition"
                  onClick={handleLogout}
                >
                  <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center mb-5">
                    <LogOut size={28} className="text-red-600" />
                  </div>

                  <h3 className="text-xl font-bold text-slate-800">Logout</h3>

                  <p className="text-slate-500 mt-2">
                    Sign out of your Acadex account.
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
