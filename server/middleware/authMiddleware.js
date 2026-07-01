import jwt from 'jsonwebtoken';

const protect = async (req, res, next) => {
    // Extract token directly from the application cookies container
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: "Access unauthorized. Authentication token is missing." 
        });
    }

    try {
        // Validate signature integrity against environmental cryptokey
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Bind decrypted user footprint payload onto the request context pipeline
        req.user = decoded;
        next();
    } catch (error) {
        console.error("JWT Verification Security Failure:", error.message);
        return res.status(401).json({ 
            success: false, 
            message: "Access unauthorized. Token validation failed or expired." 
        });
    }
};
 
export default protect;