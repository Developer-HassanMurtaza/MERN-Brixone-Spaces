import { User } from "../models/user.model.js";
import { ROLES } from "../constants/index.js";
import { asyncHandler, sendEmail, ApiResponse } from "../utils/index.js";
import {
  ConflictException,
  NotFoundException,
  UnAuthorizedException,
} from "../errors/index.js";

// ╔══════════════════╗
// ║     Register     ║
// ╚══════════════════╝
export const register = asyncHandler(async (req, res) => {
  const { fullName, email, password, phoneNumber } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ConflictException("Account already exists. Please login.");
  }

  const newUser = await User.create({
    fullName,
    email,
    password,
    phoneNumber: phoneNumber || "",
  });

  const accessToken = await newUser.createJWT();

  const userResponse = newUser.toObject();
  delete userResponse.password;

  return res.status(201).json(
    new ApiResponse({
      statusCode: 201,
      message: "Registration successful.",
      data: { user: userResponse, accessToken },
    })
  );
});

// ╔═══════════════╗
// ║     Login     ║
// ╚═══════════════╝
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new NotFoundException("User with this email does not exist.");
  }
  if (user.isDeleted) {
    throw new UnAuthorizedException(
      "Your account has been deleted by admin. Please contact support."
    );
  }
  if (user.isBlock) {
    throw new UnAuthorizedException(
      "Your account is blocked. Please contact support."
    );
  }
  if (user.canRequestResendOTP && !user.canChangePassword) {
    throw new UnAuthorizedException(
      "Password reset in progress. Please complete the password reset process first by verifying the OTP sent to your email."
    );
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new UnAuthorizedException("Invalid email or password.");
  }

  const accessToken = await user.createJWT();

  const userResponse = user.toObject();
  delete userResponse.password;

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "User logged in successfully.",
      data: { user: userResponse, accessToken },
    })
  );
});

// ╔════════════════════════════════════╗
// ║     Forgot Password (Send OTP)     ║
// ╚════════════════════════════════════╝
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new NotFoundException("User not found with this email.");
  }
  if (user.isDeleted) {
    throw new UnAuthorizedException(
      "Your account has been deleted by admin. Please contact support."
    );
  }
  if (user.isBlock) {
    throw new UnAuthorizedException(
      "Your account is blocked. Please contact support."
    );
  }

  if (user.role === ROLES.ADMIN) {
    throw new UnAuthorizedException("This action is unavailable for admin.");
  }

  const otp = await user.generatePasswordResetOTP();
  user.canRequestResendOTP = true;
  user.canChangePassword = false;

  await user.save({ validateBeforeSave: false });

  try {
    const message = `Your password reset OTP is: <b>${otp}</b>. This OTP is valid for 10 minutes. Do not share this with anyone.`;
    await sendEmail({
      to: user.email,
      subject: "Password Reset OTP",
      html: message,
    });

    return res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        message: "Password reset OTP sent to your email.",
      })
    );
  } catch (error) {
    user.passwordResetOTP = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    throw error;
  }
});

// ╔════════════════════╗
// ║     Resend OTP     ║
// ╚════════════════════╝
export const resendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new NotFoundException("User not found with this email.");
  }
  if (user.isDeleted) {
    throw new UnAuthorizedException(
      "Your account has been deleted by admin. Please contact support."
    );
  }
  if (user.isBlock) {
    throw new UnAuthorizedException(
      "Your account is blocked. Please contact support."
    );
  }

  if (user.role === ROLES.ADMIN) {
    throw new UnAuthorizedException("This action is unavailable for admin.");
  }

  if (!user.canRequestResendOTP) {
    throw new UnAuthorizedException(
      "You cannot able to request for resend OTP, Follow forgot password process."
    );
  }

  const otp = await user.generatePasswordResetOTP();
  await user.save({ validateBeforeSave: false });

  try {
    const message = `Your new password reset OTP is: <b>${otp}</b>. This OTP is valid for 10 minutes. Do not share this with anyone.`;
    await sendEmail({
      to: user.email,
      subject: "New Password Reset OTP",
      html: message,
    });

    return res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        message: "New password reset OTP sent to your email.",
      })
    );
  } catch (error) {
    user.passwordResetOTP = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    throw error;
  }
});

