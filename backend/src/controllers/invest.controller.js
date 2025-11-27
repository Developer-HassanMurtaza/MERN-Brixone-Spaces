import { Invest } from "../models/invest.model.js";
import { asyncHandler, ApiResponse } from "../utils/index.js";
import { NotFoundException } from "../errors/index.js";

// ╔═══════════════════════╗
// ║     Create Invest     ║
// ╚═══════════════════════╝
export const createInvest = asyncHandler(async (req, res) => {
  const { fullName, email, phoneNo, lookingTo, message } = req.body;

  const invest = await Invest.create({
    fullName,
    email,
    phoneNo,
    lookingTo,
    message,
  });

  return res.status(201).json(
    new ApiResponse({
      statusCode: 201,
      message: "Investment inquiry submitted successfully.",
      data: { invest },
    })
  );
});

// ╔════════════════════════════════╗
// ║     Get All Invest (Admin)     ║
// ╚════════════════════════════════╝
export const getAllInvest = asyncHandler(async (req, res) => {
  const invests = await Invest.find().sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Investment inquiries fetched successfully.",
      data: { invests },
    })
  );
});

// ╔══════════════════════════════════╗
// ║     Get Invest By ID (Admin)     ║
// ╚══════════════════════════════════╝
export const getInvestById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const invest = await Invest.findById(id);

  if (!invest) {
    throw new NotFoundException("Investment inquiry not found.");
  }

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Investment inquiry fetched successfully.",
      data: { invest },
    })
  );
});

// ╔═══════════════════════════════╗
// ║     Delete Invest (Admin)     ║
// ╚═══════════════════════════════╝
export const deleteInvest = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const invest = await Invest.findById(id);

  if (!invest) {
    throw new NotFoundException("Investment inquiry not found.");
  }

  await invest.deleteOne();

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Investment inquiry deleted successfully.",
    })
  );
});
