import mongoose, { Document, Schema } from "mongoose";

export interface IEnquiry extends Document {
  name: string;
  email: string;
  phone: string;
  message: string;
  agree: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const enquirySchema = new Schema<IEnquiry>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    agree: {
      type: Boolean,
      required: true,
      validate: {
        validator: (value: boolean) => value === true,
        message: "You must agree to the terms.",
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IEnquiry>("Enquiry", enquirySchema);