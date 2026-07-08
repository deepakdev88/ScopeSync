import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import projectRoutes from './routes/projectRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',

    credentials: true
}));

app.use(express.json());
app.use(cookieParser()); // Parse cookies

// Database Connectivity
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB Connected successfully.");
})
.catch((err) => {
    console.error("Database connection configuration failed:", err);
});

// Route Registrations
app.use('/api', projectRoutes);
app.use('/api/auth', authRoutes);
    
app.get('/', (req, res) => {
    res.send("Backend running successfully.");
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});