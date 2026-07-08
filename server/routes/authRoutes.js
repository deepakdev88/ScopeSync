import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Register a new user 
// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required." });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "An account with this email already exists." });
        }

        const newUser = await User.create({ email, password });
        return res.status(201).json({
            success: true,
            message: "Account created successfully.",
            data: { id: newUser._id, email: newUser.email }
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Something went wrong. please try again.",
        });
    }
});

// @desc    Log in and auth cookie
// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required." });
        }

        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ success: false, message: "Incorrect email or password." });
        }

        
        const token = jwt.sign(
            { id: user._id.toString() },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        const isProd = process.env.NODE_ENV === 'production';

        res.cookie('token', token, {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? 'none' : 'lax',
            path: '/',
            maxAge: 24 * 60 * 60 * 1000
        });
        return res.status(200).json({ success: true, message: "Logged in successfully." });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Internal server authentication error." });
    }
});

// @desc    Log out and clear auth cookie
// @route   POST /api/auth/logout
router.post('/logout', (req, res) => {
    const isProd = process.env.NODE_ENV === 'production';
    res.clearCookie('token', {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
        path: '/'
    });
    return res.status(200).json({ success: true, message: "Logged out successfully." });
});

// @desc    Check if session is valid
// @route   GET /api/auth/verify
router.get('/verify', protect, (req, res) => {
    return res.status(200).json({ success: true, message: "Session is valid." });
});

export default router;