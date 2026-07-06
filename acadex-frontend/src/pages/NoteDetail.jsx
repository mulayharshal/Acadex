import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  Heart,
  Bookmark,
  Download,
  Eye,
  User,
  MessageCircle,
  Send,
  FileText,
  Image as ImageIcon,
  Trash2,
} from "lucide-react";
import { motion } from "framer-motion";

import {
  getNoteById,
  likeNote,
  saveNote,
  commentOnNote,
  getComments,
  deleteComment,
} from "../services/noteService";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export default function NoteDetail() {
  const { id } = useParams();
const [numPages, setNumPages] = useState(0);
const [pageWidth, setPageWidth] = useState(900);

  const [note, setNote] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNote();
    loadComments();
  }, [id]);

  useEffect(() => {
  const updateWidth = () => {
    setPageWidth(Math.min(window.innerWidth - 40, 900));
  };

  updateWidth();

  window.addEventListener("resize", updateWidth);

  return () => window.removeEventListener("resize", updateWidth);
}, []);

  const loadNote = async () => {
    try {
      const res = await getNoteById(id);

      if (res.success) {
        setNote(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    try {
      const res = await getComments(id);

      if (res.success) {
        setComments(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLike = async () => {
    const res = await likeNote(id);

    if (res.success) {
      setNote(res.data);
    }
  };

  const handleSave = async () => {
    const res = await saveNote(id);

    if (res.success) {
      setNote(res.data);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();

    if (!comment.trim()) return;

    const res = await commentOnNote(id, comment);

    if (res.success) {
      setComment("");
      loadComments();
    }
  };

  const handleDeleteComment = async (commentId) => {
    const res = await deleteComment(id, commentId);

    if (res.success) {
      loadComments();
    } else {
      alert(res.message);
    }
  };

  const fileUrl = note?.file ? note.file.replace(/\\/g, "/") : "";

  const extension = useMemo(() => {
    if (!note?.file) return "";
    return note.file.split(".").pop().toLowerCase();
  }, [note]);

  const isPdf = extension === "pdf";

  const isImage = ["jpg", "jpeg", "png", "webp"].includes(extension);

  const isText = [
    "txt",
    "java",
    "js",
    "ts",
    "py",
    "cpp",
    "c",
    "html",
    "css",
    "json",
    "xml",
  ].includes(extension);

  const isOffice = ["doc", "docx", "ppt", "pptx", "xls", "xlsx"].includes(
    extension,
  );

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="w-14 h-14 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!note) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-50 min-h-screen py-10 px-5"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white rounded-3xl border shadow-sm overflow-hidden"
        >
          <div className="p-10">
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-medium">
                {note.category}
              </span>

              {note.tags?.split(",").map((tag, index) => (
                <span
                  key={index}
                  className="px-4 py-2 rounded-full bg-slate-100 text-slate-700"
                >
                  #{tag.trim()}
                </span>
              ))}
            </div>

            <h1 className="text-5xl font-bold mt-6">{note.title}</h1>

            <p className="text-slate-600 mt-6 leading-8">{note.description}</p>

            <div className="flex items-center gap-3 mt-8">
              <User size={20} />

              <span>{note.uploadedBy?.name}</span>
            </div>
            <div className="grid md:grid-cols-4 gap-4 mt-10">
              <button
                onClick={handleLike}
                className={`rounded-2xl py-4 flex justify-center items-center gap-2 transition-all duration-300 ${
                  note.liked
                    ? "bg-red-600 text-white"
                    : "bg-red-50 text-red-600 hover:bg-red-100"
                }`}
              >
                <Heart size={18} fill={note.liked ? "currentColor" : "none"} />
                {note.likeCount}
              </button>

              <button
                onClick={handleSave}
                className={`rounded-2xl py-4 flex justify-center items-center gap-2 transition-all duration-300 ${
                  note.saved
                    ? "bg-blue-600 text-white"
                    : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                }`}
              >
                <Bookmark
                  size={18}
                  fill={note.saved ? "currentColor" : "none"}
                />
                {note.saveCount}
              </button>

              <div className="rounded-2xl bg-slate-100 py-4 flex justify-center items-center gap-2">
                <Eye size={18} />

                {note.viewCount}
              </div>

              <a
                href={fileUrl}
                download
                className="rounded-2xl bg-slate-900 text-white py-4 flex justify-center items-center gap-2 hover:bg-black transition-all duration-300"
              >
                <Download size={18} />
                Download
              </a>
            </div>

            {/* Preview */}

            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Preview</h2>

{isPdf && (
  <div className="rounded-3xl border bg-white shadow overflow-hidden">
    <div className="h-[800px] overflow-y-auto overflow-x-hidden p-4">
      <Document
        file={fileUrl}
        onLoadSuccess={({ numPages }) => {
          setNumPages(numPages);
        }}
        loading={
          <div className="text-center py-10 text-slate-500">
            Loading PDF...
          </div>
        }
        error={
          <div className="text-center py-10 text-red-500">
            Failed to load PDF.
          </div>
        }
      >
        <div className="space-y-6">
          {Array.from({ length: numPages }, (_, index) => (
            <div key={index} className="flex justify-center">
              <Page
                pageNumber={index + 1}
                width={pageWidth}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </div>
          ))}
        </div>
      </Document>
    </div>
  </div>
)}
              {isImage && (
                <div className="overflow-hidden rounded-3xl border shadow">
                  <img
                    src={fileUrl}
                    alt={note.title}
                    className="w-full object-contain max-h-[800px]"
                  />
                </div>
              )}

              {isOffice && (
                <div className="overflow-hidden rounded-3xl border shadow">
                  <iframe
                    src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`}
                    title="Office Preview"
                    className="w-full h-[800px]"
                  />
                </div>
              )}

              {isText && (
                <div className="rounded-3xl border overflow-hidden">
                  <iframe
                    src={fileUrl}
                    title="Text Preview"
                    className="w-full h-[700px]"
                  />
                </div>
              )}

              {!isPdf && !isImage && !isOffice && !isText && (
                <div className="rounded-3xl border bg-slate-50 p-10 text-center">
                  <ImageIcon size={70} className="mx-auto text-slate-400" />

                  <h3 className="text-2xl font-bold mt-6">
                    Preview not available
                  </h3>

                  <p className="text-slate-500 mt-3">
                    This file cannot be previewed.
                  </p>

                  <a
                    href={fileUrl}
                    download
                    className="inline-flex items-center gap-2 mt-6 bg-blue-600 text-white px-6 py-3 rounded-2xl hover:bg-blue-700 transition"
                  >
                    <Download size={18} />
                    Download
                  </a>
                </div>
              )}
            </div>
          </div>
        </motion.div>
        {/* Comments */}

        <div className="bg-white rounded-3xl shadow-sm border mt-10 p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <MessageCircle className="text-blue-600" />

              <h2 className="text-2xl font-bold">Comments</h2>
            </div>

            <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
              {comments.length}
            </span>
          </div>

          <form onSubmit={handleComment} className="flex gap-3 mb-8">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your comment..."
              className="flex-1 rounded-2xl border border-slate-200 px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button className="bg-blue-600 hover:bg-blue-700 text-white px-7 rounded-2xl transition-all duration-300">
              <Send size={18} />
            </button>
          </form>

          <div className="space-y-5">
            {comments.length === 0 && (
              <div className="text-center text-slate-400 py-10">
                No comments yet.
              </div>
            )}

            {comments.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ y: -2 }}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition-all duration-300"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold">
                      {item.user?.name?.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <h3 className="font-semibold">{item.user?.name}</h3>

                      <p className="text-xs text-slate-400">Community Member</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteComment(item.id)}
                    className="flex items-center gap-1 text-red-500 hover:text-red-700 transition"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>

                <p className="mt-4 text-slate-600 leading-7">{item.comment}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
