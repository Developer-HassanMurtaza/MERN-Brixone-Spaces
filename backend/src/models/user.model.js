import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { promisify } from "util";
import { ROLES } from "../constants/index.js";

// ╔═════════════════════╗
// ║     User Schema     ║
// ╚═════════════════════╝
const UserSchema = new Schema(
  {
    fullName: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      index: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },

    phoneNumber: {
      type: String,
      default: "",
      trim: true,
    },

    password: {
      type: String,
      select: false,
      minlength: [6, "Password must be at least 6 characters long"],
    },

    profilePicture: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      enum: Object.values(ROLES), // ["Admin", "User"]
      default: ROLES.USER,
      index: true,
      trim: true,
    },

    canChangePassword: {
      type: Boolean,
      default: false,
      select: false,
    },

    canRequestResendOTP: {
      type: Boolean,
      default: false,
      select: false,
    },

    passwordResetOTP: {
      type: String,
      select: false,
    },

    passwordResetExpires: {
      type: Date,
      select: false,
    },
  },
  { timestamps: true, versionKey: false }
);

// ╔══════════════════════════════════════════════════════════════════╗
// ║     Pre-Hook (Hash Password and Handle Password Requirement)     ║
// ╚══════════════════════════════════════════════════════════════════╝
UserSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password") && this.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
      } catch (error) {
        console.error("Error hashing password:", error);
        return next(
          new Error("An error occurred while hashing your password.")
        );
      }
    }
    next();
  } catch (error) {
    console.error("Error in pre-save hook:", error);
    return next(new Error("There is an error while processing user data."));
  }
});

// ╔══════════════════════════╗
// ║     Compare Password     ║
// ╚══════════════════════════╝
UserSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    if (!this.password) {
      throw new Error("Password not set for this user.");
    }
    return await bcrypt.compare(candidatePassword.toString(), this.password);
  } catch (error) {
    console.error("There is an error while comparing password.", error);
    throw new Error(
      "Incorrect password or an error occurred while comparing password."
    );
  }
};

// ╔═════════════════════════════════════╗
// ║     Generate Password Reset OTP     ║
// ╚═════════════════════════════════════╝
UserSchema.methods.generatePasswordResetOTP = async function () {
  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const hashedOtp = await bcrypt.hash(otp, 10);
    this.passwordResetOTP = hashedOtp;
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return otp;
  } catch (error) {
    console.error("Error generating password reset OTP:", error);
    throw new Error("There is an error while generating password reset OTP.");
  }
};

// ╔════════════════════════════════════╗
// ║     Compare Reset Password OTP     ║
// ╚════════════════════════════════════╝
UserSchema.methods.compareOTP = async function (candidateOTP) {
  try {
    if (!this.passwordResetOTP) {
      console.error("Password reset OTP not found.");
      throw new Error("Password reset OTP not found.");
    }
    return await bcrypt.compare(candidateOTP.toString(), this.passwordResetOTP);
  } catch (error) {
    console.error(
      `An error occurred while comparing password reset OTP. \n${error}`
    );
    throw new Error(error.message);
  }
};

// ╔════════════════════════════╗
// ║     Generate JWT Token     ║
// ╚════════════════════════════╝
const signAsync = promisify(jwt.sign);
UserSchema.methods.createJWT = async function () {
  try {
    return await signAsync(
      {
        id: this._id,
        email: this.email,
        fullName: this.fullName,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );
  } catch (error) {
    console.error("Error creating JWT:", error);
    throw new Error("There is an error while creating JWT.");
  }
};

/** @type {import('mongoose').Model<any, {}, UserMethods>} */
export const User = model("User", UserSchema);
