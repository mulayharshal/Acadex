import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Search, FolderGit2 } from "lucide-react";

import { getAllProjects } from "../services/projectService";

export default function Projects() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const res = await getAllProjects();

      if (res.success) {
        const sorted = [...res.data].sort(
          (a, b) => new Date(b.uploadedDate) - new Date(a.uploadedDate),
        );

        setProjects(sorted);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const categories = useMemo(() => {
    return [
      "All",
      ...new Set(projects.map((project) => project.category).filter(Boolean)),
    ];
  }, [projects]);

  const filteredProjects = projects.filter((project) => {
    const keyword = search.toLowerCase();

    const matchSearch =
      project.title?.toLowerCase().includes(keyword) ||
      project.description?.toLowerCase().includes(keyword) ||
      project.techStack?.toLowerCase().includes(keyword) ||
      project.category?.toLowerCase().includes(keyword);

    const matchCategory =
      selectedCategory === "All" || project.category === selectedCategory;

    return matchSearch && matchCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <h1 className="text-5xl font-black text-white">All Projects</h1>

          <p className="text-purple-100 mt-3">
            Explore projects built and shared by the Acadex community.
          </p>

          <div className="relative mt-8 max-w-2xl">
            <Search
              size={20}
              className="absolute left-5 top-4 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects..."
              className="w-full rounded-full py-4 pl-14 pr-6 outline-none shadow-lg"
            />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2 rounded-full transition font-medium ${
                selectedCategory === category
                  ? "bg-purple-600 text-white"
                  : "bg-white border hover:border-purple-600"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-16">
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

        {!loading && filteredProjects.length === 0 && (
          <div className="bg-white rounded-3xl shadow-sm py-20 text-center">
            <FolderGit2 size={70} className="mx-auto text-slate-300" />

            <h2 className="text-3xl font-bold text-slate-700 mt-6">
              No Projects Found
            </h2>

            <p className="text-slate-500 mt-3">
              Try another search or category.
            </p>
          </div>
        )}

        {!loading && filteredProjects.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                whileHover={{
                  y: -8,
                  scale: 1.02,
                }}
                transition={{
                  duration: 0.25,
                }}
                onClick={() => navigate(`/projects/${project.id}`)}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl overflow-hidden cursor-pointer"
              >
                {project.image && (
                  <img
                    src={`http://localhost:8080/api/v1/${project.image.replace(/\\/g, "/")}`}
                    alt={project.title}
                    className="w-full h-56 object-cover"
                  />
                )}

                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full">
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

                  <div className="border-t border-slate-100 mt-6 pt-5">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-slate-700">
                          {project.uploadedBy?.name || "Unknown"}
                        </p>

                        <p className="text-xs text-slate-400">Contributor</p>
                      </div>

                      <div className="flex gap-4 text-sm text-slate-500">
                        <span>❤️ {project.likeCount}</span>

                        <span>🔖 {project.saveCount}</span>

                        <span>👁 {project.viewCount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
