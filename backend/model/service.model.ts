import mongoose, { Document, Schema } from "mongoose";

/* =========================================================
   TYPES
========================================================= */

export interface IHeadingPart {
  text: string;
  color?: string;
  size?: string;
  style?: string;
  weight?: string | number;
}

export interface ISpecification {
  value: string;
  name: string;
}

export interface IFloatingCardItem {
  name: string;
  desc: string;
}

export interface IFloatingCard {
  title: string;
  list: IFloatingCardItem[];
}

/* =========================================================
   BANNER
========================================================= */

export interface IBanner {
  id: string;
  label: string;
  headingParts: IHeadingPart[];
  subHeading: string;
  description: string;
  button: string;
  specifications: ISpecification[];
  floatingLabel: string;
  floatingCard: IFloatingCard;
  image: string;
  bgColor: string;
}

/* =========================================================
   PRODUCT OVERVIEW
========================================================= */

export interface IProductOverviewLabel {
  name: string;
}

export interface IProductOverviewSlide {
  image: string;
}

export interface IProductOverview {
  label: string;
  aspectRatio: string;
  image: string;
  headingParts: IHeadingPart[];
  description: string[];
  labels: IProductOverviewLabel[];
  slides: IProductOverviewSlide[];
  button: string;
}

/* =========================================================
   TECHNICAL OVERVIEW
========================================================= */

export interface ITechnicalOverviewLabel {
  name: string;
  description?: string;
  button?: string;
  href?: string;
  image?: string;
  labels?: string[];
}

export interface ITechnicalSpecification {
  productCode: string;
  width: number;
  thickness: number;
  length: number;
  weight: number;
  averageBreakLoad: number;
  remarks: string;
}

export interface ITechnicalOverview {
  label: string;
  aspectRatio: string;
  image: string;
  headingParts: IHeadingPart[];
  description: string[];
  labels: ITechnicalOverviewLabel[];
  list: ITechnicalSpecification[];
  button: string;
}

/* =========================================================
   RELATED PRODUCTS
========================================================= */

export interface IRelatedProduct {
  title: string;
  description: string;
  button: string;
  href: string;
  image: string;
  labels: string[];
}

export interface IRelatedProducts {
  label: string;
  bgColor: string;
  textColor: string;
  headingParts: IHeadingPart[];
  button: string;
  href: string;
  description: string;
  list: IRelatedProduct[];
}

/* =========================================================
   FAQ
========================================================= */

export interface IFAQItem {
  question: string;
  answer: string;
}

export interface IFAQData {
  label: string;
  headingParts: IHeadingPart[];
  list: IFAQItem[];
}

/* =========================================================
   FINAL CTA
========================================================= */

export interface IFinalCTA {
  isVariant: string;
  label: string;
  headingParts: IHeadingPart[];
  headingParts2: IHeadingPart[];
  description: string;
  description2: string;
  button: string;
  button2: string;
  btn2BgColor: string;
  btn2TextColor: string;
  btnBgColor: string;
  btnTextColor: string;
}

/* =========================================================
   SERVICE
========================================================= */

export interface IService extends Document {
  title: string;
  slug: string;
  description: string;
  image?: string;

  banner: IBanner;
  productOverview: IProductOverview;
  technicalOverview: ITechnicalOverview;
  relatedProducts: IRelatedProducts;
  faqData: IFAQData;
  finalCTA: IFinalCTA;

  status: "active" | "inactive";

  createdAt: Date;
  updatedAt: Date;
}

/* =========================================================
   SCHEMAS
========================================================= */

const headingPartSchema = new Schema<IHeadingPart>(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },

    color: {
      type: String,
      default: "",
    },

    size: {
      type: String,
      default: "",
    },

    style: {
      type: String,
      default: "",
    },

    weight: {
      type: Schema.Types.Mixed,
      default: "",
    },
  },
  { _id: false }
);

/* =========================================================
   BANNER SCHEMA
========================================================= */

