import jwt from "jsonwebtoken";

const protect = (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        if (!req.headers.authorization.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Invalid authorization format"
            });
        }

        const token = req.headers.authorization.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.userId = decoded.userId;

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};

export default protect;
