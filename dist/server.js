"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const database_1 = require("./backend/config/database");
const product_routes_1 = __importDefault(require("./backend/routes/product.routes"));
const app = (0, express_1.default)();
const port = Number(process.env.PORT) || 4000;
app.use((0, cors_1.default)({
    origin: true,
    credentials: true,
}));
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({
    extended: true,
    limit: "10mb",
}));
// Health check
app.get("/health", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "Backend is running",
        environment: process.env.NODE_ENV || "production",
    });
});
// Product APIs
app.use("/api/products", product_routes_1.default);
// Start Express after connecting to MongoDB
async function startServer() {
    try {
        await (0, database_1.connectDB)();
        app.listen(port, "0.0.0.0", () => {
            console.log(`Backend running on port ${port}`);
        });
    }
    catch (error) {
        console.error("Backend startup failed:", error);
        process.exit(1);
    }
}
startServer();