const specificationSchema = new Schema<ISpecification>(
  {
    value: {
      type: String,
      required: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const floatingCardItemSchema = new Schema<IFloatingCardItem>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    desc: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const floatingCardSchema = new Schema<IFloatingCard>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    list: {
      type: [floatingCardItemSchema],
      default: [],
    },
  },
  { _id: false }
);

const bannerSchema = new Schema<IBanner>(
  {
    id: {
      type: String,
      required: true,
      trim: true,
    },

    label: {
      type: String,
      required: true,
      trim: true,
    },

    headingParts: {
      type: [headingPartSchema],
      default: [],
    },

    subHeading: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    button: {
      type: String,
      required: true,
      trim: true,
    },

    specifications: {
      type: [specificationSchema],
      default: [],
    },

    floatingLabel: {
      type: String,
      required: true,
      trim: true,
    },

    floatingCard: {
      type: floatingCardSchema,
      required: true,
    },

    image: {
      type: String,
      required: true,
      trim: true,
    },

    bgColor: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

/* =========================================================
   PRODUCT OVERVIEW SCHEMA
========================================================= */

const productOverviewLabelSchema =
  new Schema<IProductOverviewLabel>(
    {
      name: {
        type: String,
        required: true,
        trim: true,
      },
    },
    { _id: false }
  );

const productOverviewSlideSchema =
  new Schema<IProductOverviewSlide>(
    {
      image: {
        type: String,
        required: true,
        trim: true,
      },
    },
    { _id: false }
  );

const productOverviewSchema = new Schema<IProductOverview>(
  {
    label: {
      type: String,
      required: true,
      trim: true,
    },

    aspectRatio: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      required: true,
      trim: true,
    },

    headingParts: {
      type: [headingPartSchema],
      default: [],
    },

    description: {
      type: [String],
      default: [],
    },

    labels: {
      type: [productOverviewLabelSchema],
      default: [],
    },

    slides: {
      type: [productOverviewSlideSchema],
      default: [],
    },

    button: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

/* =========================================================
   TECHNICAL OVERVIEW SCHEMA
========================================================= */

const technicalOverviewLabelSchema =
  new Schema<ITechnicalOverviewLabel>(
    {
      name: {
        type: String,
        required: true,
        trim: true,
      },

      description: {
        type: String,
        default: "",
        trim: true,
      },

      button: {
        type: String,
        default: "",
        trim: true,
      },

      href: {
        type: String,
        default: "",
        trim: true,
      },

      image: {
        type: String,
        default: "",
        trim: true,
      },

      labels: {
        type: [String],
        default: [],
      },
    },
    { _id: false }
  );

const technicalSpecificationSchema =
  new Schema<ITechnicalSpecification>(
    {
      productCode: {
        type: String,
        required: true,
        trim: true,
      },

      width: {
        type: Number,
        required: true,
      },

      thickness: {
        type: Number,
        required: true,
      },

      length: {
        type: Number,
        required: true,
      },

      weight: {
        type: Number,
        required: true,
      },

      averageBreakLoad: {
        type: Number,
        required: true,
      },

      remarks: {
        type: String,
        required: true,
        trim: true,
      },
    },
    { _id: false }
  );

const technicalOverviewSchema =
  new Schema<ITechnicalOverview>(
    {
      label: {
        type: String,
        required: true,
        trim: true,
      },

      aspectRatio: {
        type: String,
        required: true,
        trim: true,
      },

      image: {
        type: String,
        required: true,
        trim: true,
      },

      headingParts: {
        type: [headingPartSchema],
        default: [],
      },

      description: {
        type: [String],
        default: [],
      },

      labels: {
        type: [technicalOverviewLabelSchema],
        default: [],
      },

      list: {
        type: [technicalSpecificationSchema],
        default: [],
      },

      button: {
        type: String,
        required: true,
        trim: true,
      },
    },
    { _id: false }
  );

/* =========================================================
   RELATED PRODUCTS SCHEMA
========================================================= */

const relatedProductSchema = new Schema<IRelatedProduct>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    button: {
      type: String,
      required: true,
      trim: true,
    },

    href: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      required: true,
      trim: true,
    },

    labels: {
      type: [String],
      default: [],
    },
  },
  { _id: false }
);

const relatedProductsSchema = new Schema<IRelatedProducts>(
  {
    label: {
      type: String,
      required: true,
      trim: true,
    },

    bgColor: {
      type: String,
      required: true,
      trim: true,
    },

    textColor: {
      type: String,
      required: true,
      trim: true,
    },

    headingParts: {
      type: [headingPartSchema],
      default: [],
    },

    button: {
      type: String,
      required: true,
      trim: true,
    },

    href: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    list: {
      type: [relatedProductSchema],
      default: [],
    },
  },
  { _id: false }
);

/* =========================================================
   FAQ SCHEMA
========================================================= */

const faqItemSchema = new Schema<IFAQItem>(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },

    answer: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const faqDataSchema = new Schema<IFAQData>(
  {
    label: {
      type: String,
      required: true,
      trim: true,
    },

    headingParts: {
      type: [headingPartSchema],
      default: [],
    },

    list: {
      type: [faqItemSchema],
      default: [],
    },
  },
  { _id: false }
);

/* =========================================================
   FINAL CTA SCHEMA
========================================================= */

const finalCTASchema = new Schema<IFinalCTA>(
  {
    isVariant: {
      type: String,
      required: true,
      trim: true,
    },

    label: {
      type: String,
      required: true,
      trim: true,
    },

    headingParts: {
      type: [headingPartSchema],
      default: [],
    },

    headingParts2: {
      type: [headingPartSchema],
      default: [],
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    description2: {
      type: String,
      required: true,
      trim: true,
    },

    button: {
      type: String,
      required: true,
      trim: true,
    },

    button2: {
      type: String,
      required: true,
      trim: true,
    },

    btn2BgColor: {
      type: String,
      required: true,
      trim: true,
    },

    btn2TextColor: {
      type: String,
      required: true,
      trim: true,
    },

    btnBgColor: {
      type: String,
      required: true,
      trim: true,
    },

    btnTextColor: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

/* =========================================================
   SERVICE SCHEMA
========================================================= */

const serviceSchema = new Schema<IService>(
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

    description: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      default: "",
    },

    banner: {
      type: bannerSchema,
      required: true,
    },

    productOverview: {
      type: productOverviewSchema,
      required: true,
    },

    technicalOverview: {
      type: technicalOverviewSchema,
      required: true,
    },

    relatedProducts: {
      type: relatedProductsSchema,
      required: true,
    },

    faqData: {
      type: faqDataSchema,
      required: true,
    },

    finalCTA: {
      type: finalCTASchema,
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

/* =========================================================
   MODEL
========================================================= */

const Service =
  mongoose.models.Service ||
  mongoose.model<IService>("Service", serviceSchema);

export default Service;