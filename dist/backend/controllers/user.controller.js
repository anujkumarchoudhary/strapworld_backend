"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = createUser;
exports.loginUser = loginUser;
exports.getUsers = getUsers;
exports.getUserById = getUserById;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = __importDefault(require("../model/user.model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// CREATE USER
async function createUser(req, res, next) {
    try {
        const { name, email, password, role, isActive } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email, password and role are required",
            });
        }
        // if (!mongoose.Types.ObjectId.isValid(role)) {
        //   return res.status(400).json({
        //     success: false,
        //     message: "Invalid role ID",
        //   });
        // }
        const existingUser = await user_model_1.default.findOne({
            email: String(email).trim().toLowerCase(),
        });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already exists",
            });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 12);
        const user = await user_model_1.default.create({
            name,
            email,
            password: hashedPassword,
            isActive: isActive ?? true,
        });
        const result = await user_model_1.default.findById(user._id)
            .select("-password");
        return res.status(201).json({
            success: true,
            message: "User created successfully",
            data: result,
        });
    }
    catch (error) {
        return next(error);
    }
}
// LOGIN USER
async function loginUser(req, res, next) {
    try {
        const { email, password } = req.body;
        if (typeof email !== "string" ||
            typeof password !== "string" ||
            !email.trim() ||
            !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }
        const user = await user_model_1.default.findOne({
            email: email.trim().toLowerCase(),
        })
            .select("+password");
        // .populate("role", "name permissions");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }
        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: "Your account is inactive",
            });
        }
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            return res.status(500).json({
                success: false,
                message: "Authentication configuration error",
            });
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id.toString() }, secret, { expiresIn: "1d" });
        const userData = user.toObject();
        delete userData.password;
        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: userData,
        });
    }
    catch (error) {
        return next(error);
    }
}
// GET ALL USERS
async function getUsers(req, res, next) {
    try {
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
        const skip = (page - 1) * limit;
        const filter = {};
        if (req.query.search) {
            const search = String(req.query.search).trim();
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ];
        }
        const [users, total] = await Promise.all([
            user_model_1.default.find(filter)
                .select("-password")
                .populate("role", "name permissions")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            user_model_1.default.countDocuments(filter),
        ]);
        return res.status(200).json({
            success: true,
            data: users,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    }
    catch (error) {
        return next(error);
    }
}
// GET USER BY ID
async function getUserById(req, res, next) {
    try {
        const { id } = req.params;
        if (typeof id !== "string" || !mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID",
            });
        }
        const user = await user_model_1.default.findById(id)
            .select("-password")
            .populate("role", "name permissions");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        return res.status(200).json({
            success: true,
            data: user,
        });
    }
    catch (error) {
        return next(error);
    }
}
// UPDATE USER
async function updateUser(req, res, next) {
    try {
        const { id } = req.params;
        const { name, email, password, role, isActive } = req.body;
        if (typeof id !== "string" || !mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID",
            });
        }
        const updates = {};
        if (name !== undefined)
            updates.name = name;
        if (email !== undefined) {
            updates.email = String(email).trim().toLowerCase();
        }
        if (isActive !== undefined)
            updates.isActive = isActive;
        if (role !== undefined) {
            if (!mongoose_1.default.Types.ObjectId.isValid(role)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid role ID",
                });
            }
            updates.role = role;
        }
        if (password !== undefined) {
            if (typeof password !== "string" || password.length < 8) {
                return res.status(400).json({
                    success: false,
                    message: "Password must contain at least 8 characters",
                });
            }
            updates.password = await bcryptjs_1.default.hash(password, 12);
        }
        if (email !== undefined) {
            const existingUser = await user_model_1.default.findOne({
                email: updates.email,
                _id: { $ne: id },
            });
            if (existingUser) {
                return res.status(409).json({
                    success: false,
                    message: "Email already exists",
                });
            }
        }
        const user = await user_model_1.default.findByIdAndUpdate(id, { $set: updates }, { new: true, runValidators: true })
            .select("-password")
            .populate("role", "name permissions");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: user,
        });
    }
    catch (error) {
        return next(error);
    }
}
// DELETE USER
async function deleteUser(req, res, next) {
    try {
        const { id } = req.params;
        if (typeof id !== "string" || !mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID",
            });
        }
        const user = await user_model_1.default.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    }
    catch (error) {
        return next(error);
    }
}
