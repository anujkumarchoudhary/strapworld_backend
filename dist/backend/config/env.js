"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const envFile = process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";
const result = dotenv_1.default.config({
    path: envFile,
});
if (result.error) {
    console.error(`❌ Failed to load ${envFile}`);
    throw result.error;
}
console.log(`◇ Loaded environment from ${envFile}`);
