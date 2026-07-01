import Project from "../models/Project.js";
import express from "express";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// @desc    Establish new sandbox environment project tied to current user context
// @route   POST /api/projects
router.post('/projects', protect, async (req, res) => {
    try {
        const projectData = {
            ...req.body,
            user: req.user.id // Bind project data directly to the active verified user object reference
        };

        const newProject = await Project.create(projectData);
        res.status(201).json({ success: true, data: newProject });
    } catch (error) {
        console.error("Database creation payload fault:", error);
        res.status(500).json({ success: false, message: "Internal Server Error. Persistence engine write failure." });
    }
});

// @desc    Modify phase configurations belonging exclusively to the authenticated owner
// @route   PUT /api/projects/:id
router.put('/projects/:id', protect, async (req, res) => {
    try {
        const { phases } = req.body;
        const updatedProject = await Project.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            { phases },
            { new: true }
        );

        if (!updatedProject) {
            return res.status(404).json({ success: false, message: "Resource context mutation rejected or unauthorized." });
        }

        res.json({ success: true, data: updatedProject });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal mutation interface failure." });
    }
});

// @desc    Fetch target runtime lists restricted strictly to user execution context
// @route   GET /api/projects
router.get('/projects', protect, async (req, res) => {
    try {
        const allProjects = await Project.find({ user: req.user.id });
        res.status(200).json({ success: true, data: allProjects });
    } catch (error) {
        res.status(500).json({ success: false, message: "Data extraction routine initialization failure." });
    }
});

// @desc    Retrieve individual unique documentation logs verified via access checks
// @route   GET /api/projects/:id
router.get('/projects/:id', protect, async (req, res) => {
    try {
        const project = await Project.findOne({ _id: req.params.id, user: req.user.id });
        if (!project) return res.status(404).json({ success: false, message: "Target metadata tracking parameters unmet." });
        res.status(200).json({ success: true, data: project });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal parameter processing exceptions." });
    }
});

// @desc    Wipe all project documents belonging exclusively to the authenticated user
// @route   DELETE /api/projects
// @access  Protected
router.delete('/projects', protect, async (req, res) => {
    try {
        // Multi-tenant isolation constraint: purge records targeting only the requesting user's footprint
        const deletionSummary = await Project.deleteMany({ user: req.user.id });

        res.status(200).json({
            success: true,
            message: "All isolated user repository data cleared from database indexes successfully.",
            count: deletionSummary.deletedCount
        });
    } catch (error) {
        console.error("Bulk records removal operations execution breakdown:", error);
        res.status(500).json({ success: false, message: "Server error. Failed to execute repository clean routines." });
    }
});

// @desc    Purge system parameters safely matching exact user and reference constraints
// @route   DELETE /api/projects/:id
router.delete('/projects/:id', protect, async (req, res) => {
    try {
        const deletedProject = await Project.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        if (!deletedProject) {
            return res.status(404).json({ success: false, message: "Data block targeted for removal missing or unauthorized." });
        }
        res.status(200).json({ success: true, message: "Data target structurally destroyed from system records." });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal database destruction pipeline breakdown." });
    }
});

// @desc    Isolate and drop atomic sub-task objects embedded inside deep phase document paths
// @route   DELETE /api/tasks/:taskId
router.delete('/tasks/:taskId', protect, async (req, res) => {
    try {
        const { taskId } = req.params;

        // Perform multi-tenant isolated sub-document lookup updates
        const updatedProject = await Project.findOneAndUpdate(
            { "phases.tasks._id": taskId, user: req.user.id },
            {
                $pull: {
                    "phases.$.tasks": { _id: taskId }
                }
            },
            { new: true }
        );

        if (!updatedProject) {
            return res.status(404).json({ success: false, message: "Sub-node metadata element lookup structural breakdown." });
        }

        res.status(200).json({ success: true, data: updatedProject });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;