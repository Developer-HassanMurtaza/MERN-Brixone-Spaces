import { Schema, model } from "mongoose";
import { PROPERTY_FEATURES } from "../constants/index.js";

// ╔═════════════════════════════════╗
// ║     Property Feature Schema     ║
// ╚═════════════════════════════════╝
const PropertyFeatureSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    enum: Object.values(PROPERTY_FEATURES),
  },

  icon: {
    type: String,
    required: false,
  },

  type: {
    type: String,
    enum: ["boolean", "number"],
    default: "boolean",
  },
});

export const PropertyFeature = model("PropertyFeature", PropertyFeatureSchema);
