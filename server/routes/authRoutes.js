import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Register a new user identity container
// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Required parameter fields missing." });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Identity register index collision. Email already exists." });
        }

        const newUser = await User.create({ email, password });
        return res.status(201).json({
            success: true,
            message: "User registration sequence verified.",
            data: { id: newUser._id, email: newUser.email }
        });
    } catch (err) {
        // 🔥 CRITICAL DEBUG: Print the exact system error message to the Node terminal
        console.error("=== CRITICAL REGISTRATION ERROR ===");
        console.error(err);
        console.error("===================================");

        return res.status(500).json({
            success: false,
            message: "Internal execution failure during registration.",
            error_details: err.message // Temporarily sending error details to help debugging
        });
    }
});

// @desc    Authenticate credentials and inject secure httpOnly cookie environment pass
// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Credentials allocation context missing." });
        }

        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ success: false, message: "Invalid cryptographic credentials alignment." });
        }

        //  FIX: Convert user._id to a clean primitive string representation
        const token = jwt.sign(
            { id: user._id.toString() }, 
            process.env.JWT_SECRET , 
            { expiresIn: '1d' }
        );

        // Inject high-security HTTP-only payload block into browser context
        res.cookie('token', token, {
            httpOnly: true,
            secure: false, // Set to true inside production deployment HTTPS environments
            sameSite: 'strict',
            path: '/',
            maxAge: 24 * 60 * 60 * 1000 // 24 Hours lifespan scope duration limits
        });

        return res.status(200).json({ success: true, message: "Authentication sequence established." });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Internal server authentication interface error." });
    }
});
// @desc    Verify session state runtime validations upon UI dashboard hydration
// @route   GET /api/auth/verify
router.get('/verify', protect, (req, res) => {
    return res.status(200).json({ success: true, message: "Session verified. Token remains valid." });
});

export default router;