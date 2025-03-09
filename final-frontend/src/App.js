import React, { useState, useEffect } from "react";
import { Link, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import Login from "./components/Login";
import ProjectDetail from "./components/ProjectDetail";
import ContactUs from "./components/ContactUs";
import Task from "./components/Task";
import ProjectManagementUses from "./components/ProjectManagementUses"; // Import the new component

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [projects, setProjects] = useState([]);
  const [userCredentials, setUserCredentials] = useState({ email: "", password: "" });
  const [backendStatus, setBackendStatus] = useState("Checking...");

  // ✅ Fetch projects from backend when the app loads
  useEffect(() => {
    fetch("http://localhost:9004/api/projects")
      .then((response) => {
        console.log("🌐 Projects API Response Status:", response.status);
        if (!response.ok) throw new Error(`Failed to fetch projects: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        console.log("📥 Projects Fetched from Backend:", data);
        if (Array.isArray(data)) {
          setProjects(data);
        } else {
          console.error("❌ Invalid data format received:", data);
        }
      })
      .catch((error) => {
        console.error("❌ Error fetching projects:", error);
      });
  }, []);

  // ✅ Check backend connection when the app loads
  useEffect(() => {
    fetch("http://localhost:9004/api/test")
      .then((response) => {
        console.log("🌐 Backend Response Status:", response.status);
        if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        console.log("📥 Backend Response:", data);
        setBackendStatus(data.message ? `✅ Backend Connected: ${data.message}` : "❌ Backend Response Missing 'message' Key");
      })
      .catch((error) => {
        console.error("❌ Backend connection failed:", error);
        setBackendStatus("❌ Backend Not Connected");
      });
  }, []);

  const handleLogin = (email, password) => {
    setUserCredentials({ email, password });
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserCredentials({ email: "", password: "" });
  };

  // ✅ Function to add project to backend
  const addProject = async (newProject) => {
    console.log("📤 Sending project to backend:", newProject);
    
    try {
      const response = await fetch("http://localhost:9004/api/project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProject),
      });

      if (!response.ok) {
        throw new Error(`Failed to add project: ${response.status}`);
      }

      const savedProject = await response.json();
      console.log("✅ Project Added:", savedProject);

      // ✅ Update state to reflect new project
      setProjects((prevProjects) => [...prevProjects, savedProject]);
    } catch (error) {
      console.error("❌ Error adding project:", error);
    }
  };

  // ✅ Function to delete a project
  const deleteProject = async (projectId) => {
    console.log("🗑 Deleting project with ID:", projectId);

    try {
      const response = await fetch(`http://localhost:9004/api/project/${projectId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete project: ${response.status}`);
      }

      console.log("✅ Project Deleted Successfully");

      // ✅ Update state to remove deleted project
      setProjects((prevProjects) => prevProjects.filter((project) => project._id !== projectId));
    } catch (error) {
      console.error("❌ Error deleting project:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} showLoginButton={!isAuthenticated} />

      <div className="flex flex-1">
        <Sidebar projects={projects} onAddProject={addProject} onDeleteProject={deleteProject} />

        <div className="flex-1 p-6">
          <Toaster position="top-right" gutter={8} />

          {/* ✅ Show Backend Connection Status */}
          <div className="p-4 bg-gray-100 text-center text-lg font-semibold">
            {backendStatus}
          </div>

          <Routes>
            <Route
              path="/project/:projectId"
              element={isAuthenticated ? <ProjectDetail projects={projects} /> : <Login onLogin={handleLogin} />}
            />
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  <Task />
                ) : (
                  <div className="text-center">
                    <h2 className="text-2xl font-semibold mb-4">Welcome to Project Manager</h2>
                    <p className="mb-6 text-gray-600">
                      Get started by managing your projects here. You can view, create, and track the progress of all your projects.
                    </p>
                    <p className="text-lg">
                      Please select or create a new project. To start managing projects, you need to log in first.
                    </p>

                    {/* Link to Project Management Uses */}
                    <div className="mt-6">
                      <Link to="/project-management-uses" className="text-blue-400 hover:text-blue-600">
                        Learn About Project Management Uses
                      </Link>
                    </div>
                  </div>
                )
              }
            />
            <Route path="/contact-us" element={<ContactUs />} />
            {/* New Route for Project Management Uses */}
            <Route path="/project-management-uses" element={<ProjectManagementUses />} />
          </Routes>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default App;
