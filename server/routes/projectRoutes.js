import Project from "../models/Project.js";
import express from "express";

const router = express.Router()

router.post('/projects', async (req, res) => {
    try {
        // console.log("data from frontend ",req.body,req)

        const newProject = await Project.create(req.body)
        res.status(201).json({ success: true, data: newProject });
    } catch (error) {
        console.error("Error in saving ", error)
        res.status(500).json({ success: false, message: "Server Error, Data save nahi hua!" });
    }
})

router.put('/projects/:id', async (req, res) => {
    try {
        const { phases } = req.body; // Frontend se naya phases array aayega
        const updatedProject = await Project.findByIdAndUpdate(
            req.params.id,
            { phases },
            { new: true } // Ye naya saved object wapas dega
        );
        
        res.json({ success: true, data: updatedProject });
    } catch (error) {
        res.status(500).json({ success: false, message: "Update fail ho gaya!" });
    }
});

router.get('/projects', async (req, res) => {
    try {
        const allProjects = await Project.find(); // Database se saare projects uthao
        res.status(200).json({ success: true, data: allProjects });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching projects" });
    }
});

// Naya GET route for single project
router.get('/projects/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ success: false, message: "Project nahi mila" });
        res.status(200).json({ success: true, data: project });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// Add this in your projectRoutes.js
router.delete('/projects/:id', async (req, res) => {
    try {
        const deletedProject = await Project.findByIdAndDelete(req.params.id);
        if (!deletedProject) {
            return res.status(404).json({ success: false, message: "Project nahi mila" });
        }
        res.status(200).json({ success: true, message: "Project delete ho gaya" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

export default router