import express from "express";
import joi from "joi";
import mongoose from "mongoose";
import Project from "../models/index.js";

const api = express.Router();

// ✅ Get all projects
api.get('/projects', async (req, res) => {
    try {
        const data = await Project.find({}, { task: 0, __v: 0, updatedAt: 0 });
        console.log("📤 Sending projects:", data);
        res.json(data);
    } catch (error) {
        console.error("❌ Error fetching projects:", error);
        res.status(500).json({ error: true, message: "Server error" });
    }
});

// ✅ Get project by ID
api.get('/project/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(422).json({ error: true, message: "Invalid project ID" });
        }

        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ error: true, message: "Project not found" });

        console.log("📤 Sending project:", project);
        res.json(project);
    } catch (error) {
        console.error("❌ Error fetching project:", error);
        res.status(500).json({ error: true, message: "Server error" });
    }
});

// ✅ Create a new project
api.post('/project', async (req, res) => {
    console.log("📥 Received request to create project:", req.body);

    // Validate input
    const schema = joi.object({
        title: joi.string().min(3).max(30).required(),
        description: joi.string().required(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
        console.error("❌ Validation error:", error.details);
        return res.status(422).json({ error: true, message: error.details[0].message });
    }

    try {
        const newProject = new Project(value);
        const savedProject = await newProject.save();
        console.log("✅ Project saved in MongoDB:", savedProject);
        res.status(201).json(savedProject);
    } catch (err) {
        console.error("❌ MongoDB Save Error:", err);
        res.status(500).json({ error: true, message: "Database error" });
    }
});

// ✅ Delete project
api.delete('/project/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(422).json({ error: true, message: "Invalid project ID" });
        }

        const deletedProject = await Project.findByIdAndDelete(req.params.id);
        if (!deletedProject) return res.status(404).json({ error: true, message: "Project not found" });

        console.log("✅ Project deleted:", deletedProject);
        res.json({ message: "Project deleted successfully" });
    } catch (error) {
        console.error("❌ Error deleting project:", error);
        res.status(500).json({ error: true, message: "Server error" });
    }
});

// ✅ Get all tasks for a project
api.get('/project/:id/task', async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(422).json({ error: true, message: "Invalid project ID" });
    }

    try {
        const project = await Project.findById(req.params.id, { task: 1 });
        if (!project) return res.status(404).json({ error: true, message: "Project not found" });

        console.log("📤 Sending tasks:", project.task);
        res.json(project.task);
    } catch (error) {
        console.error("❌ Error fetching tasks:", error);
        res.status(500).json({ error: true, message: "Server error" });
    }
});

export default api;
