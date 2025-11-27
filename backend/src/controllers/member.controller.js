import { User } from "../models/user.model.js";
import { ROLES } from "../constants/index.js";
import { asyncHandler, ApiResponse } from "../utils/index.js";
import { NotFoundException, ForbiddenException } from "../errors/index.js";

// ╔═════════════════════════════════╗
// ║     Get All Members (Admin)     ║
// ╚═════════════════════════════════╝
export const getAllMembers = asyncHandler(async (req, res) => {
  const members = await User.find({
    role: { $ne: ROLES.ADMIN },
  })
    .select("-password")
    .sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Members fetched successfully.",
      data: { members },
    })
  );
});

// ╔══════════════════════════════════╗
// ║     Get Member By ID (Admin)     ║
// ╚══════════════════════════════════╝
export const getMemberById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const member = await User.findById(id).select("-password");

  if (!member) {
    throw new NotFoundException("Member not found.");
  }

  if (member.role === ROLES.ADMIN) {
    throw new ForbiddenException(
      "Admin account cannot be accessed through this endpoint."
    );
  }

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Member fetched successfully.",
      data: { member },
    })
  );
});

// ╔══════════════════════════════╗
// ║     Block Member (Admin)     ║
// ╚══════════════════════════════╝
export const blockMember = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const member = await User.findById(id);

  if (!member) {
    throw new NotFoundException("Member not found.");
  }

  if (member.role === ROLES.ADMIN) {
    throw new ForbiddenException("Admin account cannot be blocked.");
  }

  if (member.isBlock) {
    throw new ForbiddenException("Member is already blocked.");
  }

  member.isBlock = true;
  await member.save({ validateBeforeSave: false });

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Member blocked successfully.",
    })
  );
});

// ╔═══════════════════════════════════╗
// ║     Unblock Member (Admin)        ║
// ╚═══════════════════════════════════╝
export const unblockMember = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const member = await User.findById(id);

  if (!member) {
    throw new NotFoundException("Member not found.");
  }

  if (member.role === ROLES.ADMIN) {
    throw new ForbiddenException("Admin account cannot be unblocked.");
  }

  if (!member.isBlock) {
    throw new ForbiddenException("Member is not blocked.");
  }

  member.isBlock = false;
  await member.save({ validateBeforeSave: false });

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Member unblocked successfully.",
    })
  );
});

// ╔═══════════════════════════════════╗
// ║     Delete Member (Admin)         ║
// ╚═══════════════════════════════════╝
export const deleteMember = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const member = await User.findById(id);

  if (!member) {
    throw new NotFoundException("Member not found.");
  }

  if (member.role === ROLES.ADMIN) {
    throw new ForbiddenException("Admin account cannot be deleted.");
  }

  if (member.isDeleted) {
    throw new ForbiddenException("Member is already deleted.");
  }

  member.isDeleted = true;
  await member.save({ validateBeforeSave: false });

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Member deleted successfully.",
    })
  );
});
