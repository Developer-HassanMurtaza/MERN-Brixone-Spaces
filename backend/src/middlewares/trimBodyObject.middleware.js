import { asyncHandler } from "../utils/asyncHandler.util.js";

// ╔═════════════════════════════════════════════════════════════════════════╗
// ║    Middleware: Trim body object, including nested fields and arrays     ║
// ╚═════════════════════════════════════════════════════════════════════════╝
export const trimBodyObject = asyncHandler(async (req, res, next) => {
  const trimValue = (value) => {
    if (typeof value === "string") {
      return value.trim();
    }

    if (Array.isArray(value)) {
      return value.map((item) => trimValue(item));
    }

    if (typeof value === "object" && value !== null) {
      for (const key in value) {
        value[key] = trimValue(value[key]);
      }
    }

    return value;
  };

  if (req.body) {
    req.body = trimValue(req.body);
  }

  next();
});
