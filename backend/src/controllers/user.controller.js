import { User } from "../models/user.model.js";
import { ROLES } from "../constants/index.js";
import { asyncHandler, ApiResponse } from "../utils/index.js";
import { ForbiddenException, NotFoundException } from "../errors/index.js";

// ╔═══════════════════════════════╗
// ║     Get All Users (ADMIN)     ║
// ╚═══════════════════════════════╝
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ role: { $ne: ROLES.ADMIN } }).sort({
    createdAt: -1,
  });

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Users fetched successfully.",
      data: { users },
    })
  );
});

// ╔═══════════════════════════════════╗
// ║     Toggle Block User (ADMIN)     ║
// ╚═══════════════════════════════════╝
export const toggleBlockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);

  if (!user) {
    throw new NotFoundException("User not found.");
  }

  user.isBlock = !Boolean(user.isBlock);
  await user.save({ validateBeforeSave: false });

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: user.isBlock
        ? "User blocked successfully."
        : "User unblocked successfully.",
    })
  );
});

// ╔════════════════════════════════╗
// ║     Get User By ID (ADMIN)     ║
// ╚════════════════════════════════╝
export const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);

  if (!user) {
    throw new NotFoundException("User not found.");
  }

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "User fetched successfully.",
      data: { user },
    })
  );
});

// ╔═════════════════════════════╗
// ║     Delete User (ADMIN)     ║
// ╚═════════════════════════════╝
export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);

  if (!user) {
    throw new NotFoundException("User not found.");
  }

  if (user.role === ROLES.ADMIN) {
    throw new ForbiddenException("Admin account cannot be deleted.");
  }

  await user.deleteOne();

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "User deleted successfully.",
    })
  );
});
