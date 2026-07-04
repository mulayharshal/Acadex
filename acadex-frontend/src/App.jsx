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
import VerifyOtp from "./pages/VerifyOtp";
import Notes from "./pages/Notes";
import Projects from "./pages/Projects";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notes"
          element={
            <ProtectedRoute>
              <Notes />
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <Projects />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notes/:id"
          element={
            <ProtectedRoute>
              <NoteDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects/:id"
          element={
            <ProtectedRoute>
              <ProjectDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/upload-note"
          element={
            <ProtectedRoute>
              <UploadNote />
            </ProtectedRoute>
          }
        />

        <Route
          path="/upload-project"
          element={
            <ProtectedRoute>
              <UploadProject />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-notes"
          element={
            <ProtectedRoute>
              <MyNotes />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-projects"
          element={
            <ProtectedRoute>
              <MyProjects />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-profile"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />
 
        <Route
          path="/notes/edit/:id"
          element={
            <ProtectedRoute>
              <EditNote />
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects/edit/:id"
          element={
            <ProtectedRoute>
              <EditProject />
            </ProtectedRoute>
          }
        />

        <Route
          path="/saved-notes"
          element={
            <ProtectedRoute>
              <SavedNotes />
            </ProtectedRoute>
          }
        />

        <Route
          path="/saved-projects"
          element={
            <ProtectedRoute>
              <SavedProjects />
            </ProtectedRoute>
          }
        />

        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
