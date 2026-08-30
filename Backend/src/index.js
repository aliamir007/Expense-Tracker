import dotenv from "dotenv";
import app from "./app.js";
import db from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await db();

        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Server startup failed:", error.message);
        process.exit(1);
    }
};

startServer();