"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PERMISSIONS = void 0;
const mongoose_1 = require("mongoose");
exports.PERMISSIONS = [
    "users:create",
    "users:read",
    "users:update",
    "users:delete",
    "roles:create",
    "roles:read",
    "roles:update",
    "roles:delete",
    "products:create",
    "products:read",
    "products:update",
    "products:delete",
];
const roleSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    permissions: {
        type: [String],
        enum: exports.PERMISSIONS,
        default: [],
    },
    isSystem: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
exports.default = mongoose_1.models.Role || (0, mongoose_1.model)("Role", roleSchema);
