import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import { Bookmark, Heart, Eye, FolderGit2 } from "lucide-react";

import { getMySavedProjects, saveProject } from "../services/projectService";

export default function SavedProjects() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const res = await getMySavedProjects();

      if (res.success) {
        setProjects(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (e, id) => {
    e.stopPropagation();

    const confirmRemove = window.confirm(
      "Remove this project from your saved projects?",
    );

    if (!confirmRemove) return;

    try {
      const res = await saveProject(id);

      if (res.success) {
        setProjects((prev) => prev.filter((project) => project.id !== id));
      } else {
        alert(res.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-r from-purple-700 to-indigo-700">
        <div className="max-w-7xl mx-auto px-6 py-14">
          <h1 className="text-5xl font-black text-white">Saved Projects</h1>

          <p className="text-purple-100 mt-3">Your bookmarked projects.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-10">
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
                className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl overflow-hidden cursor-pointer"
              >
                {project.image && (
                  <img
                    src={project.image.replace(/\\/g, "/")}
                    alt={project.title}
                    className="w-full h-56 object-cover"
                  />
                )}

                <div className="p-6">
                  <div className="flex justify-between items-center mb-5">
                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">
                      Project
                    </span>

                    <button
                      onClick={(e) => handleUnsave(e, project.id)}
                      className="w-10 h-10 rounded-full bg-purple-50 hover:bg-red-50 flex items-center justify-center transition"
                    >
                      <Bookmark
                        size={20}
                        className="text-purple-600 hover:text-red-600"
                        fill="currentColor"
                      />
                    </button>
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
                            className="bg-slate-100 text-slate-600 text-xs px-3 py-1 rounded-full"
                          >
                            {tech.trim()}
                          </span>
                        ))}
                    </div>
                  )}

                  <div className="flex justify-between mt-6 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <Heart size={16} />

                      {project.likeCount}
                    </span>

                    <span className="flex items-center gap-1">
                      <Eye size={16} />

                      {project.viewCount}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

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

        {/* Empty */}

        {!loading && projects.length === 0 && (
          <div className="bg-white rounded-3xl shadow-sm py-20 text-center">
            <FolderGit2 size={70} className="mx-auto text-slate-300" />

            <h2 className="text-3xl font-bold text-slate-700 mt-6">
              No Saved Projects
            </h2>

            <p className="text-slate-500 mt-3">
              Projects you save will appear here.
            </p>

            <button
              onClick={() => navigate("/")}
              className="mt-8 bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-2xl font-semibold transition"
            >
              Browse Projects
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
