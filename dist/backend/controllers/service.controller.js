"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteService = exports.updateService = exports.getServiceBySlug = exports.getServices = exports.createService = void 0;
const service_model_1 = __importDefault(require("../model/service.model"));
// CREATE
const createService = async (req, res) => {
    try {
        const { title, slug, description, image, status, banner, productOverview, technicalOverview, relatedProducts, faqData, finalCTA, } = req.body;
        if (!title || !slug || !description) {
            return res.status(400).json({
                success: false,
                message: "Title, slug and description are required.",
            });
        }
        const existingService = await service_model_1.default.findOne({ slug });
        if (existingService) {
            return res.status(409).json({
                success: false,
                message: "A service with this slug already exists.",
            });
        }
        const service = await service_model_1.default.create({
            title,
            slug,
            description,
            image,
            status,
            banner,
            productOverview,
            technicalOverview,
            relatedProducts,
            faqData,
            finalCTA,
        });
        return res.status(201).json({
            success: true,
            message: "Service created successfully.",
            data: service,
        });
    }
    catch (error) {
        console.error("Create service error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create service.",
            error: error.message,
        });
    }
};
exports.createService = createService;
// GET ALL
const getServices = async (req, res) => {
    try {
        const services = await service_model_1.default.find()
            .sort({ createdAt: -1 })
            .lean();
        return res.status(200).json({
            success: true,
            count: services.length,
            data: services,
        });
    }
    catch (error) {
        console.error("Get services error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch services.",
        });
    }
};
exports.getServices = getServices;
// GET SINGLE BY SLUG
const getServiceBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        if (typeof slug !== "string") {
            return res.status(400).json({
                success: false,
                message: "Invalid service slug.",
            });
        }
        const service = await service_model_1.default.findOne({
            slug: slug.toLowerCase(),
        });
        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service not found.",
            });
        }
        return res.status(200).json({
            success: true,
            data: service,
        });
    }
    catch (error) {
        console.error("Get service by slug error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch service.",
        });
    }
};
exports.getServiceBySlug = getServiceBySlug;
// UPDATE
const updateService = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, slug, description, image, status, banner, productOverview, technicalOverview, relatedProducts, faqData, finalCTA, } = req.body;
        const service = await service_model_1.default.findById(id);
        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service not found.",
            });
        }
        // Check duplicate slug
        if (slug && slug !== service.slug) {
            const existingService = await service_model_1.default.findOne({
                slug,
                _id: { $ne: id },
            });
            if (existingService) {
                return res.status(409).json({
                    success: false,
                    message: "A service with this slug already exists.",
                });
            }
        }
        // Basic fields
        service.title = title ?? service.title;
        service.slug = slug ?? service.slug;
        service.description = description ?? service.description;
        service.image = image ?? service.image;
        service.status = status ?? service.status;
        // Complete service content
        service.banner = banner ?? service.banner;
        service.productOverview =
            productOverview ?? service.productOverview;
        service.technicalOverview =
            technicalOverview ?? service.technicalOverview;
        service.relatedProducts =
            relatedProducts ?? service.relatedProducts;
        service.faqData =
            faqData ?? service.faqData;
        service.finalCTA =
            finalCTA ?? service.finalCTA;
        await service.save();
        return res.status(200).json({
            success: true,
            message: "Service updated successfully.",
            data: service,
        });
    }
    catch (error) {
        console.error("Update service error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update service.",
            error: error.message,
        });
    }
};
exports.updateService = updateService;
// DELETE
const deleteService = async (req, res) => {
    try {
        const { id } = req.params;
        const service = await service_model_1.default.findByIdAndDelete(id);
        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service not found.",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Service deleted successfully.",
        });
    }
    catch (error) {
        console.error("Delete service error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete service.",
        });
    }
};
exports.deleteService = deleteService;
