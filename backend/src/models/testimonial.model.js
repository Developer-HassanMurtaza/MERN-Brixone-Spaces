import { Schema, model } from "mongoose";
import { Counter } from "./counter.model.js";

// ╔═══════════════════════════╗
// ║    Testimonial Schema     ║
// ╚═══════════════════════════╝
const TestimonialSchema = new Schema(
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
      required: [true, "Full name is required"],
      trim: true,
    },

    designation: {
      type: String,
      required: [true, "Designation is required"],
      trim: true,
    },

    clientFeedback: {
      type: String,
      required: [true, "Client feedback is required"],
      trim: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    userImage: {
      type: String,
      required: [true, "User image is required"],
      trim: true,
    },

    propertyImage: {
      type: String,
      required: [true, "Property image is required"],
      trim: true,
    },
  },
  { timestamps: true, versionKey: false }
);

// ╔══════════════════════════════════════════════╗
// ║     Pre-Save Hook: Assign Incremental ID     ║
// ╚══════════════════════════════════════════════╝
TestimonialSchema.pre("save", async function (next) {
  try {
    if (this.isNew && (this.customId === undefined || this.customId === null)) {
      const nextId = await Counter.getNextSequence("testimonials");
      this.customId = nextId;
    }
    next();
  } catch (err) {
    next(err);
  }
});

// ╔══════════════════════╗
// ║     Export Model     ║
// ╚══════════════════════╝
export const Testimonial = model("Testimonial", TestimonialSchema);
