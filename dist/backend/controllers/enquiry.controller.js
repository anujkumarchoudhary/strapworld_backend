"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEnquiry = exports.updateEnquiry = exports.getEnquiryById = exports.getEnquiries = exports.createEnquiry = void 0;
const enquiry_model_1 = __importDefault(require("../model/enquiry.model"));
const email_service_1 = require("../services/email.service");
// ============================================
// CREATE ENQUIRY
// ============================================
const createEnquiry = async (req, res) => {
    try {
        const { name, email, phone, message, agree, } = req.body;
        // ----------------------------------------
        // VALIDATION
        // ----------------------------------------
        if (!name || !email || !phone || !message) {
            return res.status(400).json({
                success: false,
                message: "Name, email, phone and message are required.",
            });
        }
        if (agree !== true) {
            return res.status(400).json({
                success: false,
                message: "You must agree before submitting the enquiry.",
            });
        }
        // ----------------------------------------
        // CREATE ENQUIRY
        // ----------------------------------------
        const enquiry = await enquiry_model_1.default.create({
            name,
            email,
            phone,
            message,
            agree,
        });
        // ----------------------------------------
        // SEND EMAIL
        // ----------------------------------------
        try {
            await (0, email_service_1.sendEnquiryEmail)({
                name,
                email,
                phone,
                message,
                agree,
            });
            console.log(`📧 Enquiry email sent successfully for ${email}`);
        }
        catch (emailError) {
            // Email failed, but enquiry is already
            // safely stored in MongoDB.
            console.error("❌ Enquiry email failed:", emailError);
        }
        // ----------------------------------------
        // RESPONSE
        // ----------------------------------------
        return res.status(201).json({
            success: true,
            message: "Enquiry submitted successfully.",
            data: enquiry,
        });
    }
    catch (error) {
        console.error("❌ Create enquiry error:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while submitting your enquiry.",
        });
    }
};
exports.createEnquiry = createEnquiry;
// ============================================
// GET ALL ENQUIRIES
// ============================================
const getEnquiries = async (_req, res) => {
    try {
        const enquiries = await enquiry_model_1.default
            .find()
            .sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            count: enquiries.length,
            data: enquiries,
        });
    }
    catch (error) {
        console.error("❌ Get enquiries error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch enquiries.",
        });
    }
};
exports.getEnquiries = getEnquiries;
// ============================================
// GET SINGLE ENQUIRY
// ============================================
const getEnquiryById = async (req, res) => {
    try {
        const enquiry = await enquiry_model_1.default.findById(req.params.id);
        if (!enquiry) {
            return res.status(404).json({
                success: false,
                message: "Enquiry not found.",
            });
        }
        return res.status(200).json({
            success: true,
            data: enquiry,
        });
    }
    catch (error) {
        console.error("❌ Get enquiry error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch enquiry.",
        });
    }
};
exports.getEnquiryById = getEnquiryById;
// ============================================
// UPDATE ENQUIRY
// ============================================
const updateEnquiry = async (req, res) => {
    try {
        const enquiry = await enquiry_model_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!enquiry) {
            return res.status(404).json({
                success: false,
                message: "Enquiry not found.",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Enquiry updated successfully.",
            data: enquiry,
        });
    }
    catch (error) {
        console.error("❌ Update enquiry error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update enquiry.",
        });
    }
};
exports.updateEnquiry = updateEnquiry;
// ============================================
// DELETE ENQUIRY
// ============================================
const deleteEnquiry = async (req, res) => {
    try {
        const enquiry = await enquiry_model_1.default.findByIdAndDelete(req.params.id);
        if (!enquiry) {
            return res.status(404).json({
                success: false,
                message: "Enquiry not found.",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Enquiry deleted successfully.",
        });
    }
    catch (error) {
        console.error("❌ Delete enquiry error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete enquiry.",
        });
    }
};
exports.deleteEnquiry = deleteEnquiry;
