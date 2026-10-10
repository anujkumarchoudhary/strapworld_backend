"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const HeadingPartSchema = new mongoose_1.Schema({
    text: {
        type: String,
        required: true,
    },
    color: String,
    style: String,
    weight: String,
}, { _id: false });
const LabelSchema = new mongoose_1.Schema({
    text: {
        type: String,
        required: true,
    },
    color: String,
    bgColor: String,
}, { _id: false });
const ProductImageSchema = new mongoose_1.Schema({
    image: {
        type: String,
        required: true,
    },
}, { _id: false });
const ProductOverviewSchema = new mongoose_1.Schema({
    label: String,
    aspectRatio: String,
    image: String,
    headingParts: {
        type: [HeadingPartSchema],
        default: [],
    },
    description: {
        type: [String],
        default: [],
    },
    labels: {
        type: [LabelSchema],
        default: [],
    },
    slides: {
        type: [ProductImageSchema],
        default: [],
    },
    button: String,
}, { _id: false });
const SpecificationSchema = new mongoose_1.Schema({
    productCode: {
        type: String,
        required: true,
    },
    width: {
        type: String,
        required: true,
    },
    thickness: {
        type: String,
        required: true,
    },
    length: {
        type: String,
        required: true,
    },
    weight: {
        type: String,
        required: true,
    },
    averageBreakLoad: {
        type: String,
        required: true,
    },
    remarks: String,
}, { _id: false });
const TechnicalOverviewSchema = new mongoose_1.Schema({
    label: String,
    aspectRatio: String,
    image: String,
    headingParts: {
        type: [HeadingPartSchema],
        default: [],
    },
    description: {
        type: [String],
        default: [],
    },
    labels: {
        type: [LabelSchema],
        default: [],
    },
    list: {
        type: [SpecificationSchema],
        default: [],
    },
    button: String,
}, { _id: false });
const RelatedProductSchema = new mongoose_1.Schema({
    productId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
}, { _id: false });
const FAQSchema = new mongoose_1.Schema({
    question: {
        type: String,
        required: true,
    },
    answer: {
        type: String,
        required: true,
    },
}, { _id: false });
const FAQDataSchema = new mongoose_1.Schema({
    label: String,
    headingParts: {
        type: [HeadingPartSchema],
        default: [],
    },
    list: {
        type: [FAQSchema],
        default: [],
    },
}, { _id: false });
const ProductSchema = new mongoose_1.Schema({
    // Basic product information
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    button: {
        type: String,
        default: "View Product",
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    image: {
        type: String,
        required: true,
    },
    labels: {
        type: [String],
        default: [],
    },
    // Product detail page
    productOverview: {
        type: ProductOverviewSchema,
    },
    technicalOverview: {
        type: TechnicalOverviewSchema,
    },
    // Only store IDs, not complete duplicated products
    relatedProducts: {
        type: [RelatedProductSchema],
        default: [],
    },
    faqData: {
        type: FAQDataSchema,
    },
}, {
    timestamps: true,
});
// Index for sorting products by creation date.
ProductSchema.index({ createdAt: -1 });
exports.default = mongoose_1.default.model("Product", ProductSchema);
