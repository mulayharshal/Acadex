import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import { Bookmark, Heart, Eye, BookOpen } from "lucide-react";

import { getMySavedNotes, saveNote } from "../services/noteService";

export default function SavedNotes() {
  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const res = await getMySavedNotes();

      if (res.success) {
        setNotes(res.data);
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
      "Remove this note from your saved notes?",
    );

    if (!confirmRemove) return;

    try {
      const res = await saveNote(id);

      if (res.success) {
        setNotes((prev) => prev.filter((note) => note.id !== id));
      } else {
        alert(res.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-r from-blue-700 to-indigo-700">
        <div className="max-w-7xl mx-auto px-6 py-14">
          <h1 className="text-5xl font-black text-white">Saved Notes</h1>

          <p className="text-blue-100 mt-3">Your bookmarked notes.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {!loading && notes.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
            {notes.map((note) => (
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
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                      {note.category}
                    </span>

                    <button
                      onClick={(e) => handleUnsave(e, note.id)}
                      className="w-10 h-10 rounded-full bg-blue-50 hover:bg-red-50 flex items-center justify-center transition"
                    >
                      <Bookmark
                        size={20}
                        className="text-blue-600 hover:text-red-600"
                        fill="currentColor"
                      />
                    </button>
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

                  <div className="flex justify-between mt-6 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <Heart size={16} />

                      {note.likeCount}
                    </span>

                    <span className="flex items-center gap-1">
                      <Eye size={16} />

                      {note.viewCount}
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

        {/* Empty */}

        {!loading && notes.length === 0 && (
          <div className="bg-white rounded-3xl shadow-sm py-20 text-center">
            <BookOpen size={70} className="mx-auto text-slate-300" />

            <h2 className="text-3xl font-bold text-slate-700 mt-6">
              No Saved Notes
            </h2>

            <p className="text-slate-500 mt-3">
              Notes you save will appear here.
            </p>

            <button
              onClick={() => navigate("/")}
              className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-semibold transition"
            >
              Browse Notes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
