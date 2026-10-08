"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("../controllers/product.controller");
const upload_middleware_1 = __importDefault(require("../middleware/upload.middleware"));
const router = (0, express_1.Router)();
router.post("/", upload_middleware_1.default.fields([
    { name: "image", maxCount: 1 },
    { name: "slides", maxCount: 4 },
]), product_controller_1.createProduct);
router.get("/", product_controller_1.getProducts);
// Get product by slug
router.get("/:slug", product_controller_1.getProduct);
// Update product by slug
router.put("/:slug", product_controller_1.updateProduct);
// Delete product by slug
router.delete("/:slug", product_controller_1.deleteProduct);
exports.default = router;
