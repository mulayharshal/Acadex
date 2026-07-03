import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import {
  BookOpen,
  Plus,
  Pencil,
  Trash2,
  Heart,
  Bookmark,
  Eye,
} from "lucide-react";

import { getMyNotes, deleteNote } from "../services/noteService";

export default function MyNotes() {
  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const res = await getMyNotes();

      if (res.success) {
        setNotes(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this note?",
    );

    if (!confirmDelete) return;

    try {
      const res = await deleteNote(id);

      if (res.success) {
        setNotes((prev) => prev.filter((note) => note.id !== id));
      } else {
        alert(res.message);
      }
    } catch (err) {
      console.error(err);

      alert("Unable to delete note.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}

      <section className="bg-gradient-to-r from-blue-700 to-indigo-700">
        <div className="max-w-7xl mx-auto px-6 py-14">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-5xl font-black text-white">My Notes</h1>

              <p className="text-blue-100 mt-3">
                Manage all your uploaded notes.
              </p>
            </div>

            <button
              onClick={() => navigate("/upload-note")}
              className="flex items-center gap-3 bg-white text-blue-700 px-6 py-4 rounded-2xl font-semibold hover:scale-105 transition"
            >
              <Plus size={20} />
              Upload Note
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
                className="bg-white rounded-3xl p-6 shadow-sm animate-pulse"
              >
                <div className="h-5 w-2/3 rounded bg-slate-200 mb-5" />

                <div className="h-4 rounded bg-slate-200 mb-2" />

                <div className="h-4 w-3/4 rounded bg-slate-200 mb-6" />

                <div className="h-4 w-full rounded bg-slate-200" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}

        {!loading && notes.length === 0 && (
          <div className="bg-white rounded-3xl shadow-sm py-20 text-center">
            <BookOpen size={70} className="mx-auto text-slate-300" />

            <h2 className="text-3xl font-bold text-slate-700 mt-6">
              No Notes Yet
            </h2>

            <p className="text-slate-500 mt-3">
              Upload your first note and start sharing with others.
            </p>

            <button
              onClick={() => navigate("/upload-note")}
              className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-semibold transition"
            >
              Upload Note
            </button>
          </div>
        )}

        {/* Notes */}

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
                className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl overflow-hidden"
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

                  <div className="flex justify-between mt-6 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <Heart size={16} />

                      {note.likeCount}
                    </span>

                    <span className="flex items-center gap-1">
                      <Bookmark size={16} />

                      {note.saveCount}
                    </span>

                    <span className="flex items-center gap-1">
                      <Eye size={16} />

                      {note.viewCount}
                    </span>
                  </div>

                  <div className="flex gap-3 mt-8">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/notes/edit/${note.id}`);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl py-3 transition"
                    >
                      <Pencil size={18} />
                      Edit
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(note.id);
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
