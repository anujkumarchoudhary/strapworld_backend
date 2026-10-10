"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBlog = exports.updateBlog = exports.getBlogById = exports.getBlogs = exports.createBlog = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const blog_model_1 = __importDefault(require("../model/blog.model"));
const uploadToCloudinary_1 = require("../utils/uploadToCloudinary");
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const parseJSON = (value, fallback) => {
    if (value === undefined || value === null || value === "") {
        return fallback;
    }
    if (typeof value !== "string") {
        return value;
    }
    return JSON.parse(value);
};
const sanitizeFilename = (filename) => {
    return filename
        .replace(/\.[^/.]+$/, "")
        .replace(/[^a-zA-Z0-9_-]/g, "-")
        .toLowerCase();
};
const uploadImage = async (file, folder) => {
    return (0, uploadToCloudinary_1.uploadToCloudinary)(file.buffer, folder, sanitizeFilename(file.originalname));
};
// CREATE BLOG
// Generate slug from title
const generateSlug = (title) => {
    return title
        .toLowerCase()
        .trim()
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
};
const createBlog = async (req, res) => {
    try {
        const { title, content, excerpt, author, category, tags, status, seoTitle, seoDescription, seoKeywords, canonical, index, } = req.body;
        if (!title?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Blog title is required",
            });
        }
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Blog image is required",
            });
        }
        // Generate slug from title; do not accept slug from request body
        const baseSlug = generateSlug(title);
        if (!baseSlug) {
            return res.status(400).json({
                success: false,
                message: "A valid title is required to generate the slug",
            });
        }
        // Ensure slug is unique
        let slug = baseSlug;
        let counter = 1;
        while (await blog_model_1.default.exists({ slug })) {
            slug = `${baseSlug}-${counter}`;
            counter++;
        }
        // Upload image to Cloudinary
        const uploadedImage = await (0, uploadToCloudinary_1.uploadToCloudinary)(req.file.buffer, "blogs", req.file.originalname);
        // Create metadata object
        const metaDetails = {
            title: seoTitle?.trim() || title.trim(),
            description: seoDescription?.trim() || excerpt?.trim() || "",
            keywords: Array.isArray(seoKeywords)
                ? seoKeywords
                : (seoKeywords || "")
                    .split(",")
                    .map((keyword) => keyword.trim())
                    .filter(Boolean),
            canonical: canonical?.trim() || "",
            index: index === undefined ? true : index === true || index === "true",
        };
        const blog = await blog_model_1.default.create({
            title: title.trim(),
            slug,
            content,
            excerpt,
            author,
            category,
            tags,
            status: status || "draft",
            image: uploadedImage.secure_url,
            imagePublicId: uploadedImage.public_id,
            metaDetails,
        });
        return res.status(201).json({
            success: true,
            message: "Blog created successfully",
            data: blog,
        });
    }
    catch (error) {
        console.error("Create blog error:", error);
        // MongoDB duplicate-key error
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "A blog with this slug already exists",
            });
        }
        return res.status(500).json({
            success: false,
            message: "Failed to create blog",
        });
    }
};
exports.createBlog = createBlog;
// GET ALL BLOGS
const getBlogs = async (req, res) => {
    try {
        const page = Math.max(1, Number.parseInt(String(req.query.page || "1"), 10) || 1);
        const limit = Math.min(100, Math.max(1, Number.parseInt(String(req.query.limit || "10"), 10) || 10));
        const filter = {
            status: "published",
        };
        if (req.query.status === "draft" || req.query.status === "published") {
            // Only enable draft access on an authenticated admin route.
            filter.status = req.query.status;
        }
        if (req.query.category) {
            filter.category = req.query.category;
        }
        const [blogs, total] = await Promise.all([
            blog_model_1.default.find(filter)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),
            blog_model_1.default.countDocuments(filter),
        ]);
        return res.status(200).json({
            success: true,
            data: blogs,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    }
    catch (error) {
        console.error("Get blogs error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch blogs",
        });
    }
};
exports.getBlogs = getBlogs;
// GET SINGLE BLOG BY ID OR SLUG
const getBlogById = async (req, res) => {
    try {
        const identifier = String(req.params.identifier);
        const filter = mongoose_1.default.isValidObjectId(identifier)
            ? { _id: identifier }
            : { slug: identifier.toLowerCase() };
        const blog = await blog_model_1.default.findOne(filter);
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found",
            });
        }
        return res.status(200).json({
            success: true,
            data: blog,
        });
    }
    catch (error) {
        console.error("Get blog error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch blog",
        });
    }
};
exports.getBlogById = getBlogById;
// UPDATE BLOG
const updateBlog = async (req, res) => {
    let uploadedPublicId;
    try {
        const { id } = req.params;
        if (!mongoose_1.default.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid blog ID",
            });
        }
        const blog = await blog_model_1.default.findById(id);
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found",
            });
        }
        const updates = {};
        const stringFields = [
            "title",
            "excerpt",
            "content",
            "author",
            "category",
            "seoTitle",
            "seoDescription",
        ];
        for (const field of stringFields) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        }
        if (req.body.slug !== undefined) {
            const slug = String(req.body.slug).trim().toLowerCase();
            const existing = await blog_model_1.default.findOne({
                slug,
                _id: { $ne: id },
            });
            if (existing) {
                return res.status(409).json({
                    success: false,
                    message: "A blog with this slug already exists",
                });
            }
            updates.slug = slug;
        }
        if (req.body.tags !== undefined) {
            updates.tags = parseJSON(req.body.tags, []);
        }
        if (req.body.seoKeywords !== undefined) {
            updates.seoKeywords = parseJSON(req.body.seoKeywords, []);
        }
        if (req.body.status !== undefined) {
            if (!["draft", "published"].includes(req.body.status)) {
                return res.status(400).json({
                    success: false,
                    message: "Status must be draft or published",
                });
            }
            updates.status = req.body.status;
            if (req.body.status === "published") {
                updates.publishedAt = blog.publishedAt || new Date();
            }
        }
        // Replace image only if a new image is provided.
        const mainImage = req.files?.image?.[0];
        if (mainImage) {
            const uploadedImage = await uploadImage(mainImage, "strapworld/blogs");
            uploadedPublicId = uploadedImage.public_id;
            updates.image = uploadedImage.secure_url;
            updates.imagePublicId = uploadedImage.public_id;
        }
        const updatedBlog = await blog_model_1.default.findByIdAndUpdate(id, { $set: updates }, {
            new: true,
            runValidators: true,
        });
        if (!updatedBlog) {
            if (uploadedPublicId) {
                await cloudinary_1.default.uploader.destroy(uploadedPublicId);
            }
            return res.status(404).json({
                success: false,
                message: "Blog not found",
            });
        }
        // Remove the previous image after a successful update.
        if (mainImage && blog.imagePublicId) {
            try {
                await cloudinary_1.default.uploader.destroy(blog.imagePublicId);
            }
            catch (cleanupError) {
                console.error("Old image cleanup error:", cleanupError);
            }
        }
        return res.status(200).json({
            success: true,
            message: "Blog updated successfully",
            data: updatedBlog,
        });
    }
    catch (error) {
        console.error("Update blog error:", error);
        if (uploadedPublicId) {
            try {
                await cloudinary_1.default.uploader.destroy(uploadedPublicId);
            }
            catch (cleanupError) {
                console.error("Cloudinary cleanup error:", cleanupError);
            }
        }
        return res.status(error?.code === 11000 ? 409 : 500).json({
            success: false,
            message: error?.code === 11000
                ? "A blog with this slug already exists"
                : error.message || "Failed to update blog",
        });
    }
};
exports.updateBlog = updateBlog;
// DELETE BLOG
const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid blog ID",
            });
        }
        const blog = await blog_model_1.default.findByIdAndDelete(id);
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found",
            });
        }
        if (blog.imagePublicId) {
            try {
                await cloudinary_1.default.uploader.destroy(blog.imagePublicId);
            }
            catch (cleanupError) {
                console.error("Cloudinary deletion error:", cleanupError);
            }
        }
        return res.status(200).json({
            success: true,
            message: "Blog deleted successfully",
            data: blog,
        });
    }
    catch (error) {
        console.error("Delete blog error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to delete blog",
        });
    }
};
exports.deleteBlog = deleteBlog;
