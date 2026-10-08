import { Router } from "express";

import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller";
import upload from "../middleware/upload.middleware";

const router = Router();

router.post(
  "/",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "slides", maxCount: 4 },
  ]),
  createProduct,
);
router.get("/", getProducts);

// Get product by slug
router.get("/:slug", getProduct);

// Update product by slug
router.put("/:slug", updateProduct);

// Delete product by slug
router.delete("/:slug", deleteProduct);

export default router;
