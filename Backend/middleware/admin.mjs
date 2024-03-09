import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const adminMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer")) {
            return res.status(401).json({ error: "Invalid or missing authorization token" });
        }

        const tokenArray = authHeader.split(" ");
        if (tokenArray.length !== 2) {
            return res.status(401).json({ error: "Invalid authorization format" });
        }

        const token = tokenArray[1];
        const decodedToken = jwt.verify(token, process.env.Secret);

        if (!decodedToken.userId) {
            return res.status(403).json({ error: "Unauthorized access" });
        }
        req.userId = decodedToken.userId;

        next();
    } catch (err) {
        console.error("Error in adminMiddleware:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
};


export default adminMiddleware;
