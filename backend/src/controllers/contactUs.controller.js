import { ContactUs } from "../models/contactUs.model.js";
import { asyncHandler, ApiResponse } from "../utils/index.js";
import { NotFoundException } from "../errors/index.js";

// ╔═══════════════════════════╗
// ║     Create Contact Us     ║
// ╚═══════════════════════════╝
export const createContactUs = asyncHandler(async (req, res) => {
  const {
    fullName,
    email,
    phoneNo,
    lookingTo,
    propertyType,
    category,
    message,
  } = req.body;

  const contactUs = await ContactUs.create({
    fullName,
    email,
    phoneNo,
    lookingTo,
    propertyType,
    category,
    message,
  });

  return res.status(201).json(
    new ApiResponse({
      statusCode: 201,
      message: "Contact form submitted successfully.",
      data: { contactUs },
    })
  );
});

// ╔═══════════════════════════════════════╗
// ║     Get All Contact Us (Admin)        ║
// ╚═══════════════════════════════════════╝
export const getAllContactUs = asyncHandler(async (req, res) => {
  const contacts = await ContactUs.find().sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Contact forms fetched successfully.",
      data: { contacts },
    })
  );
});

// ╔═══════════════════════════════════════╗
// ║     Get Contact Us By ID (Admin)      ║
// ╚═══════════════════════════════════════╝
export const getContactUsById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const contactUs = await ContactUs.findById(id);

  if (!contactUs) {
    throw new NotFoundException("Contact form not found.");
  }

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Contact form fetched successfully.",
      data: { contactUs },
    })
  );
});

// ╔═══════════════════════════════════════╗
// ║     Delete Contact Us (Admin)         ║
// ╚═══════════════════════════════════════╝
export const deleteContactUs = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const contactUs = await ContactUs.findById(id);

  if (!contactUs) {
    throw new NotFoundException("Contact form not found.");
  }

  await contactUs.deleteOne();

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Contact form deleted successfully.",
    })
  );
});
