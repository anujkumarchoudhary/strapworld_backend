"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCategory = createCategory;
exports.getCategories = getCategories;
exports.getCategoryById = getCategoryById;
exports.updateCategory = updateCategory;
exports.deleteCategory = deleteCategory;
const mongoose_1 = __importDefault(require("mongoose"));
const category_model_1 = __importDefault(require("../model/category.model"));
// CREATE CATEGORY
async function createCategory(req, res, next) {
    try {
        const { name, slug, description, image, isActive } = req.body;
        if (typeof name !== "string" || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Category name is required",
            });
        }
        const normalizedSlug = typeof slug === "string" && slug.trim()
            ? slug.trim().toLowerCase()
            : name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
        const existingCategory = await category_model_1.default.findOne({
            $or: [
                { name: name.trim() },
                { slug: normalizedSlug },
            ],
        });
        if (existingCategory) {
            return res.status(409).json({
                success: false,
                message: "Category name or slug already exists",
            });
        }
        const category = await category_model_1.default.create({
            name: name.trim(),
            slug: normalizedSlug,
            description,
            image,
            isActive: isActive ?? true,
        });
        return res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: category,
        });
    }
    catch (error) {
        return next(error);
    }
}
// GET ALL CATEGORIES
async function getCategories(req, res, next) {
    try {
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
        const skip = (page - 1) * limit;
        const filter = {};
        if (req.query.search) {
            const search = String(req.query.search).trim();
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { slug: { $regex: search, $options: "i" } },
            ];
        }
        if (req.query.isActive !== undefined) {
            filter.isActive = String(req.query.isActive) === "true";
        }
        const [categories, total] = await Promise.all([
            category_model_1.default.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            category_model_1.default.countDocuments(filter),
        ]);
        return res.status(200).json({
            success: true,
            data: categories,
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
// GET CATEGORY BY ID
async function getCategoryById(req, res, next) {
    try {
        const id = req.params.id;
        if (typeof id !== "string" || !mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid category ID",
            });
        }
        const category = await category_model_1.default.findById(id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }
        return res.status(200).json({
            success: true,
            data: category,
        });
    }
    catch (error) {
        return next(error);
    }
}
// UPDATE CATEGORY
async function updateCategory(req, res, next) {
    try {
        const id = req.params.id;
        if (typeof id !== "string" || !mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid category ID",
            });
        }
        const { name, slug, description, image, isActive } = req.body;
        const updates = {};
        if (name !== undefined) {
            if (typeof name !== "string" || !name.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "Category name cannot be empty",
                });
            }
            updates.name = name.trim();
        }
        if (slug !== undefined) {
            if (typeof slug !== "string" || !slug.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "Category slug cannot be empty",
                });
            }
            updates.slug = slug.trim().toLowerCase();
        }
        else if (typeof name === "string" && name.trim()) {
            updates.slug = name
                .trim()
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, "");
        }
        if (description !== undefined)
            updates.description = description;
        if (image !== undefined)
            updates.image = image;
        if (isActive !== undefined) {
            if (typeof isActive !== "boolean") {
                return res.status(400).json({
                    success: false,
                    message: "isActive must be a boolean",
                });
            }
            updates.isActive = isActive;
        }
        const duplicate = await category_model_1.default.findOne({
            _id: { $ne: id },
            $or: [
                ...(updates.name ? [{ name: updates.name }] : []),
                ...(updates.slug ? [{ slug: updates.slug }] : []),
            ],
        });
        if (duplicate) {
            return res.status(409).json({
                success: false,
                message: "Category name or slug already exists",
            });
        }
        const category = await category_model_1.default.findByIdAndUpdate(id, { $set: updates }, { new: true, runValidators: true });
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Category updated successfully",
            data: category,
        });
    }
    catch (error) {
        return next(error);
    }
}
// DELETE CATEGORY
async function deleteCategory(req, res, next) {
    try {
        const id = req.params.id;
        if (typeof id !== "string" || !mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid category ID",
            });
        }
        const category = await category_model_1.default.findByIdAndDelete(id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Category deleted successfully",
        });
    }
    catch (error) {
        return next(error);
    }
}
