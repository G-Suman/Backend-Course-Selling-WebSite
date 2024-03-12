import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const userMiddleware = (req, res, next) => {
    try {
        const token = extractBearerToken(req);

        if (!token) {
            return sendErrorResponse(res, 401, "Invalid or missing authorization token");
        }

        const decodedToken = jwt.verify(token, process.env.Secret);

        if (!decodedToken || !decodedToken.userId) {
            return sendErrorResponse(res, 403, "Unauthorized access");
        }

        req.userId = decodedToken.userId;
        next();
    } catch (err) {
        console.error("Error in userMiddleware:", err);
        return sendErrorResponse(res, 500, "Internal server error");
    }
};

const extractBearerToken = (req) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
        return null;
    }
    return authHeader.split(" ")[1];
};

const sendErrorResponse = (res, statusCode, message) => {
    return res.status(statusCode).json({ error: message });
};

export default userMiddleware;
