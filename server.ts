import "dotenv/config";

import express from "express";
import next from "next";
import cors from "cors";
import { connectDB } from "./backend/config/database";
import productRoutes from "./backend/routes/product.routes";
import blogRoutes from "./backend/routes/blog.routes";
import enquirieRoutes from "./backend/routes/enquiry.routes";
// import errorMiddleware from "./server/middleware/error.middleware";

const dev = process.env.NODE_ENV !== "production";

const hostname = "0.0.0.0";

const port = Number(process.env.PORT) || 4000;

const nextApp = next({
  dev,
  hostname,
  port,
});

const handle = nextApp.getRequestHandler();

const Base = "/api/v1/";

const startServer = async () => {
  try {
    await connectDB();

    await nextApp.prepare();

    const app = express();

    // =========================
    // Middleware
    // =========================

    app.use(
      cors({
        origin: true,
        credentials: true,
      }),
    );

    app.use(express.json({ limit: "10mb" }));

    app.use(
      express.urlencoded({
        extended: true,
        limit: "10mb",
      }),
    );

    app.use(`${Base}products`, productRoutes);
    app.use(`${Base}blogs`, blogRoutes);
    app.use(`${Base}enquiries`, enquirieRoutes);

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
  } catch (error) {
    console.error("Server startup failed:", error);

    process.exit(1);
  }
};

startServer();
