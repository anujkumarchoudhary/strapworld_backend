"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const next_1 = __importDefault(require("next"));
const cors_1 = __importDefault(require("cors"));
const database_1 = require("./backend/config/database");
const product_routes_1 = __importDefault(require("./backend/routes/product.routes"));
const blog_routes_1 = __importDefault(require("./backend/routes/blog.routes"));
const enquiry_routes_1 = __importDefault(require("./backend/routes/enquiry.routes"));
// import errorMiddleware from "./server/middleware/error.middleware";
const dev = process.env.NODE_ENV !== "production";
const hostname = "0.0.0.0";
const port = Number(process.env.PORT) || 4000;
const nextApp = (0, next_1.default)({
    dev,
    hostname,
    port,
});
const handle = nextApp.getRequestHandler();
const Base = "/api/v1/";
const startServer = async () => {
    try {
        await (0, database_1.connectDB)();
        await nextApp.prepare();
        const app = (0, express_1.default)();
        // =========================
        // Middleware
        // =========================
        app.use((0, cors_1.default)({
            origin: true,
            credentials: true,
        }));
        app.use(express_1.default.json({ limit: "10mb" }));
        app.use(express_1.default.urlencoded({
            extended: true,
            limit: "10mb",
        }));
        app.use(`${Base}products`, product_routes_1.default);
        app.use(`${Base}blogs`, blog_routes_1.default);
        app.use(`${Base}enquiries`, enquiry_routes_1.default);
        // =========================
        // Health Check
        // =========================
        app.get(`${Base}health`, (req, res) => {
            res.status(200).json({
                success: true,
                message: "Server is running",
                environment: process.env.NODE_ENV,
            });
        });
        // =========================
        // API Routes
        // =========================
        // app.use("/v1/api/users", userRoutes);
        // =========================
        // Error Middleware
        // =========================
        // app.use(errorMiddleware);
        // =========================
        // Next.js
        // =========================
        app.use((req, res) => {
            return handle(req, res);
        });
        // =========================
        // Start Server
        // =========================
        app.listen(port, hostname, () => {
            console.log(`
========================================
Server started successfully
========================================

Environment : ${process.env.NODE_ENV}
Port        : ${port}
URL         : http://localhost:${port}

Frontend:
http://localhost:${port}

API:
http://localhost:${port}/v1/api

Health:
http://localhost:${port}/health

========================================
      `);
        });
    }
    catch (error) {
        console.error("Server startup failed:", error);
        process.exit(1);
    }
};
startServer();
