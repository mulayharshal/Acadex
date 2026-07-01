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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
