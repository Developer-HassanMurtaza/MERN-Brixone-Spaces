import { Schema, model } from "mongoose";

// ╔═══════════════════════╗
// ║     Invest Schema     ║
// ╚═══════════════════════╝
const InvestSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address.",
      ],
    },

    phoneNo: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },

    lookingTo: {
      type: String,
      required: [true, "Looking to is required"],
      trim: true,
    },

    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
    },
  },
  { timestamps: true, versionKey: false }
);

export const Invest = model("Invest", InvestSchema);

