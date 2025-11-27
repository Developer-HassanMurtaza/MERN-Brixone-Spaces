import { Tour } from "../models/tour.model.js";
import { Property } from "../models/property.model.js";
import { asyncHandler, ApiResponse } from "../utils/index.js";
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from "../errors/index.js";
import { ROLES } from "../constants/index.js";

const TOUR_POPULATE_CONFIG = [
  {
    path: "propertyId",
    select:
      "propertyName listingType propertyType location address listingStatus price propertyImages",
  },
  {
    path: "createdBy",
    select: "fullName email phoneNumber role",
  },
];

// ╔═══════════════════════╗
// ║     Create a Tour     ║
// ╚═══════════════════════╝
export const createTour = asyncHandler(async (req, res) => {
  const { userId } = req;
  const { fullName, email, phoneNo, tourDate, propertyId } = req.body;

  const parsedTourDate = new Date(tourDate);
  if (Number.isNaN(parsedTourDate.getTime())) {
    throw new BadRequestException("Invalid tour date provided.");
  }

  const property = await Property.findById(propertyId).select("_id");
  if (!property) {
    throw new NotFoundException("Property not found.");
  }

  const tour = await Tour.create({
    fullName,
    email,
    phoneNo,
    tourDate: parsedTourDate,
    propertyId,
    createdBy: userId,
  });

  const populatedTour = await tour.populate(TOUR_POPULATE_CONFIG);

  return res.status(201).json(
    new ApiResponse({
      statusCode: 201,
      message: "Tour scheduled successfully.",
      data: { tour: populatedTour },
    })
  );
});

// ╔═══════════════════════════════╗
// ║     Get All Tours (ADMIN)     ║
// ╚═══════════════════════════════╝
export const getAllTours = asyncHandler(async (req, res) => {
  const { propertyId } = req.query;

  const filters = {};
  if (propertyId) {
    filters.propertyId = propertyId;
  }

  const tours = await Tour.find(filters)
    .populate(TOUR_POPULATE_CONFIG)
    .sort({ tourDate: 1, createdAt: -1 });

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Tours fetched successfully.",
      data: { tours },
    })
  );
});

// ╔═════════════════════════════════════════╗
// ║     Get Logged-In User Tours (Self)     ║
// ╚═════════════════════════════════════════╝
export const getMyTours = asyncHandler(async (req, res) => {
  const tours = await Tour.find({
    createdBy: req.userId,
  })
    .populate(TOUR_POPULATE_CONFIG)
    .sort({ tourDate: 1, createdAt: -1 });

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Tours fetched successfully.",
      data: { tours },
    })
  );
});

// ╔════════════════════════╗
// ║     Get Tour By ID     ║
// ╚════════════════════════╝
export const getTourById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const tour = await Tour.findById(id).populate(TOUR_POPULATE_CONFIG);

  if (!tour) {
    throw new NotFoundException("Tour not found.");
  }

  const isOwner = tour.createdBy?._id
    ? tour.createdBy._id.toString() === req.userId?.toString()
    : tour.createdBy?.toString() === req.userId?.toString();
  const isAdmin = req.loggedInUser?.role === ROLES.ADMIN;

  if (!isOwner && !isAdmin) {
    throw new ForbiddenException("You are not allowed to view this tour.");
  }

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Tour fetched successfully.",
      data: { tour },
    })
  );
});

// ╔════════════════════════╗
// ║     Delete Tour        ║
// ╚════════════════════════╝
export const deleteTour = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const tour = await Tour.findById(id);

  if (!tour) {
    throw new NotFoundException("Tour not found.");
  }

  const isOwner = tour.createdBy?.toString() === req.userId?.toString();
  const isAdmin = req.loggedInUser?.role === ROLES.ADMIN;

  if (!isOwner && !isAdmin) {
    throw new ForbiddenException("You are not allowed to delete this tour.");
  }

  await tour.deleteOne();

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Tour deleted successfully.",
    })
  );
});
