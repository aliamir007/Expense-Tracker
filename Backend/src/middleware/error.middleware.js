const errorMiddleware = (err, req, res, next) => {
    console.error(err.stack || err.message);

    // Mongoose validation errors
    if (err.name === "ValidationError") {
        const message = Object.values(err.errors)
            .map((val) => val.message)
            .join(", ");
        return res.status(400).json({
            success: false,
            message
        });
    }

    // Mongoose duplicate key error (e.g. email already registered)
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue || {})[0] || "field";
        return res.status(409).json({
            success: false,
            message: `${field} already exists`
        });
    }

    // Mongoose invalid ObjectId (e.g. bad :id in a route)
    if (err.name === "CastError") {
        return res.status(400).json({
            success: false,
            message: "Invalid ID format"
        });
    }

    const statusCode = err.statusCode && err.statusCode >= 400 ? err.statusCode : 500;

    return res.status(statusCode).json({
        success: false,
        message: err.message || "Something went wrong on the server"
    });
};

export default errorMiddleware;
