import { PropertyFeature } from "../models/propertyFeature.model.js";
import { asyncHandler, ApiResponse } from "../utils/index.js";
import { NotFoundException } from "../errors/index.js";

// ╔══════════════════════════════════════╗
// ║     Create Property Feature (ADM)    ║
// ╚══════════════════════════════════════╝
export const createPropertyFeature = asyncHandler(async (req, res) => {
  const { name, icon, type } = req.body;

  const feature = await PropertyFeature.create({ name, icon, type });

  return res.status(201).json(
    new ApiResponse({
      statusCode: 201,
      message: "Property feature created successfully.",
      data: { feature },
    })
  );
});

// ╔══════════════════════════════════════╗
// ║     Get All Property Features        ║
// ╚══════════════════════════════════════╝
export const getAllPropertyFeatures = asyncHandler(async (_req, res) => {
  const features = await PropertyFeature.find({}).sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Property features fetched successfully.",
      data: { features },
    })
  );
});

// ╔══════════════════════════════════════╗
// ║     Get Property Feature By ID       ║
// ╚══════════════════════════════════════╝
export const getPropertyFeatureById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const feature = await PropertyFeature.findById(id);
  if (!feature) {
    throw new NotFoundException("Property feature not found.");
  }

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Property feature fetched successfully.",
      data: { feature },
    })
  );
});

// ╔══════════════════════════════════════╗
// ║     Update Property Feature (ADM)    ║
// ╚══════════════════════════════════════╝
export const updatePropertyFeature = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, icon, type } = req.body;

  const feature = await PropertyFeature.findById(id);
  if (!feature) {
    throw new NotFoundException("Property feature not found.");
  }

  if (name !== undefined) feature.name = name;
  if (icon !== undefined) {
    feature.icon = icon;
  }
  if (type !== undefined) {
    feature.type = type;
  }

  await feature.save();

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Property feature updated successfully.",
      data: { feature },
    })
  );
});

// ╔══════════════════════════════════════╗
// ║     Delete Property Feature (ADM)    ║
// ╚══════════════════════════════════════╝
export const deletePropertyFeature = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const feature = await PropertyFeature.findById(id);
  if (!feature) {
    throw new NotFoundException("Property feature not found.");
  }

  await feature.deleteOne();

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Property feature deleted successfully.",
    })
  );
});


