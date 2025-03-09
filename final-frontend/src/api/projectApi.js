import axios from "axios";

const API_BASE_URL = "http://localhost:9004/api"; // Update this if using a deployed backend

// Fetch all projects
export const getProjects = async () => {
    try {
        console.log("Fetching projects from API...");
        const response = await axios.get(`${API_BASE_URL}/projects`);
        console.log("Projects fetched successfully:", response.data);
        return response.data;  
    } catch (error) {
        if (error.response) {
            console.error("Server error:", error.response.data);
        } else if (error.request) {
            console.error("No response from server:", error.request);
        } else {
            console.error("Unexpected error:", error.message);
        }
        return { error: true, message: "Failed to fetch projects" };
    }
};

// Add a new project  
export const addProject = async (ProjectData) => {
    try {
        console.log("Sending new project to API:", ProjectData);
        const response = await axios.post(`${API_BASE_URL}/project`, ProjectData);
        console.log("Project added successfully:", response.data);
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error("Server error:", error.response.data);
        } else if (error.request) {
            console.error("No response from server:", error.request);
        } else {
            console.error("Unexpected error:", error.message);
        }
        return { error: true, message: "Failed to add project" };
    }
};

