import { Schema, model } from "mongoose";
import { Counter } from "./counter.model.js";

// ╔═════════════════════╗
// ║     Tour Schema     ║
// ╚═════════════════════╝
const TourSchema = new Schema(
  {
    customId: {
      type: Number,
      unique: true,
      index: true,
      immutable: true,
      min: [200, "Custom ID cannot be less than 200"],
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address.",
      ],
    },

    phoneNo: {
      type: String,
      required: true,
      trim: true,
    },

    tourDate: {
      type: Date,
      required: true,
    },

    propertyId: {
      type: Schema.Types.ObjectId,
      ref: "Property",
      required: true,
      index: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true, versionKey: false }
);

// ╔══════════════════════════════════════════════╗
// ║     Pre-Save Hook: Assign Incremental ID     ║
// ╚══════════════════════════════════════════════╝
TourSchema.pre("save", async function (next) {
  try {
    if (this.isNew && (this.customId === undefined || this.customId === null)) {
      const nextId = await Counter.getNextSequence("tours");
      this.customId = nextId;
    }
    next();
  } catch (error) {
    next(error);
  }
});

export const Tour = model("Tour", TourSchema);
