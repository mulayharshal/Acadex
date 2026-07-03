import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Save,
  X,
  FolderGit2,
  AlignLeft,
  Tag,
  Link as LinkIcon,
} from "lucide-react";

import { getProjectById, updateProject } from "../services/projectService";

export default function EditProject() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: "",
    techStack: "",
    liveLink: "",
    youtubeLink: "",
  });

  useEffect(() => {
    loadProject();
  }, []);

  const loadProject = async () => {
    try {
      const res = await getProjectById(id);

      if (res.success) {
        setFormData({
          title: res.data.title || "",
          description: res.data.description || "",
          tags: res.data.tags || "",
          techStack: res.data.techStack || "",
          liveLink: res.data.liveLink || "",
          youtubeLink: res.data.youtubeLink || "",
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

  const handleSubmit = async () => {
    setSaving(true);

    try {
      const res = await updateProject(id, formData);

      if (res.success) {
        alert("Project updated successfully");

        navigate("/my-projects");
      } else {
        alert(res.message);
      }
    } catch (err) {
      console.error(err);

      alert("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-10">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden"
        >
          <div className="bg-gradient-to-r from-purple-700 to-indigo-700 px-10 py-10">
            <h1 className="text-4xl font-bold text-white">Edit Project</h1>

            <p className="text-purple-100 mt-2">
              Update your project information
            </p>
          </div>

          <div className="p-10 space-y-8">
            <div className="rounded-3xl bg-purple-50 border border-purple-100 p-8">
              <div className="flex items-center gap-3 mb-6">
                <FolderGit2 className="text-purple-600" />

                <h2 className="text-2xl font-bold">Basic Information</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="font-semibold text-slate-700">Title</label>

                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-2xl border border-slate-300 px-5 py-3 focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">
                    Description
                  </label>

                  <textarea
                    rows={8}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-2xl border border-slate-300 px-5 py-4 resize-none focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Technologies */}

            <div className="rounded-3xl bg-blue-50 border border-blue-100 p-8">
              <div className="flex items-center gap-3 mb-6">
                <Tag className="text-blue-600" />

                <h2 className="text-2xl font-bold">Technologies</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="font-semibold text-slate-700">
                    Tech Stack
                  </label>

                  <input
                    type="text"
                    name="techStack"
                    value={formData.techStack}
                    onChange={handleChange}
                    placeholder="React, Spring Boot, MySQL..."
                    className="mt-2 w-full rounded-2xl border border-slate-300 px-5 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700">Tags</label>

                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="fullstack, java, react..."
                    className="mt-2 w-full rounded-2xl border border-slate-300 px-5 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Links */}

            <div className="rounded-3xl bg-green-50 border border-green-100 p-8">
              <div className="flex items-center gap-3 mb-6">
                <LinkIcon className="text-green-600" />

                <h2 className="text-2xl font-bold">Project Links</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="font-semibold text-slate-700">
                    Live Link
                  </label>

                  <input
                    type="text"
                    name="liveLink"
                    value={formData.liveLink}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="mt-2 w-full rounded-2xl border border-slate-300 px-5 py-3 focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700">
                    YouTube Link
                  </label>

                  <input
                    type="text"
                    name="youtubeLink"
                    value={formData.youtubeLink}
                    onChange={handleChange}
                    placeholder="https://youtube.com/..."
                    className="mt-2 w-full rounded-2xl border border-slate-300 px-5 py-3 focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Buttons */}

            <div className="flex flex-col md:flex-row gap-5">
              <button
                onClick={() => navigate("/my-projects")}
                className="flex-1 py-4 rounded-2xl border border-slate-300 font-semibold hover:bg-slate-100 transition flex items-center justify-center gap-2"
              >
                <X size={20} />
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                disabled={saving}
                className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2 disabled:opacity-70"
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
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
