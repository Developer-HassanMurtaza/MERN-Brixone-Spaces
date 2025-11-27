import { Testimonial } from "../models/testimonial.model.js";
import { asyncHandler, ApiResponse } from "../utils/index.js";
import {
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
} from "../errors/index.js";
import { ROLES } from "../constants/index.js";

// ╔════════════════════════════╗
// ║     Create Testimonial     ║
// ╚════════════════════════════╝
export const createTestimonial = asyncHandler(async (req, res) => {
  const { fullName, designation, clientFeedback } = req.body;

  const baseUrl = process.env.BACKEND_BASE_URL;
  if (!baseUrl) {
    throw new InternalServerErrorException(
      "Backend base URL is not set in the environment variables."
    );
  }

  const files = req.files || {};
  if (!files.userImage?.[0]?.path) {
    throw new NotFoundException("User image is required.");
  }
  if (!files.propertyImage?.[0]?.path) {
    throw new NotFoundException("Property image is required.");
  }

  const userImage = `${baseUrl}/${files.userImage[0].path.replace(/\\/g, "/")}`;
  const propertyImage = `${baseUrl}/${files.propertyImage[0].path.replace(
    /\\/g,
    "/"
  )}`;

  const testimonial = await Testimonial.create({
    fullName,
    designation,
    clientFeedback,
    userImage,
    propertyImage,
    createdBy: req.userId,
  });

  return res.status(201).json(
    new ApiResponse({
      statusCode: 201,
      message: "Testimonial created successfully.",
      data: { testimonial },
    })
  );
});

// ╔═══════════════════════════════════╗
// ║     Get All Testimonials List     ║
// ╚═══════════════════════════════════╝
export const getAllTestimonialsList = asyncHandler(async (_req, res) => {
  const testimonials = await Testimonial.find({}).sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Testimonials fetched successfully.",
      data: {
        testimonials,
      },
    })
  );
});

// ╔═══════════════════════════════╗
// ║     Get Testimonial By ID     ║
// ╚═══════════════════════════════╝
export const getTestimonialById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const testimonial = await Testimonial.findById(id);
  if (!testimonial) {
    throw new NotFoundException("Testimonial not found.");
  }

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Testimonial fetched successfully.",
      data: { testimonial },
    })
  );
});

// ╔════════════════════════════╗
// ║     Update Testimonial     ║
// ╚════════════════════════════╝
export const updateTestimonial = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { fullName, designation, clientFeedback } = req.body;

  const testimonial = await Testimonial.findById(id);
  if (!testimonial) {
    throw new NotFoundException("Testimonial not found.");
  }

  const isOwner = testimonial.createdBy?.toString() === req.userId?.toString();
  const isAdmin = req.loggedInUser?.role === ROLES.ADMIN;
  if (!isOwner && !isAdmin) {
    throw new ForbiddenException(
      "You are not allowed to modify this testimonial."
    );
  }

  const baseUrl = process.env.BACKEND_BASE_URL;
  if (!baseUrl) {
    throw new InternalServerErrorException(
      "Backend base URL is not set in the environment variables."
    );
  }

  if (fullName !== undefined) testimonial.fullName = fullName;
  if (designation !== undefined) testimonial.designation = designation;
  if (clientFeedback !== undefined) testimonial.clientFeedback = clientFeedback;

  const files = req.files || {};
  if (
    Object.prototype.hasOwnProperty.call(files, "userImage") &&
    files.userImage?.[0]?.path
  ) {
    const filePath = files.userImage[0].path.replace(/\\/g, "/");
    testimonial.userImage = `${baseUrl}/${filePath}`;
  }
  if (
    Object.prototype.hasOwnProperty.call(files, "propertyImage") &&
    files.propertyImage?.[0]?.path
  ) {
    const filePath = files.propertyImage[0].path.replace(/\\/g, "/");
    testimonial.propertyImage = `${baseUrl}/${filePath}`;
  }

  await testimonial.save();

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Testimonial updated successfully.",
      data: { testimonial },
    })
  );
});

// ╔════════════════════════════╗
// ║     Delete Testimonial     ║
// ╚════════════════════════════╝
export const deleteTestimonial = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const testimonial = await Testimonial.findById(id);
  if (!testimonial) {
    throw new NotFoundException("Testimonial not found.");
  }

  const isOwner = testimonial.createdBy?.toString() === req.userId?.toString();
  const isAdmin = req.loggedInUser?.role === ROLES.ADMIN;
  if (!isOwner && !isAdmin) {
    throw new ForbiddenException(
      "You are not allowed to delete this testimonial."
    );
  }

  await testimonial.deleteOne();

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Testimonial deleted successfully.",
    })
  );
});
