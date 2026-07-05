import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import {
  FolderGit2,
  Plus,
  Pencil,
  Trash2,
  Heart,
  Bookmark,
  Eye,
} from "lucide-react";

import { getMyProjects, deleteProject } from "../services/projectService";

export default function MyProjects() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const res = await getMyProjects();

      if (res.success) {
        setProjects(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project?",
    );

    if (!confirmDelete) return;

    try {
      const res = await deleteProject(id);

      if (res.success) {
        setProjects((prev) => prev.filter((project) => project.id !== id));
      } else {
        alert(res.message);
      }
    } catch (err) {
      console.error(err);

      alert("Unable to delete project.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}

      <section className="bg-gradient-to-r from-purple-700 to-indigo-700">
        <div className="max-w-7xl mx-auto px-6 py-14">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-5xl font-black text-white">My Projects</h1>

              <p className="text-purple-100 mt-3">
                Manage all your uploaded projects.
              </p>
            </div>

            <button
              onClick={() => navigate("/upload-project")}
              className="flex items-center gap-3 bg-white text-purple-700 px-6 py-4 rounded-2xl font-semibold hover:scale-105 transition"
            >
              <Plus size={20} />
              Upload Project
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Loading */}

        {loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="bg-white rounded-3xl overflow-hidden shadow-sm animate-pulse"
              >
                <div className="h-56 bg-slate-200" />

                <div className="p-6">
                  <div className="h-5 rounded bg-slate-200 mb-4" />

                  <div className="h-4 rounded bg-slate-200 mb-2" />

                  <div className="h-4 w-2/3 rounded bg-slate-200 mb-6" />

                  <div className="flex gap-2">
                    <div className="h-7 w-16 rounded-full bg-slate-200" />

                    <div className="h-7 w-20 rounded-full bg-slate-200" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}

        {!loading && projects.length === 0 && (
          <div className="bg-white rounded-3xl shadow-sm py-20 text-center">
            <FolderGit2 size={70} className="mx-auto text-slate-300" />

            <h2 className="text-3xl font-bold text-slate-700 mt-6">
              No Projects Yet
            </h2>

            <p className="text-slate-500 mt-3">
              Upload your first project and showcase your work.
            </p>

            <button
              onClick={() => navigate("/upload-project")}
              className="mt-8 bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-2xl font-semibold transition"
            >
              Upload Project
            </button>
          </div>
        )}

        {/* Projects */}

        {!loading && projects.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
            {projects.map((project) => (
              <motion.div
                key={project.id}
                whileHover={{
                  y: -8,
                  scale: 1.02,
                }}
                transition={{ duration: 0.25 }}
                onClick={() => navigate(`/projects/${project.id}`)}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl overflow-hidden"
              >
                {project.image && (
                  <img
                    src={project.image.replace(/\\/g, "/")}
                    alt={project.title}
                    className="w-full h-56 object-cover"
                  />
                )}

                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">
                      {project.category}
                    </span>

                    <span className="text-xs text-slate-400">
                      #{project.id}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-slate-800 line-clamp-2">
                    {project.title}
                  </h2>

                  <p className="text-slate-500 mt-4 line-clamp-3 leading-7">
                    {project.description}
                  </p>

                  {project.techStack && (
                    <div className="flex flex-wrap gap-2 mt-5">
                      {project.techStack
                        .split(",")
                        .slice(0, 4)
                        .map((tech, index) => (
                          <span
                            key={index}
                            className="bg-slate-100 text-slate-700 text-xs px-3 py-1 rounded-full"
                          >
                            {tech.trim()}
                          </span>
                        ))}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 mt-5">
                    {project.liveLink && (
                      <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">
                        🌐 Live Demo
                      </span>
                    )}

                    {project.youtubeLink && (
                      <span className="bg-red-100 text-red-700 text-xs px-3 py-1 rounded-full">
                        ▶ Demo Video
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between mt-6 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <Heart size={16} />

                      {project.likeCount}
                    </span>

                    <span className="flex items-center gap-1">
                      <Bookmark size={16} />

                      {project.saveCount}
                    </span>

                    <span className="flex items-center gap-1">
                      <Eye size={16} />

                      {project.viewCount}
                    </span>
                  </div>

                  <div className="flex gap-3 mt-8">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/projects/edit/${project.id}`);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl py-3 transition"
                    >
                      <Pencil size={18} />
                      Edit
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(project.id);
                      }}
                      className="flex items-center justify-center bg-red-100 hover:bg-red-200 text-red-600 rounded-2xl px-5 transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
