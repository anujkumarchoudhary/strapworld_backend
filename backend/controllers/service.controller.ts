import { Request, Response } from "express";
import Service from "../model/service.model";

// CREATE
export const createService = async (
  req: Request,
  res: Response
) => {
  try {
    const {
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
    } = req.body;

    if (!title || !slug || !description) {
      return res.status(400).json({
        success: false,
        message: "Title, slug and description are required.",
      });
    }

    const existingService = await Service.findOne({ slug });

    if (existingService) {
      return res.status(409).json({
        success: false,
        message: "A service with this slug already exists.",
      });
    }

    const service = await Service.create({
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
  } catch (error: any) {
    console.error("Create service error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create service.",
      error: error.message,
    });
  }
};


// GET ALL
export const getServices = async (
  req: Request,
  res: Response
) => {
  try {
    const services = await Service.find()
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    console.error("Get services error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch services.",
    });
  }
};


// GET SINGLE BY SLUG
export const getServiceBySlug = async (
  req: Request,
  res: Response
) => {
  try {
    const { slug } = req.params;

    if (typeof slug !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid service slug.",
      });
    }

    const service = await Service.findOne({
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
  } catch (error) {
    console.error("Get service by slug error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch service.",
    });
  }
};


// UPDATE
export const updateService = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const {
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
    } = req.body;

    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found.",
      });
    }

    // Check duplicate slug
    if (slug && slug !== service.slug) {
      const existingService = await Service.findOne({
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
  } catch (error: any) {
    console.error("Update service error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update service.",
      error: error.message,
    });
  }
};


// DELETE
export const deleteService = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const service = await Service.findByIdAndDelete(id);

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
  } catch (error) {
    console.error("Delete service error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete service.",
    });
  }
};