// ╔════════════════════╗
// ║     Verify OTP     ║
// ╚════════════════════╝
export const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({
    email,
    passwordResetExpires: { $gt: Date.now() },
  }).select("+passwordResetOTP +passwordResetExpires");

  if (!user) {
    throw new UnAuthorizedException(
      "Invalid or expired OTP, or incorrect email."
    );
  }
  if (user.isDeleted) {
    throw new UnAuthorizedException(
      "Your account has been deleted by admin. Please contact support."
    );
  }
  if (user.isBlock) {
    throw new UnAuthorizedException(
      "Your account is blocked. Please contact support."
    );
  }

  if (user.role === ROLES.ADMIN) {
    throw new UnAuthorizedException("This action is unavailable for admin.");
  }

  const isMatch = await user.compareOTP(otp);

  if (!isMatch) {
    throw new UnAuthorizedException("Invalid OTP.");
  }

  user.passwordResetOTP = undefined;
  user.passwordResetExpires = undefined;
  user.canChangePassword = true;
  user.canRequestResendOTP = false;
  await user.save({ validateBeforeSave: false });

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "OTP verified successfully. You can now reset your password.",
    })
  );
});

// ╔════════════════════════╗
// ║     Reset Password     ║
// ╚════════════════════════╝
export const resetPassword = asyncHandler(async (req, res) => {
  const { email, newPassword } = req.body;

  const user = await User.findOne({
    email,
    canChangePassword: true,
  }).select("+password");

  if (!user) {
    throw new UnAuthorizedException(
      "You cannot able to reset password, Follow forgot password process."
    );
  }
  if (user.isDeleted) {
    throw new UnAuthorizedException(
      "Your account has been deleted by admin. Please contact support."
    );
  }
  if (user.isBlock) {
    throw new UnAuthorizedException(
      "Your account is blocked. Please contact support."
    );
  }

  if (user.role === ROLES.ADMIN) {
    throw new UnAuthorizedException("This action is unavailable for admin.");
  }

  user.password = newPassword;
  user.canChangePassword = false;
  user.canRequestResendOTP = false;

  await user.save();

  const userResponse = user.toObject();
  delete userResponse.password;

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Your password has been updated successfully.",
      data: { user: userResponse },
    })
  );
});

// ╔══════════════════════╗
// ║     Edit Profile     ║
// ╚══════════════════════╝
export const editProfile = asyncHandler(async (req, res) => {
  const { userId, loggedInUser } = req;
  const { fullName, email, phoneNumber } = req.body;

  if (email && email !== loggedInUser.email) {
    const existingUser = await User.findOne({
      email,
      _id: { $ne: userId },
    });

    if (existingUser) {
      throw new ConflictException(
        "Email already exists. Please use a different email."
      );
    }
  }

  if (phoneNumber && phoneNumber !== loggedInUser.phoneNumber) {
    const existingUser = await User.findOne({
      phoneNumber,
      _id: { $ne: userId },
    });

    if (existingUser) {
      throw new ConflictException(
        "Phone number already exists. Please use a different phone number."
      );
    }
  }

  const updateData = {};

  if (fullName !== undefined) updateData.fullName = fullName;
  if (email !== undefined) updateData.email = email;
  if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;

  if (req.file && req.file.filename) {
    const baseUrl = process.env.BACKEND_BASE_URL;
    if (!baseUrl) {
      throw new InternalServerErrorException("Backend base URL is not set.");
    }
    const filePath = req.file.path.replace(/\\/g, "/");
    updateData.profilePicture = `${baseUrl}/${filePath}`;
  }

  const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  });

  const userResponse = updatedUser.toObject();
  delete userResponse.password;
  delete userResponse.passwordResetOTP;
  delete userResponse.passwordResetExpires;

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Profile updated successfully.",
      data: { user: userResponse },
    })
  );
});

// ╔═════════════════════╗
// ║     Get Profile     ║
// ╚═════════════════════╝
export const getProfile = asyncHandler(async (req, res) => {
  const { loggedInUser } = req;

  const userResponse = loggedInUser.toObject();

  delete userResponse.password;
  delete userResponse.passwordResetOTP;
  delete userResponse.passwordResetExpires;

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Profile retrieved successfully.",
      data: { user: userResponse },
    })
  );
});
