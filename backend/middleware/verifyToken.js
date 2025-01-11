const jwt = require('jsonwebtoken');


module.exports.verifyToken = async (req, res, next) => {
    try {
        // Check if the token exists in cookies
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ error: "Unauthorized: No token provided" });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_TOKEN);

        // Attach userId to the request for later use
        if (!decoded.userId) {
            return res.status(401).json({ error: "Unauthorized: Invalid token payload" });
        }

        req.userId = decoded.userId;
        req.token = token;

        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error("Error verifying token:", error.message);
        res.status(401).json({ error: "Unauthorized: Token verification failed" });
    }
};
