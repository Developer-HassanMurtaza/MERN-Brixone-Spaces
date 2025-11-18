import { Router } from "express";
import {
  register,
  login,
  forgotPassword,
  resendOtp,
  verifyOtp,
  resetPassword,
  editProfile,
  getProfile,
} from "../controllers/index.js";
import {
  emailValidator,
  requiredFields,
  trimBodyObject,
  loginAuth,
  upload,
} from "../middlewares/index.js";

const authRouter = Router();

// REGISTER
authRouter.post(
  "/register",
  trimBodyObject,
  requiredFields(["fullName", "email", "password"]),
  emailValidator,
  register
);

// LOGIN
authRouter.post(
  "/login",
  trimBodyObject,
  requiredFields(["email", "password"]),
  emailValidator,
  login
);

// FORGOT PASSWORD
authRouter.post(
  "/forgot-password",
  trimBodyObject,
  requiredFields(["email"]),
  emailValidator,
  forgotPassword
);

// RESEND OTP
authRouter.post(
  "/resend-otp",
  trimBodyObject,
  requiredFields(["email"]),
  emailValidator,
  resendOtp
);

// VERIFY OTP
authRouter.post(
  "/verify-otp",
  trimBodyObject,
  requiredFields(["email", "otp"]),
  emailValidator,
  verifyOtp
);

// RESET PASSWORD
authRouter.post(
  "/reset-password",
  trimBodyObject,
  requiredFields(["email", "newPassword"]),
  emailValidator,
  resetPassword
);

// EDIT PROFILE
authRouter.patch(
  "/edit-profile",
  loginAuth,
  upload.single("profilePicture"),
  trimBodyObject,
  editProfile
);

// GET PROFILE
authRouter.get("/profile", loginAuth, getProfile);

export { authRouter };
