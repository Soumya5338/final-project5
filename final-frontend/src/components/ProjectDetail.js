import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const API_BASE_URL = "http://localhost:9004/api";

const ProjectDetail = () => {
  const { projectId } = useParams(); // ✅ Get project ID from URL
  const [project, setProject] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("📡 Fetching Project:", projectId);

    fetch(`${API_BASE_URL}/project/${projectId}`)
      .then((response) => {
        console.log("🌐 Project API Response Status:", response.status);
        if (!response.ok) throw new Error(`Project not found: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        console.log("📥 Project Fetched:", data);
        setProject(data);
      })
      .catch((error) => {
        console.error("❌ Error fetching project:", error);
        setError(error.message);
      });
  }, [projectId]);

  if (error) {
    return <div className="text-red-500">❌ {error}</div>;
  }

  if (!project) {
    return <div className="text-gray-500">⌛ Loading project...</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">{project.title}</h2>
      <p className="text-gray-700">{project.description}</p>
    </div>
  );
};

export default ProjectDetail;
