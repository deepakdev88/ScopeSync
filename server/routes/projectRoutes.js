import Project from "../models/Project.js";
import express from "express";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// @desc    Create a new project
// @route   POST /api/projects
router.post('/projects', protect, async (req, res) => {
    try {
        const projectData = {
            ...req.body,
            user: req.user.id // Attach the project to the logged-in user 
        };

        const newProject = await Project.create(projectData);
        res.status(201).json({ success: true, data: newProject });
    } catch (error) {
        console.error("Failed to create project:", error);
        res.status(500).json({ success: false, message: "Something went wrong. Please try again." });
    }
});

// @desc    Update a project's phases
// @route   PUT /api/projects/:id
router.put('/projects/:id', protect, async (req, res) => {
    try {
        const { phases } = req.body;
        const updatedProject = await Project.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            { phases },
            { returnDocument: 'after', runValidators:true }
        );

        if (!updatedProject) {
            return res.status(404).json({ success: false, message: "Project not found or you dont't have access." });
        }

        res.json({ success: true, data: updatedProject });
    } catch (error) {
        res.status(500).json({ success: false, message: "Something went wrong. Please try again." });
    }
});

// @desc    Get all projects for the logged in user
// @route   GET /api/projects
router.get('/projects', protect, async (req, res) => {
    try {
        const allProjects = await Project.find({ user: req.user.id });
        res.status(200).json({ success: true, data: allProjects });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to load projects." });
    }
});

// @desc    Get a single project by ID
// @route   GET /api/projects/:id
router.get('/projects/:id', protect, async (req, res) => {
    try {
        const project = await Project.findOne({ _id: req.params.id, user: req.user.id });
        if (!project) return res.status(404).json({ success: false, message: "Project not found." });
        res.status(200).json({ success: true, data: project });
    } catch (error) {
        res.status(500).json({ success: false, message: "Something went wrong. Please try again.." });
    }
});

// @desc    Delete all of a user project's
// @route   DELETE /api/projects
// @access  Protected
router.delete('/projects', protect, async (req, res) => {
    try {
        // Only delete projects owned by this user
        const deletionSummary = await Project.deleteMany({ user: req.user.id });

        res.status(200).json({
            success: true,
            message: "All projects deleted.",
            count: deletionSummary.deletedCount
        });
    } catch (error) {
        console.error("Failed to delete:", error);
        res.status(500).json({ success: false, message: "Something went wrong. Please try again." });
    }
});

// @desc    Delete a single project
// @route   DELETE /api/projects/:id
router.delete('/projects/:id', protect, async (req, res) => {
    try {
        const deletedProject = await Project.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        if (!deletedProject) {
            return res.status(404).json({ success: false, message: "Project not found." });
        }
        res.status(200).json({ success: true, message: "Project deleted." });
    } catch (error) {
        res.status(500).json({ success: false, message: "Something went wrong. Please try again." });
    }
});

// @desc    Delete a task
// @route   DELETE /api/tasks/:taskId
router.delete('/tasks/:taskId', protect, async (req, res) => {
    try {
        const { taskId } = req.params;

        // Find and remove the task, scoped to this user
        const updatedProject = await Project.findOneAndUpdate(
            { "phases.tasks._id": taskId, user: req.user.id },
            {
                $pull: {
                    "phases.$.tasks": { _id: taskId }
                }
            },
            { returnDocument: 'after' }
        );

        if (!updatedProject) {
            return res.status(404).json({ success: false, message: "Task not found." });
        }

        res.status(200).json({ success: true, data: updatedProject });
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: "Something went wrong. Please try again." });
    }
});

export default router;