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
/* =========================================================
   SCHEMAS
========================================================= */
const headingPartSchema = new mongoose_1.Schema({
    text: {
        type: String,
        required: true,
        trim: true,
    },
    color: {
        type: String,
        default: "",
    },
    size: {
        type: String,
        default: "",
    },
    style: {
        type: String,
        default: "",
    },
    weight: {
        type: mongoose_1.Schema.Types.Mixed,
        default: "",
    },
}, { _id: false });
/* =========================================================
   BANNER SCHEMA
========================================================= */
const specificationSchema = new mongoose_1.Schema({
    value: {
        type: String,
        required: true,
        trim: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
}, { _id: false });
const floatingCardItemSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    desc: {
        type: String,
        required: true,
        trim: true,
    },
}, { _id: false });
const floatingCardSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    list: {
        type: [floatingCardItemSchema],
        default: [],
    },
}, { _id: false });
const bannerSchema = new mongoose_1.Schema({
    id: {
        type: String,
        required: true,
        trim: true,
    },
    label: {
        type: String,
        required: true,
        trim: true,
    },
    headingParts: {
        type: [headingPartSchema],
        default: [],
    },
    subHeading: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    button: {
        type: String,
        required: true,
        trim: true,
    },
    specifications: {
        type: [specificationSchema],
        default: [],
    },
    floatingLabel: {
        type: String,
        required: true,
        trim: true,
    },
    floatingCard: {
        type: floatingCardSchema,
        required: true,
    },
    image: {
        type: String,
        required: true,
        trim: true,
    },
    bgColor: {
        type: String,
        required: true,
        trim: true,
    },
}, { _id: false });
/* =========================================================
   PRODUCT OVERVIEW SCHEMA
========================================================= */
const productOverviewLabelSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
}, { _id: false });
const productOverviewSlideSchema = new mongoose_1.Schema({
    image: {
        type: String,
        required: true,
        trim: true,
    },
}, { _id: false });
const productOverviewSchema = new mongoose_1.Schema({
    label: {
        type: String,
        required: true,
        trim: true,
    },
    aspectRatio: {
        type: String,
        required: true,
        trim: true,
    },
    image: {
        type: String,
        required: true,
        trim: true,
    },
    headingParts: {
        type: [headingPartSchema],
        default: [],
    },
    description: {
        type: [String],
        default: [],
    },
    labels: {
        type: [productOverviewLabelSchema],
        default: [],
    },
    slides: {
        type: [productOverviewSlideSchema],
        default: [],
    },
    button: {
        type: String,
        required: true,
        trim: true,
    },
}, { _id: false });
/* =========================================================
   TECHNICAL OVERVIEW SCHEMA
========================================================= */
const technicalOverviewLabelSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        default: "",
        trim: true,
    },
    button: {
        type: String,
        default: "",
        trim: true,
    },
    href: {
        type: String,
        default: "",
        trim: true,
    },
    image: {
        type: String,
        default: "",
        trim: true,
    },
    labels: {
        type: [String],
        default: [],
    },
}, { _id: false });
const technicalSpecificationSchema = new mongoose_1.Schema({
    productCode: {
        type: String,
        required: true,
        trim: true,
    },
    width: {
        type: Number,
        required: true,
    },
    thickness: {
        type: Number,
        required: true,
    },
    length: {
        type: Number,
        required: true,
    },
    weight: {
        type: Number,
        required: true,
    },
    averageBreakLoad: {
        type: Number,
        required: true,
    },
    remarks: {
        type: String,
        required: true,
        trim: true,
    },
}, { _id: false });
const technicalOverviewSchema = new mongoose_1.Schema({
    label: {
        type: String,
        required: true,
        trim: true,
    },
    aspectRatio: {
        type: String,
        required: true,
        trim: true,
    },
    image: {
        type: String,
        required: true,
        trim: true,
    },
    headingParts: {
        type: [headingPartSchema],
        default: [],
    },
    description: {
        type: [String],
        default: [],
    },
    labels: {
        type: [technicalOverviewLabelSchema],
        default: [],
    },
    list: {
        type: [technicalSpecificationSchema],
        default: [],
    },
    button: {
        type: String,
        required: true,
        trim: true,
    },
}, { _id: false });
/* =========================================================
   RELATED PRODUCTS SCHEMA
========================================================= */
const relatedProductSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    button: {
        type: String,
        required: true,
        trim: true,
    },
    href: {
        type: String,
        required: true,
        trim: true,
    },
    image: {
        type: String,
        required: true,
        trim: true,
    },
    labels: {
        type: [String],
        default: [],
    },
}, { _id: false });
const relatedProductsSchema = new mongoose_1.Schema({
    label: {
        type: String,
        required: true,
        trim: true,
    },
    bgColor: {
        type: String,
        required: true,
        trim: true,
    },
    textColor: {
        type: String,
        required: true,
        trim: true,
    },
    headingParts: {
        type: [headingPartSchema],
        default: [],
    },
    button: {
        type: String,
        required: true,
        trim: true,
    },
    href: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    list: {
        type: [relatedProductSchema],
        default: [],
    },
}, { _id: false });
/* =========================================================
   FAQ SCHEMA
========================================================= */
const faqItemSchema = new mongoose_1.Schema({
    question: {
        type: String,
        required: true,
        trim: true,
    },
    answer: {
        type: String,
        required: true,
        trim: true,
    },
}, { _id: false });
const faqDataSchema = new mongoose_1.Schema({
    label: {
        type: String,
        required: true,
        trim: true,
    },
    headingParts: {
        type: [headingPartSchema],
        default: [],
    },
    list: {
        type: [faqItemSchema],
        default: [],
    },
}, { _id: false });
/* =========================================================
   FINAL CTA SCHEMA
========================================================= */
const finalCTASchema = new mongoose_1.Schema({
    isVariant: {
        type: String,
        required: true,
        trim: true,
    },
    label: {
        type: String,
        required: true,
        trim: true,
    },
    headingParts: {
        type: [headingPartSchema],
        default: [],
    },
    headingParts2: {
        type: [headingPartSchema],
        default: [],
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    description2: {
        type: String,
        required: true,
        trim: true,
    },
    button: {
        type: String,
        required: true,
        trim: true,
    },
    button2: {
        type: String,
        required: true,
        trim: true,
    },
    btn2BgColor: {
        type: String,
        required: true,
        trim: true,
    },
    btn2TextColor: {
        type: String,
        required: true,
        trim: true,
    },
    btnBgColor: {
        type: String,
        required: true,
        trim: true,
    },
    btnTextColor: {
        type: String,
        required: true,
        trim: true,
    },
}, { _id: false });
/* =========================================================
   SERVICE SCHEMA
========================================================= */
const serviceSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    image: {
        type: String,
        default: "",
    },
    banner: {
        type: bannerSchema,
        required: true,
    },
    productOverview: {
        type: productOverviewSchema,
        required: true,
    },
    technicalOverview: {
        type: technicalOverviewSchema,
        required: true,
    },
    relatedProducts: {
        type: relatedProductsSchema,
        required: true,
    },
    faqData: {
        type: faqDataSchema,
        required: true,
    },
    finalCTA: {
        type: finalCTASchema,
        required: true,
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active",
    },
}, {
    timestamps: true,
});
/* =========================================================
   MODEL
========================================================= */
const Service = mongoose_1.default.models.Service ||
    mongoose_1.default.model("Service", serviceSchema);
exports.default = Service;
