import mongoose, { Schema, Document } from "mongoose";

export interface IBlog extends Document {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  author?: string;
  category?: string;
  tags: string[];
  image: string;
  imagePublicId?: string;
  status: "draft" | "published";
  publishedAt?: Date;

  metaDetails: {
    title: string;
    description: string;
    keywords: string[];
    canonical: string;
    index: boolean;
  };

  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema = new Schema<IBlog>(
  {
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

    excerpt: {
      type: String,
      default: "",
      trim: true,
    },

    content: {
      type: String,
      required: true,
    },

    author: {
      type: String,
      default: "Admin",
      trim: true,
    },

    category: {
      type: String,
      default: "",
      trim: true,
    },

    tags: {
      type: [String],
      default: [],
    },

    image: {
      type: String,
      required: true,
    },

    imagePublicId: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },

    publishedAt: {
      type: Date,
    },

    metaDetails: {
      title: {
        type: String,
        default: "",
        trim: true,
      },

      description: {
        type: String,
        default: "",
        trim: true,
      },

      keywords: {
        type: [String],
        default: [],
      },

      canonical: {
        type: String,
        default: "",
        trim: true,
      },

      index: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Blog ||
  mongoose.model<IBlog>("Blog", BlogSchema);
