import { Request, Response } from "express";
import Product from "../model/product.model";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";

// CREATE PRODUCT

export const createProduct = async (req: Request, res: Response) => {
  try {
    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    // Main product image
    const mainImage = files?.image?.[0];

    if (!mainImage) {
      return res.status(400).json({
        success: false,
        message: "Product image is required",
      });
    }

    // Slide images
    const slideImages = files?.slides || [];

    // -----------------------------------
    // 1. Upload main image
    // -----------------------------------

    const mainFileName = mainImage.originalname
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .toLowerCase();

    const uploadedMainImage = await uploadToCloudinary(
      mainImage.buffer,
      "strapworld/products",
      mainFileName,
    );

    // -----------------------------------
    // 2. Upload slide images
    // -----------------------------------

    const uploadedSlides = [];

    for (const file of slideImages) {
      const slideFileName = file.originalname
        .replace(/\.[^/.]+$/, "")
        .replace(/[^a-zA-Z0-9-_]/g, "-")
        .toLowerCase();

      const uploadedSlide = await uploadToCloudinary(
        file.buffer,
        "strapworld/products/slides",
        slideFileName,
      );

      uploadedSlides.push({
        image: uploadedSlide.secure_url,
      });
    }

    // -----------------------------------
    // 3. Parse multipart JSON
    // -----------------------------------

    const productOverview = req.body.productOverview
      ? JSON.parse(req.body.productOverview)
      : undefined;

    const technicalOverview = req.body.technicalOverview
      ? JSON.parse(req.body.technicalOverview)
      : undefined;

    const relatedProducts = req.body.relatedProducts
      ? JSON.parse(req.body.relatedProducts)
      : [];

    const faqData = req.body.faqData ? JSON.parse(req.body.faqData) : undefined;

    const labels = req.body.labels ? JSON.parse(req.body.labels) : [];

    // -----------------------------------
    // 4. Add Cloudinary slides
    // -----------------------------------

    if (productOverview) {
      productOverview.slides = uploadedSlides;
    }

    // -----------------------------------
    // 5. Create product
    // -----------------------------------

    const product = await Product.create({
      ...req.body,

      title: req.body.title,
      description: req.body.description,
      button: req.body.button,
      slug: req.body.slug,

      labels,

      image: uploadedMainImage.secure_url,
      imagePublicId: uploadedMainImage.public_id,

      productOverview,

      technicalOverview,

      relatedProducts,

      faqData,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error: any) {
    console.error("Create product error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create product",
    });
  }
};

// GET ALL PRODUCTS
export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find()
      .select(
        "title description button image labels slug status createdAt relatedProducts productOverview technicalOverview faqData",
      )
      .populate({
        path: "relatedProducts.productId",
        select: "title description button image labels slug",
      })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    return res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error: unknown) {
    console.error("Get products error:", error);

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to fetch products",
    });
  }
};

// GET SINGLE PRODUCT BY SLUG
export const getProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findOne({
      slug: req.params.slug,
    }).populate({
      path: "relatedProducts.productId",
      select: "title description button image labels slug",
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error: any) {
    console.error("Get product error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch product",
    });
  }
};

// UPDATE PRODUCT BY SLUG
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      {
        new: true,
        runValidators: true,
      },
    ).populate({
      path: "relatedProducts.productId",
      select: "title description button image labels slug",
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error: any) {
    console.error("Update product error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to update product",
    });
  }
};

// DELETE PRODUCT BY SLUG
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findOneAndDelete({
      slug: req.params.slug,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error: any) {
    console.error("Delete product error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete product",
    });
  }
};
