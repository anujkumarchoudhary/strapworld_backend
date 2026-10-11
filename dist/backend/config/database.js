"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = connectDB;
const mongoose_1 = __importDefault(require("mongoose"));
async function connectDB() {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
        throw new Error("MONGODB_URI is not defined in environment variables");
    }
    // Reuse an existing connection.
    if (mongoose_1.default.connection.readyState === 1) {
        return;
    }
    // Wait if a connection is already being established.
    if (mongoose_1.default.connection.readyState === 2) {
        await mongoose_1.default.connection.asPromise();
        return;
    }
    try {
        await mongoose_1.default.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 10000,
            maxPoolSize: 10,
        });
        console.log("✅ MongoDB connected");
    }
    catch (error) {
        console.error("❌ MongoDB connection failed:", error);
        throw error;
    }
}
