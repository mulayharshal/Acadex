import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, File, X, Tag, BookOpen } from "lucide-react";
import { uploadNote } from "../services/noteService";
import { useNavigate } from "react-router-dom";

export default function UploadNote() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");

  const [tags, setTags] = useState("");

  const [file, setFile] = useState(null);

  const [dragging, setDragging] = useState(false);

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  const categories = [
    "Semester 1",
    "Semester 2",
    "Semester 3",
    "Semester 4",
    "Semester 5",
    "Semester 6",
    "Semester 7",
    "Semester 8",

    "Java",
    "Python",
    "C",
    "C++",
    "JavaScript",
    "React",
    "Node.js",
    "Spring Boot",
    "Flutter",
    "Android",

    "DBMS",
    "Operating System",
    "Computer Networks",
    "Software Engineering",
    "Computer Graphics",
    "Data Structures",
    "Algorithms",
    "OOP",
    "Theory of Computation",
    "Compiler Design",
    "Artificial Intelligence",
    "Machine Learning",
    "Cloud Computing",
    "Cyber Security",
    "Data Science",

    "Notes",
    "Assignment",
    "Lab Manual",
    "Practical",
    "Mini Project",
    "Major Project",
    "Research Paper",
    "Presentation (PPT)",
    "Question Paper",
    "PYQ",

    "Other",
  ];

  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ];

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;

    if (!allowedTypes.includes(selectedFile.type)) {
      alert("Only PDF, DOC, DOCX, PPT and PPTX files are allowed.");
      return;
    }

    const maxSize = 20 * 1024 * 1024;

    if (selectedFile.size > maxSize) {
      alert("Maximum file size is 20 MB.");
      return;
    }

    setFile(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();

    setDragging(false);

    handleFile(e.dataTransfer.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!title || !description || !category || !tags || !file) {
      setMessage("Please fill all fields.");
      return;
    }

    if (category === "Other" && !customCategory.trim()) {
      setMessage("Please enter a custom category.");
      return;
    }

    setLoading(true);

    setMessage("");

    try {
      const formData = new FormData();

      formData.append("title", title);
      formData.append("description", description);

      formData.append(
        "category",
        category === "Other" ? customCategory : category,
      );

      formData.append("tags", tags);

      formData.append("file", file);

      const res = await uploadNote(formData);

      if (res.success) {
        setMessage("Note uploaded successfully.");

        setTitle("");
        setDescription("");
        setCategory("");
        setCustomCategory("");
        setTags("");
        setFile(null);
        alert("Note uploaded successfully.");
        navigate("/my-notes");
      } else {
        setMessage(res.message);
      }
    } catch (err) {
      console.error(err);

      setMessage("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-slate-50 py-10 px-5"
    >
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-3xl border shadow-sm p-10">
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-slate-800">Upload Notes</h1>

            <p className="text-slate-500 mt-2">
              Share your study notes with the Acadex community.
            </p>
          </div>

          <form onSubmit={handleUpload}>
            {/* Title */}

            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Note Title
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. DBMS Unit 3 Notes"
                className="w-full rounded-2xl border border-slate-200 px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Description */}

            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description
              </label>

              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write a detailed description about your notes..."
                className="w-full rounded-2xl border border-slate-200 px-5 py-4 resize-none outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Category */}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Category
                </label>

                <div className="relative">
                  <BookOpen
                    size={18}
                    className="absolute left-4 top-4 text-slate-400"
                  />

                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 pl-11 pr-4 py-4 outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Category</option>

                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tags */}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tags
                </label>

                <div className="relative">
                  <Tag
                    size={18}
                    className="absolute left-4 top-4 text-slate-400"
                  />

                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="dbms, semester-5, notes"
                    className="w-full rounded-2xl border border-slate-200 pl-11 pr-4 py-4 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <p className="text-xs text-slate-400 mt-2">
                  Separate multiple tags using commas.
                </p>
              </div>
            </div>

            {/* Custom Category */}

            {category === "Other" && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Custom Category
                </label>

                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="Enter your own category"
                  className="w-full rounded-2xl border border-slate-200 px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
            {/* Upload File */}

            <div className="mb-8">
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Upload Note File
              </label>

              <motion.div
                whileHover={{ scale: 1.01 }}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                className={`rounded-3xl border-2 border-dashed transition-all duration-300 p-10 text-center ${
                  dragging
                    ? "border-blue-600 bg-blue-50"
                    : "border-slate-300 bg-slate-50"
                }`}
              >
                {!file ? (
                  <>
                    <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mx-auto">
                      <Upload size={40} className="text-blue-600" />
                    </div>

                    <h3 className="text-2xl font-bold mt-6 text-slate-800">
                      Drag & Drop your file here
                    </h3>

                    <p className="text-slate-500 mt-3">
                      Supported formats: <b>PDF, DOC, DOCX, PPT, PPTX</b>
                    </p>

                    <p className="text-sm text-slate-400 mt-2">
                      Maximum file size: 20 MB
                    </p>

                    <label className="inline-flex mt-8 cursor-pointer">
                      <input
                        type="file"
                        hidden
                        accept=".pdf,.doc,.docx,.ppt,.pptx"
                        onChange={(e) => handleFile(e.target.files[0])}
                      />

                      <span className="bg-blue-600 hover:bg-blue-700 text-white px-7 py-3 rounded-2xl transition">
                        Browse File
                      </span>
                    </label>
                  </>
                ) : (
                  <motion.div
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    className="bg-white rounded-2xl border border-slate-200 p-6 flex justify-between items-center"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">
                        <File size={28} className="text-blue-600" />
                      </div>

                      <div className="text-left">
                        <h4 className="font-semibold text-slate-800 break-all">
                          {file.name}
                        </h4>

                        <p className="text-sm text-slate-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      className="w-11 h-11 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center transition"
                    >
                      <X size={18} className="text-red-600" />
                    </button>
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* Message */}

            {message && (
              <div
                className={`mb-6 rounded-2xl px-5 py-4 text-sm font-medium ${
                  message.toLowerCase().includes("success")
                    ? "bg-green-100 border border-green-200 text-green-700"
                    : "bg-red-100 border border-red-200 text-red-700"
                }`}
              >
                {message}
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg transition-all duration-300"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload size={20} />
                    Upload Note
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
