import "dotenv/config";

import express from "express";
import cors from "cors";
import { connectDB } from "./backend/config/database";
import productRoutes from "./backend/routes/product.routes";
import blogRoutes from "./backend/routes/blog.routes";
import enquirieRoutes from "./backend/routes/enquiry.routes";

const app = express();

const port = Number(process.env.PORT) || 4000;

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

const Base = "/api/v1/";

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

// Start Express after connecting to MongoDB
async function startServer() {
  try {
    await connectDB();

    app.listen(port, "0.0.0.0", () => {
      console.log(`Backend running on port ${port}`);
    });
  } catch (error) {
    console.error("Backend startup failed:", error);
    process.exit(1);
  }
}

startServer();
