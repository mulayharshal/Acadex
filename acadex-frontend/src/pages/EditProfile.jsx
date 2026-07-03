import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Camera, Save, X } from "lucide-react";

import { getProfile, updateProfile } from "../services/userService";

export default function EditProfile() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [preview, setPreview] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    mobile: "",
    bio: "",
    profileImage: null,
    existingImage: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await getProfile();

      if (res.success) {
        setFormData({
          name: res.data.name || "",
          username: res.data.username || "",
          mobile: res.data.mobile || "",
          bio: res.data.bio || "",
          profileImage: null,
          existingImage: res.data.profileImage || "",
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Image size must be less than 2 MB.");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      profileImage: file,
    }));

    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    setSaving(true);

    try {
      const data = new FormData();

      data.append("name", formData.name);
      data.append("username", formData.username);
      data.append("mobile", formData.mobile);
      data.append("bio", formData.bio);

      if (formData.profileImage) {
        data.append("profileImage", formData.profileImage);
      }

      const res = await updateProfile(data);

      if (res.success) {
        alert("Profile updated successfully.");

        navigate("/profile");
      } else {
        alert(res.message);
      }
    } catch (err) {
      console.error(err);

      alert("Unable to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="w-14 h-14 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-sm border overflow-hidden"
        >
          <div className="bg-gradient-to-r from-blue-700 to-indigo-700 h-36" />

          <div className="px-10 pb-10 -mt-16">
            <div className="flex flex-col items-center">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : formData.existingImage ? (
                <img
                  src={`http://localhost:8080/api/v1/${formData.existingImage.replace(/\\/g, "/")}`}
                  alt="Profile"
                  className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-36 h-36 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 border-4 border-white shadow-lg flex items-center justify-center">
                  <span className="text-6xl font-bold text-white">
                    {formData.name
                      ? formData.name.charAt(0).toUpperCase()
                      : "U"}
                  </span>
                </div>
              )}

              <label className="mt-5 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl flex items-center gap-2 transition">
                <Camera size={18} />
                Change Photo
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImageChange}
                />
              </label>
            </div>

            <div className="mt-10 space-y-6">
              <div>
                <label className="block mb-2 font-semibold text-slate-700">
                  Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-300 px-5 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block mb-2 font-semibold text-slate-700">
                  Username
                </label>

                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-300 px-5 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block mb-2 font-semibold text-slate-700">
                  Mobile
                </label>

                <input
                  type="text"
                  name="mobile"
                  maxLength={10}
                  value={formData.mobile}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-300 px-5 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block mb-2 font-semibold text-slate-700">
                  Bio
                </label>

                <textarea
                  rows={5}
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-300 px-5 py-3 resize-none focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Action Buttons */}

            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={saving}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-2xl py-4 font-semibold flex items-center justify-center gap-3 transition"
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Save Changes
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="flex-1 border border-slate-300 hover:bg-slate-100 rounded-2xl py-4 font-semibold flex items-center justify-center gap-3 transition"
              >
                <X size={20} />
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
