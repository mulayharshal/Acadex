import { useState } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  Image,
  FileArchive,
  X,
  Tag,
  FolderGit2,
  Globe,
  PlayCircle,
} from "lucide-react";

import { uploadProject } from "../services/projectService";
import { useNavigate } from "react-router-dom";

export default function UploadProject() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");

  const [techStack, setTechStack] = useState("");
  const [tags, setTags] = useState("");

  const [liveLink, setLiveLink] = useState("");
  const [youtubeLink, setYoutubeLink] = useState("");

  const [image, setImage] = useState(null);
  const [zipFile, setZipFile] = useState(null);

  const [dragImage, setDragImage] = useState(false);
  const [dragZip, setDragZip] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const categories = [
    "Web Development",
    "Android Development",
    "Flutter",
    "Java",
    "Python",
    "Machine Learning",
    "Artificial Intelligence",
    "Data Science",
    "Cyber Security",
    "Cloud Computing",
    "Blockchain",
    "Desktop Application",
    "Mini Project",
    "Major Project",
    "Research Paper",
    "Other",
  ];

  const imageTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

  const handleImage = (selectedFile) => {
    if (!selectedFile) return;

    if (!imageTypes.includes(selectedFile.type)) {
      alert("Only JPG, JPEG, PNG and WEBP images are allowed.");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      alert("Maximum image size is 5 MB.");
      return;
    }

    setImage(selectedFile);
  };

  const handleZip = (selectedFile) => {
    if (!selectedFile) return;

    const extension = selectedFile.name.split(".").pop().toLowerCase();

    if (extension !== "zip") {
      alert("Only ZIP files are allowed.");
      return;
    }

    if (selectedFile.size > 100 * 1024 * 1024) {
      alert("Maximum ZIP size is 100 MB.");
      return;
    }

    setZipFile(selectedFile);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (
      !title ||
      !description ||
      !category ||
      !techStack ||
      !tags ||
      !image ||
      !zipFile
    ) {
      setMessage("Please fill all required fields.");
      return;
    }

    if (category === "Other" && !customCategory.trim()) {
      setMessage("Please enter custom category.");
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

      formData.append("techStack", techStack);
      formData.append("tags", tags);

      formData.append("liveLink", liveLink);
      formData.append("youtubeLink", youtubeLink);

      formData.append("image", image);
      formData.append("file", zipFile);

      const res = await uploadProject(formData);

      if (res.success) {
        setMessage("Project uploaded successfully.");

        setTitle("");
        setDescription("");
        setCategory("");
        setCustomCategory("");
        setTechStack("");
        setTags("");
        setLiveLink("");
        setYoutubeLink("");

        setImage(null);
        setZipFile(null);
        alert("Project uploaded successfully.");
        navigate("/my-projects");
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
            <h1 className="text-4xl font-bold">Upload Project</h1>

            <p className="text-slate-500 mt-2">
              Share your project with the Acadex community.
            </p>
          </div>

          <form onSubmit={handleUpload}>
            {/* Project Title */}

            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Project Title
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter project title"
                className="w-full rounded-2xl border border-slate-200 px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Description */}

            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description
              </label>

              <textarea
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your project..."
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
                  <FolderGit2
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

              {/* Tech Stack */}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tech Stack
                </label>

                <input
                  type="text"
                  value={techStack}
                  onChange={(e) => setTechStack(e.target.value)}
                  placeholder="React, Spring Boot, MySQL..."
                  className="w-full rounded-2xl border border-slate-200 px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500"
                />

                <p className="text-xs text-slate-400 mt-2">
                  Separate technologies using commas.
                </p>
              </div>
            </div>

            {/* Other Category */}

            {category === "Other" && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Custom Category
                </label>

                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="Enter custom category"
                  className="w-full rounded-2xl border border-slate-200 px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {/* Tags */}

            <div className="mb-6">
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
                  placeholder="crud, java, springboot"
                  className="w-full rounded-2xl border border-slate-200 pl-11 pr-4 py-4 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <p className="text-xs text-slate-400 mt-2">
                Separate tags using commas.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Live Demo */}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Live Demo (Optional)
                </label>

                <div className="relative">
                  <Globe
                    size={18}
                    className="absolute left-4 top-4 text-slate-400"
                  />

                  <input
                    type="url"
                    value={liveLink}
                    onChange={(e) => setLiveLink(e.target.value)}
                    placeholder="https://your-demo.com"
                    className="w-full rounded-2xl border border-slate-200 pl-11 pr-4 py-4 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* YouTube Demo */}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  YouTube Demo (Optional)
                </label>

                <div className="relative">
                  <PlayCircle
                    size={18}
                    className="absolute left-4 top-4 text-slate-400"
                  />

                  <input
                    type="url"
                    value={youtubeLink}
                    onChange={(e) => setYoutubeLink(e.target.value)}
                    placeholder="https://youtube.com/..."
                    className="w-full rounded-2xl border border-slate-200 pl-11 pr-4 py-4 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
            {/* Project Image */}

            <div className="mb-8">
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Project Image
              </label>

              <motion.div
                whileHover={{ scale: 1.01 }}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragImage(true);
                }}
                onDragLeave={() => setDragImage(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragImage(false);
                  handleImage(e.dataTransfer.files[0]);
                }}
                className={`rounded-3xl border-2 border-dashed p-10 text-center transition-all duration-300 ${
                  dragImage
                    ? "border-blue-600 bg-blue-50"
                    : "border-slate-300 bg-slate-50"
                }`}
              >
                {!image ? (
                  <>
                    <Image size={60} className="mx-auto text-blue-600" />

                    <h3 className="text-2xl font-bold mt-5">
                      Upload Project Image
                    </h3>

                    <p className="text-slate-500 mt-3">JPG, JPEG, PNG, WEBP</p>

                    <p className="text-sm text-slate-400 mt-2">
                      Maximum Size : 5 MB
                    </p>

                    <label className="inline-flex mt-7 cursor-pointer">
                      <input
                        hidden
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp"
                        onChange={(e) => handleImage(e.target.files[0])}
                      />

                      <span className="bg-blue-600 text-white px-7 py-3 rounded-2xl hover:bg-blue-700 transition">
                        Browse Image
                      </span>
                    </label>
                  </>
                ) : (
                  <div className="bg-white rounded-2xl border p-5 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <img
                        src={URL.createObjectURL(image)}
                        alt="preview"
                        className="w-20 h-20 rounded-xl object-cover border"
                      />

                      <div className="text-left">
                        <h4 className="font-semibold break-all">
                          {image.name}
                        </h4>

                        <p className="text-sm text-slate-500">
                          {(image.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setImage(null)}
                      className="w-11 h-11 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center"
                    >
                      <X size={18} className="text-red-600" />
                    </button>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Project ZIP */}

            <div className="mb-8">
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Project ZIP File
              </label>

              <motion.div
                whileHover={{ scale: 1.01 }}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragZip(true);
                }}
                onDragLeave={() => setDragZip(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragZip(false);
                  handleZip(e.dataTransfer.files[0]);
                }}
                className={`rounded-3xl border-2 border-dashed p-10 text-center transition-all duration-300 ${
                  dragZip
                    ? "border-green-600 bg-green-50"
                    : "border-slate-300 bg-slate-50"
                }`}
              >
                {!zipFile ? (
                  <>
                    <FileArchive size={60} className="mx-auto text-green-600" />

                    <h3 className="text-2xl font-bold mt-5">
                      Upload Project ZIP
                    </h3>

                    <p className="text-slate-500 mt-3">
                      Only ZIP files are allowed
                    </p>

                    <p className="text-sm text-slate-400 mt-2">
                      Maximum Size : 100 MB
                    </p>

                    <label className="inline-flex mt-7 cursor-pointer">
                      <input
                        hidden
                        type="file"
                        accept=".zip"
                        onChange={(e) => handleZip(e.target.files[0])}
                      />

                      <span className="bg-green-600 text-white px-7 py-3 rounded-2xl hover:bg-green-700 transition">
                        Browse ZIP
                      </span>
                    </label>
                  </>
                ) : (
                  <div className="bg-white rounded-2xl border p-5 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center">
                        <FileArchive size={30} className="text-green-600" />
                      </div>

                      <div className="text-left">
                        <h4 className="font-semibold break-all">
                          {zipFile.name}
                        </h4>

                        <p className="text-sm text-slate-500">
                          {(zipFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setZipFile(null)}
                      className="w-11 h-11 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center"
                    >
                      <X size={18} className="text-red-600" />
                    </button>
                  </div>
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
                    Upload Project
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
