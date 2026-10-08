import { Router } from "express";

import {
  createEnquiry,
  getEnquiries,
  getEnquiryById,
  updateEnquiry,
  deleteEnquiry,
} from "../controllers/enquiry.controller";

const router = Router();

router.post("/", createEnquiry);
router.get("/", getEnquiries);
router.get("/:id", getEnquiryById);
router.patch("/:id", updateEnquiry);
router.delete("/:id", deleteEnquiry);

export default router;