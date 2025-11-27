import { Schema, model, Types } from "mongoose";

// ╔═══════════════════════════╗
// ║     Floor Plan Schema     ║
// ╚═══════════════════════════╝
const FloorPlanSchema = new Schema(
  {
    floorName: { type: String, required: true, trim: true },
    floorDescription: { type: String, required: true, trim: true },
    floorPlanImage: { type: String, required: true },
  },
  { _id: false }
);

// ╔═════════════════════════╗
// ║     Property Schema     ║
// ╚═════════════════════════╝
const PropertySchema = new Schema(
  {
    propertyName: {
      type: String,
      required: true,
      trim: true,
    },

    aboutDescription: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    features: [
      {
        feature: {
          type: Types.ObjectId,
          ref: "PropertyFeature",
          required: true,
        },
        value: {
          type: Schema.Types.Mixed,
          required: true,
        },
      },
    ],

    available: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    furnishingStatus: {
      type: String,
      required: true,
      trim: true,
    },

    leaseType: {
      type: String,
      required: true,
    },

    floorPlans: {
      totalFloors: { type: Number, required: true },
      hasBasement: { type: Boolean, required: true },
      details: [FloorPlanSchema],
    },

    propertyVideo: {
      type: String,
      default: null,
    },

    projectBrochure: {
      type: String,
      default: null,
    },

    propertyImages: [
      {
        type: String,
      },
    ],

    listingType: {
      type: String,
      required: true,
      trim: true,
    },

    propertyType: {
      type: String,
      required: true,
      trim: true,
    },

    listingStatus: {
      type: String,
      default: "Available",
      trim: true,
    },
  },
  { timestamps: true, versionKey: false }
);

export const Property = model("Property", PropertySchema);
