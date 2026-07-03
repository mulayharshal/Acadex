import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import NoteDetail from "./pages/NoteDetail";
import ProjectDetail from "./pages/ProjectDetail";
import UploadNote from "./pages/UploadNote";
import UploadProject from "./pages/UploadProject";
import MyNotes from "./pages/MyNotes";
import MyProjects from "./pages/MyProjects";
import EditProfile from "./pages/EditProfile";
import EditNote from "./pages/EditNote";
import EditProject from "./pages/EditProject";
import SavedNotes from "./pages/SavedNotes";
import SavedProjects from "./pages/SavedProjects";


function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/notes/:id" element={<NoteDetail />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/upload-note" element={<UploadNote />} />
        <Route path="/upload-project" element={<UploadProject />} />
        <Route path="/my-notes" element={<MyNotes />} />
        <Route path="/my-projects" element={<MyProjects />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/notes/edit/:id" element={<EditNote />} />
        <Route path="/projects/edit/:id" element={<EditProject />} />
        <Route path="/saved-notes" element={<SavedNotes />} />
        <Route path="/saved-projects" element={<SavedProjects />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
