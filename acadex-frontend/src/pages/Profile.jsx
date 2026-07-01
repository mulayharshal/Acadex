import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../services/userService";
import { motion } from "framer-motion";
import { User, Mail, Phone, Pencil, Save, X, BadgeCheck } from "lucide-react";

export default function Profile() {
  const [profile, setProfile] = useState({
    name: "",
    username: "",
    email: "",
    mobile: "",
    bio: "",
  });

  const [form, setForm] = useState({
    name: "",
    username: "",
    mobile: "",
    bio: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await getProfile();

      if (res.success) {
        setProfile(res.data);
        setForm({
          name: res.data.name || "",
          username: res.data.username || "",
          mobile: res.data.mobile || "",
          bio: res.data.bio || "",
        });
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");

    try {
      const res = await updateProfile(form);

      if (res.success) {
        setMessage("Profile Updated Successfully");

        setEditing(false);

        loadProfile();
      } else {
        setMessage(res.message);
      }
    } catch (err) {
      setMessage("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="h-14 w-14 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-slate-50 py-10 px-5"
    >
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="h-40 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>

          <div className="px-10 pb-10">
            <div className="-mt-16 flex justify-between items-end">
              <div className="flex gap-5 items-end">
                <div className="h-32 w-32 rounded-full border-[6px] border-white bg-white shadow-lg flex items-center justify-center">
                  <User size={60} className="text-blue-600" />
                </div>

                <div className="pb-3">
                  <h1 className="text-3xl font-bold text-slate-800">
                    {profile.name}
                  </h1>

                  <p className="text-slate-500 mt-1">@{profile.username}</p>
                </div>
              </div>

              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-2xl hover:bg-blue-700 transition"
                >
                  <Pencil size={18} />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 bg-green-600 text-white px-5 py-3 rounded-2xl hover:bg-green-700 transition"
                  >
                    <Save size={18} />

                    {saving ? "Saving..." : "Save"}
                  </button>

                  <button
                    onClick={() => {
                      setEditing(false);

                      setForm(profile);
                    }}
                    className="flex items-center gap-2 bg-slate-200 px-5 py-3 rounded-2xl"
                  >
                    <X size={18} />
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {message && (
              <div className="mt-6 rounded-2xl bg-blue-50 text-blue-700 px-5 py-4 flex items-center gap-3">
                <BadgeCheck size={20} />

                {message}
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6 mt-10">
              <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200">
                <label className="text-sm text-slate-500">Full Name</label>

                {editing ? (
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <div className="mt-2 font-semibold text-slate-800">
                    {profile.name || "-"}
                  </div>
                )}
              </div>

              <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200">
                <label className="text-sm text-slate-500">Username</label>

                {editing ? (
                  <input
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <div className="mt-2 font-semibold text-slate-800">
                    @{profile.username || "-"}
                  </div>
                )}
              </div>

              <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200">
                <label className="text-sm text-slate-500 flex items-center gap-2">
                  <Mail size={16} />
                  Email
                </label>

                <div className="mt-2 font-semibold text-slate-800">
                  {profile.email}
                </div>
              </div>

              <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200">
                <label className="text-sm text-slate-500 flex items-center gap-2">
                  <Phone size={16} />
                  Mobile
                </label>

                {editing ? (
                  <input
                    type="text"
                    name="mobile"
                    value={form.mobile}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <div className="mt-2 font-semibold text-slate-800">
                    {profile.mobile || "-"}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 bg-slate-50 rounded-3xl border border-slate-200 p-6">
              <label className="text-sm text-slate-500">Bio</label>

              {editing ? (
                <textarea
                  rows={5}
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  className="mt-3 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none resize-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="mt-3 leading-7 text-slate-700">
                  {profile.bio || "No bio added yet."}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
