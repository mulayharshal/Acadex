import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import {
  Search,
  BookOpen,
  FolderGit2,
  Users,
  FileText,
  Sparkles,
} from "lucide-react";

import { getAllNotes } from "../services/noteService";
import { getAllProjects } from "../services/projectService";

export default function Home() {
  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);
  const [projects, setProjects] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const notesRes = await getAllNotes();
      const projectsRes = await getAllProjects();

      if (notesRes.success) {
        setNotes(notesRes.data);
      }

      if (projectsRes.success) {
        setProjects(projectsRes.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const categories = useMemo(() => {
    const all = [
      ...notes.map((n) => n.category),
      ...projects.map((p) => p.category),
    ];

    return ["All", ...new Set(all.filter(Boolean))];
  }, [notes, projects]);

  const filteredNotes = notes.filter((note) => {
    const keyword = search.toLowerCase();

    const matchSearch =
      note.title?.toLowerCase().includes(keyword) ||
      note.description?.toLowerCase().includes(keyword) ||
      note.tags?.toLowerCase().includes(keyword) ||
      note.category?.toLowerCase().includes(keyword);

    const matchCategory =
      selectedCategory === "All" || note.category === selectedCategory;

    return matchSearch && matchCategory;
  });

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
      {/* Hero */}

      <section className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700">
        <div className="absolute inset-0 bg-black/10" />

        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md rounded-full px-5 py-2 text-white mb-6">
              <Sparkles size={18} />

              <span>Learn • Share • Build</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-black text-white leading-tight">
              Discover Amazing
              <br />
              Notes & Projects
            </h1>

            <p className="text-blue-100 text-lg mt-6 max-w-2xl">
              Explore high-quality notes, projects and learning resources shared
              by students.
            </p>

            {/* Search */}

            <div className="relative mt-10 max-w-2xl">
              <Search
                size={22}
                className="absolute left-5 top-4 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search notes, projects, tags..."
                className="w-full rounded-full py-4 pl-14 pr-6 text-slate-700 shadow-xl outline-none"
              />
            </div>

            {/* Stats */}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-12">
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 text-white">
                <BookOpen size={28} />

                <h2 className="text-3xl font-bold mt-4">{notes.length}</h2>

                <p className="text-blue-100">Notes</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 text-white">
                <FolderGit2 size={28} />

                <h2 className="text-3xl font-bold mt-4">{projects.length}</h2>

                <p className="text-blue-100">Projects</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 text-white">
                <Users size={28} />

                <h2 className="text-3xl font-bold mt-4">
                  {
                    new Set([
                      ...notes.map((n) => n.uploadedBy?.id),
                      ...projects.map((p) => p.uploadedBy?.id),
                    ]).size
                  }
                </h2>

                <p className="text-blue-100">Contributors</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 text-white">
                <FileText size={28} />

                <h2 className="text-3xl font-bold mt-4">
                  {notes.length + projects.length}
                </h2>

                <p className="text-blue-100">Resources</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      {/* Categories */}

      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">
              Browse Categories
            </h2>

            <p className="text-slate-500 mt-2">
              Filter notes and projects by category.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2 rounded-full transition-all duration-300 text-sm font-medium ${
                selectedCategory === category
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white border border-slate-200 hover:border-blue-600 hover:text-blue-600"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Loading */}

      {loading && (
        <section className="max-w-7xl mx-auto px-6 pb-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="bg-white rounded-3xl p-6 shadow-sm animate-pulse"
              >
                <div className="h-48 rounded-2xl bg-slate-200 mb-5" />

                <div className="h-5 rounded bg-slate-200 mb-3" />

                <div className="h-4 rounded bg-slate-200 mb-2" />

                <div className="h-4 w-2/3 rounded bg-slate-200" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Latest Notes */}

      {!loading && (
        <section className="max-w-7xl mx-auto px-6 pb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-800">
                📚 Latest Notes
              </h2>

              <p className="text-slate-500 mt-2">
                Recently uploaded study materials.
              </p>
            </div>

            <button
              onClick={() => navigate("/notes")}
              className="text-blue-600 font-semibold hover:underline"
            >
              View All →
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredNotes.length === 0 ? (
              <div className="col-span-full text-center py-20">
                <BookOpen size={70} className="mx-auto text-slate-300 mb-5" />

                <h3 className="text-2xl font-bold text-slate-700">
                  No Notes Found
                </h3>

                <p className="text-slate-400 mt-2">
                  Try another search or category.
                </p>
              </div>
            ) : (
              filteredNotes.slice(0, 6).map((note) => (
                <motion.div
                  key={note.id}
                  whileHover={{
                    y: -8,
                    scale: 1.02,
                  }}
                  transition={{ duration: 0.25 }}
                  onClick={() => navigate(`/notes/${note.id}`)}
                  className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl overflow-hidden cursor-pointer"
                >
                  <div className="h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />

                  <div className="p-6">
                    <div className="flex justify-between items-center mb-5">
                      <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                        {note.category}
                      </span>

                      <span className="text-xs text-slate-400">#{note.id}</span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-800 line-clamp-2">
                      {note.title}
                    </h3>

                    <p className="text-slate-500 mt-4 line-clamp-3 leading-7">
                      {note.description}
                    </p>

                    {note.tags && (
                      <div className="flex flex-wrap gap-2 mt-5">
                        {note.tags
                          .split(",")
                          .slice(0, 3)
                          .map((tag, index) => (
                            <span
                              key={index}
                              className="bg-slate-100 text-slate-600 text-xs px-3 py-1 rounded-full"
                            >
                              {tag.trim()}
                            </span>
                          ))}
                      </div>
                    )}

                    <div className="border-t border-slate-100 mt-6 pt-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-slate-700">
                            {note.uploadedBy?.name || "Unknown"}
                          </p>

                          <p className="text-xs text-slate-400">Contributor</p>
                        </div>

                        <div className="flex gap-4 text-sm text-slate-500">
                          <span>❤️ {note.likeCount}</span>

                          <span>🔖 {note.saveCount}</span>

                          <span>👁 {note.viewCount}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </section>
      )}
      {/* Latest Projects */}

      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">
              💻 Latest Projects
            </h2>

            <p className="text-slate-500 mt-2">
              Explore projects shared by students.
            </p>
          </div>

          <button
            onClick={() => navigate("/projects")}
            className="text-blue-600 font-semibold hover:underline"
          >
            View All →
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredProjects.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <FolderGit2 size={70} className="mx-auto text-slate-300 mb-5" />

              <h3 className="text-2xl font-bold text-slate-700">
                No Projects Found
              </h3>

              <p className="text-slate-400 mt-2">
                Try another search or category.
              </p>
            </div>
          ) : (
            filteredProjects.slice(0, 6).map((project) => (
              <motion.div
                key={project.id}
                whileHover={{
                  y: -8,
                  scale: 1.02,
                }}
                transition={{ duration: 0.25 }}
                onClick={() => navigate(`/projects/${project.id}`)}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl cursor-pointer"
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
                    <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full">
                      {project.category}
                    </span>

                    <span className="text-xs text-slate-400">
                      #{project.id}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-800 line-clamp-2">
                    {project.title}
                  </h3>

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

                  <div className="flex gap-2 mt-5 flex-wrap">
                    {project.liveLink && (
                      <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">
                        🌐 Live Demo
                      </span>
                    )}

                    {project.youtubeLink && (
                      <span className="bg-red-100 text-red-700 text-xs px-3 py-1 rounded-full">
                        ▶ Demo
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
            ))
          )}
        </div>
      </section>

      {/* Footer */}

      <footer className="border-t bg-white mt-10">
        <div className="max-w-7xl mx-auto px-6 py-10 text-center">
          <h3 className="text-2xl font-bold text-slate-800">Acadex</h3>

          <p className="text-slate-500 mt-2">Learn • Share • Build</p>

          <p className="text-slate-400 text-sm mt-6">
            © {new Date().getFullYear()} Acadex. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
