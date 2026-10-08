import { Request, Response } from "express";

import Enquiry from "../model/enquiry.model"
import { sendEnquiryEmail } from "../services/email.service";


// ============================================
// CREATE ENQUIRY
// ============================================

export const createEnquiry = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      name,
      email,
      phone,
      message,
      agree,
    } = req.body;


    // ----------------------------------------
    // VALIDATION
    // ----------------------------------------

    if (!name || !email || !phone || !message) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email, phone and message are required.",
      });
    }


    if (agree !== true) {
      return res.status(400).json({
        success: false,
        message:
          "You must agree before submitting the enquiry.",
      });
    }


    // ----------------------------------------
    // CREATE ENQUIRY
    // ----------------------------------------

    const enquiry = await Enquiry.create({
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
      await sendEnquiryEmail({
        name,
        email,
        phone,
        message,
        agree,
      });

      console.log(
        `📧 Enquiry email sent successfully for ${email}`
      );

    } catch (emailError) {

      // Email failed, but enquiry is already
      // safely stored in MongoDB.

      console.error(
        "❌ Enquiry email failed:",
        emailError
      );
    }


    // ----------------------------------------
    // RESPONSE
    // ----------------------------------------

    return res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully.",
      data: enquiry,
    });

  } catch (error) {

    console.error(
      "❌ Create enquiry error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while submitting your enquiry.",
    });
  }
};


// ============================================
// GET ALL ENQUIRIES
// ============================================

export const getEnquiries = async (
  _req: Request,
  res: Response
) => {
  try {

    const enquiries = await Enquiry
      .find()
      .sort({ createdAt: -1 });


    return res.status(200).json({
      success: true,
      count: enquiries.length,
      data: enquiries,
    });

  } catch (error) {

    console.error(
      "❌ Get enquiries error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch enquiries.",
    });
  }
};


// ============================================
// GET SINGLE ENQUIRY
// ============================================

export const getEnquiryById = async (
  req: Request,
  res: Response
) => {
  try {

    const enquiry = await Enquiry.findById(
      req.params.id
    );


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

  } catch (error) {

    console.error(
      "❌ Get enquiry error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch enquiry.",
    });
  }
};


// ============================================
// UPDATE ENQUIRY
// ============================================

export const updateEnquiry = async (
  req: Request,
  res: Response
) => {
  try {

    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );


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

  } catch (error) {

    console.error(
      "❌ Update enquiry error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update enquiry.",
    });
  }
};


// ============================================
// DELETE ENQUIRY
// ============================================

export const deleteEnquiry = async (
  req: Request,
  res: Response
) => {
  try {

    const enquiry = await Enquiry.findByIdAndDelete(
      req.params.id
    );


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

  } catch (error) {

    console.error(
      "❌ Delete enquiry error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to delete enquiry.",
    });
  }
};