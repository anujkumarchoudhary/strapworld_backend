import { Router } from "express";

import upload from "../middleware/upload.middleware";
import {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
} from "../controllers/blog.controller";

const router = Router();

router.post("/", upload.single("image"), createBlog);

router.get("/", getBlogs);

router.get("/:identifier", getBlogById);

router.put("/:id", upload.single("image"), updateBlog);

router.delete("/:id", deleteBlog);

export default router;
