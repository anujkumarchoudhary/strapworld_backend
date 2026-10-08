import { Router } from "express";

import {
  createService,
  getServices,
  updateService,
  deleteService,
  getServiceBySlug,
} from "../controllers/service.controller";

const router = Router();

router.post("/", createService);

router.get("/", getServices);

router.get("/:slug", getServiceBySlug);

router.put("/:id", updateService);

router.delete("/:id", deleteService);

export default router;