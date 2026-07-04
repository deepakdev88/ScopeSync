import jwt from 'jsonwebtoken';

const protect = async (req, res, next) => {
    // Get token from cookie
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: "Please log in." 
        });
    }

    try {
        // Verfiy token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Attach user data to the request
        req.user = decoded;
        next();
    } catch (error) {
        console.error("Token verification failed:", error.message);
        return res.status(401).json({ 
            success: false, 
            message: "Session expired. Please log in again" 
        });
    }
};
 
export default protect;