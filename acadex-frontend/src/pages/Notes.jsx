import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Search, BookOpen } from "lucide-react";

import { getAllNotes } from "../services/noteService";

export default function Notes() {
  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const res = await getAllNotes();

      if (res.success) {
        const sorted = [...res.data].sort(
          (a, b) => new Date(b.uploadedDate) - new Date(a.uploadedDate),
        );

        setNotes(sorted);
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
      ...new Set(notes.map((note) => note.category).filter(Boolean)),
    ];
  }, [notes]);

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

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <h1 className="text-5xl font-black text-white">All Notes</h1>

          <p className="text-blue-100 mt-3">
            Browse all study notes shared by the Acadex community.
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
              placeholder="Search notes..."
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
                  ? "bg-blue-600 text-white"
                  : "bg-white border hover:border-blue-600"
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
                className="bg-white rounded-3xl p-6 shadow-sm animate-pulse"
              >
                <div className="h-5 w-2/3 rounded bg-slate-200 mb-5" />

                <div className="h-4 rounded bg-slate-200 mb-2" />

                <div className="h-4 w-3/4 rounded bg-slate-200 mb-6" />

                <div className="h-4 rounded bg-slate-200" />
              </div>
            ))}
          </div>
        )}

        {!loading && filteredNotes.length === 0 && (
          <div className="bg-white rounded-3xl shadow-sm py-20 text-center">
            <BookOpen size={70} className="mx-auto text-slate-300" />

            <h2 className="text-3xl font-bold text-slate-700 mt-6">
              No Notes Found
            </h2>

            <p className="text-slate-500 mt-3">
              Try another search or category.
            </p>
          </div>
        )}

        {!loading && filteredNotes.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredNotes.map((note) => (
              <motion.div
                key={note.id}
                whileHover={{
                  y: -8,
                  scale: 1.02,
                }}
                transition={{
                  duration: 0.25,
                }}
                onClick={() => navigate(`/notes/${note.id}`)}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl overflow-hidden cursor-pointer"
              >
                <div className="h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />

                <div className="p-6">
                  <div className="flex justify-between items-center mb-5">
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                      {note.category}
                    </span>

                    <span className="text-xs text-slate-400">#{note.id}</span>
                  </div>

                  <h2 className="text-xl font-bold text-slate-800 line-clamp-2">
                    {note.title}
                  </h2>

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
                    <div className="flex justify-between items-center">
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
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
