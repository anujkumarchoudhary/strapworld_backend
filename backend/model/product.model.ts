import mongoose, { Schema, Document } from "mongoose";

interface IHeadingPart {
  text: string;
  color?: string;
  style?: string;
  weight?: string;
}

interface ILabel {
  text: string;
  color?: string;
  bgColor?: string;
}

interface IProductImage {
  image: string;
}

interface IProductOverview {
  label?: string;
  aspectRatio?: string;
  image?: string;
  headingParts?: IHeadingPart[];
  description?: string[];
  labels?: ILabel[];
  slides?: IProductImage[];
  button?: string;
}

interface ISpecification {
  productCode: string;
  width: string;
  thickness: string;
  length: string;
  weight: string;
  averageBreakLoad: string;
  remarks?: string;
}

interface ITechnicalOverview {
  label?: string;
  aspectRatio?: string;
  image?: string;
  headingParts?: IHeadingPart[];
  description?: string[];
  labels?: ILabel[];
  list?: ISpecification[];
  button?: string;
}

interface IRelatedProduct {
  productId: mongoose.Types.ObjectId;
}

interface IFAQ {
  question: string;
  answer: string;
}

interface IFAQData {
  label?: string;
  headingParts?: IHeadingPart[];
  list?: IFAQ[];
}

export interface IProduct extends Document {
  title: string;
  description: string;
  button: string;
  slug: string;
  image: string;
  labels: string[];

  productOverview?: IProductOverview;
  technicalOverview?: ITechnicalOverview;

  relatedProducts?: IRelatedProduct[];

  faqData?: IFAQData;

  createdAt: Date;
  updatedAt: Date;
}

const HeadingPartSchema = new Schema<IHeadingPart>(
  {
    text: {
      type: String,
      required: true,
    },
    color: String,
    style: String,
    weight: String,
  },
  { _id: false }
);

const LabelSchema = new Schema<ILabel>(
  {
    text: {
      type: String,
      required: true,
    },
    color: String,
    bgColor: String,
  },
  { _id: false }
);

const ProductImageSchema = new Schema<IProductImage>(
  {
    image: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const ProductOverviewSchema = new Schema<IProductOverview>(
  {
    label: String,
    aspectRatio: String,
    image: String,

    headingParts: {
      type: [HeadingPartSchema],
      default: [],
    },

    description: {
      type: [String],
      default: [],
    },

    labels: {
      type: [LabelSchema],
      default: [],
    },

    slides: {
      type: [ProductImageSchema],
      default: [],
    },

    button: String,
  },
  { _id: false }
);

const SpecificationSchema = new Schema<ISpecification>(
  {
    productCode: {
      type: String,
      required: true,
    },
    width: {
      type: String,
      required: true,
    },
    thickness: {
      type: String,
      required: true,
    },
    length: {
      type: String,
      required: true,
    },
    weight: {
      type: String,
      required: true,
    },
    averageBreakLoad: {
      type: String,
      required: true,
    },
    remarks: String,
  },
  { _id: false }
);

const TechnicalOverviewSchema = new Schema<ITechnicalOverview>(
  {
    label: String,
    aspectRatio: String,
    image: String,

    headingParts: {
      type: [HeadingPartSchema],
      default: [],
    },

    description: {
      type: [String],
      default: [],
    },

    labels: {
      type: [LabelSchema],
      default: [],
    },

    list: {
      type: [SpecificationSchema],
      default: [],
    },

    button: String,
  },
  { _id: false }
);

const RelatedProductSchema = new Schema<IRelatedProduct>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { _id: false }
);

const FAQSchema = new Schema<IFAQ>(
  {
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const FAQDataSchema = new Schema<IFAQData>(
  {
    label: String,

    headingParts: {
      type: [HeadingPartSchema],
      default: [],
    },

    list: {
      type: [FAQSchema],
      default: [],
    },
  },
  { _id: false }
);

const ProductSchema = new Schema<IProduct>(
  {
    // Basic product information
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    button: {
      type: String,
      default: "View Product",
    },

    slug: {
      type: String,
      required: true,
      unique: true,
    },

    image: {
      type: String,
      required: true,
    },

    labels: {
      type: [String],
      default: [],
    },

    // Product detail page
    productOverview: {
      type: ProductOverviewSchema,
    },

    technicalOverview: {
      type: TechnicalOverviewSchema,
    },

    // Only store IDs, not complete duplicated products
    relatedProducts: {
      type: [RelatedProductSchema],
      default: [],
    },

    faqData: {
      type: FAQDataSchema,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IProduct>("Product", ProductSchema);