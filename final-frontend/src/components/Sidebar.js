import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ projects, onAddProject, onDeleteProject }) => {
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");

  useEffect(() => {
    console.log("📜 Sidebar Received Projects:", projects); // ✅ Debugging
  }, [projects]); // ✅ Log whenever `projects` updates

  const handleAddProject = () => {
    if (newProjectName && newProjectDescription) {
      const newProject = {
        title: newProjectName,
        description: newProjectDescription,
      };
      onAddProject(newProject); // ✅ Send new project to backend
      setNewProjectName(""); // ✅ Reset input fields
      setNewProjectDescription("");
    }
  };

  return (
    <div className="w-64 bg-gray-800 text-white p-6">
      <h2 className="text-lg font-semibold mb-6">Projects</h2>

      {/* ✅ Debugging: Display current projects */}
      <p className="text-gray-400">Total Projects: {projects.length}</p>

      <ul>
        {projects.length > 0 ? (
          projects.map((project) => (
            <li key={project._id} className="flex justify-between items-center">
              <Link
                to={`/project/${project._id}`}
                className="block py-2 px-4 hover:bg-gray-700 rounded"
              >
                {project.title}
              </Link>
              <button
                onClick={() => onDeleteProject(project._id)}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </li>
          ))
        ) : (
          <p className="text-gray-400">No projects found.</p>
        )}
      </ul>

      {/* Add New Project */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">Add New Project</h3>
        <input
          type="text"
          placeholder="Project Name"
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
          className="w-full p-2 mb-2 text-black"
        />
        <textarea
          placeholder="Project Description"
          value={newProjectDescription}
          onChange={(e) => setNewProjectDescription(e.target.value)}
          className="w-full p-2 mb-2 text-black"
        />
        <button
          onClick={handleAddProject}
          className="w-full bg-blue-500 text-white py-2 rounded mt-2"
        >
          Add Project
        </button>
      </div>
    </div>
  );
};

export default Sidebar;


