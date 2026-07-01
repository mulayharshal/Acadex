import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Heart,
  Bookmark,
  Eye,
  User,
  Download,
  MessageCircle,
  Send,
  Globe,
  Trash2,
} from "lucide-react";
import { motion } from "framer-motion";

import {
  getProjectById,
  likeProject,
  saveProject,
  commentOnProject,
  getProjectComments,
  deleteProjectComment,
} from "../services/projectService";

export default function ProjectDetail() {
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProject();
    loadComments();
  }, [id]);

  const loadProject = async () => {
    try {
      const res = await getProjectById(id);

      if (res.success) {
        setProject(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    try {
      const res = await getProjectComments(id);

      if (res.success) {
        setComments(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const youtubeUrl = useMemo(() => {
    if (!project?.youtubeLink) return "";

    const match = project.youtubeLink.match(
      /(?:youtu\.be\/|watch\?v=|embed\/)([^?&]+)/,
    );

    return match ? `https://www.youtube.com/embed/${match[1]}` : "";
  }, [project]);

  const handleLike = async () => {
    try {
      const res = await likeProject(id);

      if (res.success) {
        setProject(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    try {
      const res = await saveProject(id);

      if (res.success) {
        setProject(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();

    if (!comment.trim()) return;

    const res = await commentOnProject(id, comment);

    if (res.success) {
      setComment("");
      loadComments();
    }
  };

  const handleDeleteComment = async (commentId) => {
    const res = await deleteProjectComment(id, commentId);

    if (res.success) {
      loadComments();
    } else {
      alert(res.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="w-14 h-14 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!project) return null;

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
          <div className="overflow-hidden">
            <motion.img
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.4 }}
              src={`http://localhost:8080/api/v1/${project.image.replace(/\\/g, "/")}`}
              className="w-full h-[450px] object-cover"
            />
          </div>

          <div className="p-10">
            <div className="flex flex-wrap gap-3">
              {project.techStack?.split(",").map((tech, index) => (
                <span
                  key={index}
                  className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-600 hover:text-white transition"
                >
                  {tech.trim()}
                </span>
              ))}
            </div>

            <h1 className="text-5xl font-bold mt-6">{project.title}</h1>

            <p className="text-slate-600 leading-8 mt-6">
              {project.description}
            </p>

            <div className="flex items-center gap-3 mt-8">
              <User size={20} />
              <span>{project.uploadedBy?.name}</span>
            </div>

            <div
              className={`grid gap-4 mt-10 ${
                project.liveLink ? "md:grid-cols-5" : "md:grid-cols-4"
              }`}
            >
              <button
                onClick={handleLike}
                className={`rounded-2xl py-4 flex justify-center items-center gap-2 transition-all duration-300 ${
                  project.liked
                    ? "bg-red-600 text-white"
                    : "bg-red-50 text-red-600 hover:bg-red-100"
                }`}
              >
                <Heart
                  size={18}
                  fill={project.liked ? "currentColor" : "none"}
                />
                {project.likeCount}
              </button>

              <button
                onClick={handleSave}
                className={`rounded-2xl py-4 flex justify-center items-center gap-2 transition-all duration-300 ${
                  project.saved
                    ? "bg-blue-600 text-white"
                    : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                }`}
              >
                <Bookmark
                  size={18}
                  fill={project.saved ? "currentColor" : "none"}
                />
                {project.saveCount}
              </button>

              <div className="rounded-2xl bg-slate-100 py-4 flex justify-center items-center gap-2">
                <Eye size={18} />
                {project.viewCount}
              </div>

              <a
                href={`http://localhost:8080/api/v1/${project.file.replace(/\\/g, "/")}`}
                download
                className="rounded-2xl bg-slate-900 text-white py-4 flex justify-center items-center gap-2 hover:bg-black transition-all duration-300"
              >
                <Download size={18} />
                Download
              </a>

              {project.liveLink && project.liveLink.trim() !== "" && (
                <a
                  href={project.liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-2xl bg-green-600 text-white py-4 flex justify-center items-center gap-2 hover:bg-green-700 transition-all duration-300"
                >
                  <Globe size={18} />
                  Live Demo
                </a>
              )}
            </div>

            {project.youtubeLink &&
              project.youtubeLink.trim() !== "" &&
              youtubeUrl && (
                <div className="mt-12">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-2xl font-bold">Project Demo</h2>

                    <span className="text-sm text-slate-400">
                      Watch without leaving Acadex
                    </span>
                  </div>

                  <div className="overflow-hidden rounded-3xl border shadow">
                    <iframe
                      src={youtubeUrl}
                      title="Project Demo"
                      className="w-full aspect-video"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}
          </div>
        </motion.div>
        {/* Comments */}

        <div className="bg-white rounded-3xl border shadow-sm mt-10 p-8">
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
              placeholder="Write your thoughts..."
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
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex justify-center items-center font-bold">
                      {item.user?.name?.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <h3 className="font-semibold">{item.user?.name}</h3>

                      <p className="text-xs text-slate-400">Community Member</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteComment(item.id)}
                    className="flex items-center gap-1 text-red-500 hover:text-red-700 transition-all duration-300"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>

                <p className="mt-4 leading-7 text-slate-600">{item.comment}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
