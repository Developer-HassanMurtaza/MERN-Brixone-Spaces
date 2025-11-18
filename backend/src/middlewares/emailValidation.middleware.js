import { asyncHandler } from "../utils/asyncHandler.util.js";
import { BadRequestException } from "../errors/index.js";

// ╔════════════════════════════════════════╗
// ║      Middleware : Email Validator      ║
// ╚════════════════════════════════════════╝
export const emailValidator = asyncHandler(async (req, res, next) => {
  if (!req.body.email) {
    throw new BadRequestException("Email is required");
  }

  req.body.email = req.body.email.trim().toLowerCase();

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailRegex.test(req.body.email)) {
    throw new BadRequestException("Invalid email format");
  }

  const allowedDomains = ["gmail.com", "yopmail.com"];
  const emailDomain = req.body.email.split("@")[1];

  if (!allowedDomains.includes(emailDomain)) {
    throw new BadRequestException(
      "Only Gmail addresses are allowed. Please use a valid Gmail account."
    );
  }

  next();
});
