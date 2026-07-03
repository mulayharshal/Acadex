import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Save,
  X,
  FileText,
  Tag,
  AlignLeft
} from "lucide-react";

import {
  getNoteById,
  updateNote
} from "../services/noteService";

const categories = [
  "Programming",
  "Java",
  "Python",
  "JavaScript",
  "React",
  "Spring Boot",
  "Database",
  "Operating System",
  "Computer Network",
  "DBMS",
  "CN",
  "AI / ML",
  "Data Science",
  "Cloud Computing",
  "Cyber Security",
  "Compiler Design",
  "Software Engineering",
  "Semester 1",
  "Semester 2",
  "Semester 3",
  "Semester 4",
  "Semester 5",
  "Semester 6",
  "Semester 7",
  "Semester 8",
  "Interview Preparation",
  "Placement",
  "Other"
];

export default function EditNote() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [showCustomCategory, setShowCustomCategory] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    tags: ""
  });

  useEffect(() => {
    loadNote();
  }, []);

  const loadNote = async () => {

    try {

      const res = await getNoteById(id);

      if (res.success) {

        const note = res.data;

        const isCustom = !categories.includes(note.category);

        setShowCustomCategory(isCustom);

        setFormData({
          title: note.title || "",
          description: note.description || "",
          category: note.category || "",
          tags: note.tags || ""
        });

      }

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }

  };

  const handleChange = (e) => {

    const { name, value } = e.target;

    if (name === "category") {

      if (value === "Other") {

        setShowCustomCategory(true);

        setFormData(prev => ({
          ...prev,
          category: ""
        }));

      } else {

        setShowCustomCategory(false);

        setFormData(prev => ({
          ...prev,
          category: value
        }));

      }

      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

  };

  const handleSubmit = async () => {

    setSaving(true);

    try {

      const res = await updateNote(id, formData);

      if (res.success) {

        alert("Note updated successfully");

        navigate("/my-notes");

      } else {

        alert(res.message);

      }

    } catch (err) {

      console.error(err);

      alert("Something went wrong");

    } finally {

      setSaving(false);

    }

  };

  if (loading) {

    return (

      <div className="min-h-screen flex justify-center items-center">

        <div className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"/>

      </div>

    );

  }

  return (

    <div className="min-h-screen bg-slate-100 py-10">

      <div className="max-w-5xl mx-auto px-6">

        <motion.div

          initial={{opacity:0,y:20}}

          animate={{opacity:1,y:0}}

          className="bg-white rounded-3xl shadow-xl overflow-hidden"

        >

          <div className="bg-gradient-to-r from-blue-700 to-indigo-700 px-10 py-10">

            <h1 className="text-4xl font-bold text-white">

              Edit Note

            </h1>

            <p className="text-blue-100 mt-2">

              Update your note information

            </p>

          </div>

          <div className="p-10 space-y-8">

            <div className="rounded-3xl bg-blue-50 border border-blue-100 p-8">

              <div className="flex items-center gap-3 mb-6">

                <FileText className="text-blue-600"/>

                <h2 className="text-2xl font-bold">

                  Basic Information

                </h2>

              </div>

              <div className="space-y-6">

                <div>

                  <label className="font-semibold text-slate-700">

                    Title

                  </label>

                  <input

                    type="text"

                    name="title"

                    value={formData.title}

                    onChange={handleChange}

                    className="mt-2 w-full rounded-2xl border border-slate-300 px-5 py-3 focus:ring-2 focus:ring-blue-500 outline-none"

                  />

                </div>

                <div>

                  <label className="font-semibold text-slate-700">

                    Category

                  </label>

                  <select

                    name="category"

                    value={showCustomCategory ? "Other" : formData.category}

                    onChange={handleChange}

                    className="mt-2 w-full rounded-2xl border border-slate-300 px-5 py-3 focus:ring-2 focus:ring-blue-500 outline-none"

                  >

                    <option value="">Select Category</option>

                    {categories.map(cat=>(

                      <option key={cat}>{cat}</option>

                    ))}

                  </select>

                  {showCustomCategory && (

                    <input

                      className="mt-4 w-full rounded-2xl border border-slate-300 px-5 py-3 focus:ring-2 focus:ring-blue-500 outline-none"

                      placeholder="Enter Custom Category"

                      value={formData.category}

                      onChange={(e)=>setFormData(prev=>({...prev,category:e.target.value}))}

                    />

                  )}

                </div>
                              </div>

            </div>

            {/* Description */}

            <div className="rounded-3xl bg-white border border-slate-200 p-8">

              <div className="flex items-center gap-3 mb-6">

                <AlignLeft className="text-indigo-600" />

                <h2 className="text-2xl font-bold text-slate-800">
                  Description
                </h2>

              </div>

              <textarea
                rows={10}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Write detailed description..."
                className="w-full rounded-2xl border border-slate-300 px-5 py-4 resize-none focus:ring-2 focus:ring-blue-500 outline-none"
              />

            </div>

            {/* Tags */}

            <div className="rounded-3xl bg-purple-50 border border-purple-100 p-8">

              <div className="flex items-center gap-3 mb-6">

                <Tag className="text-purple-600" />

                <h2 className="text-2xl font-bold text-slate-800">
                  Tags
                </h2>

              </div>

              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="java, spring boot, backend..."
                className="w-full rounded-2xl border border-slate-300 px-5 py-3 focus:ring-2 focus:ring-purple-500 outline-none"
              />

              <p className="text-sm text-slate-500 mt-3">
                Separate multiple tags using commas (,)
              </p>

            </div>

            {/* Buttons */}

            <div className="flex flex-col md:flex-row gap-5">

              <button
                onClick={() => navigate("/my-notes")}
                className="flex-1 py-4 rounded-2xl border border-slate-300 font-semibold hover:bg-slate-100 transition flex items-center justify-center gap-2"
              >

                <X size={20} />

                Cancel

              </button>

              <button
                onClick={handleSubmit}
                disabled={saving}
                className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2 disabled:opacity-70"
              >

                {saving ? (

                  <>
                    <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    Saving...
                  </>

                ) : (

                  <>
                    <Save size={20} />
                    Save Changes
                  </>

                )}

              </button>

            </div>

          </div>

        </motion.div>

      </div>

    </div>

  );

}