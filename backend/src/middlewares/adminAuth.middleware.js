import { asyncHandler } from "../utils/asyncHandler.util.js";
import { ForbiddenException } from "../errors/index.js";
import { ROLES } from "../constants/index.js";

// ╔═════════════════════════════════╗
// ║     Middleware : Admin Auth     ║
// ╚═════════════════════════════════╝
export const adminAuth = asyncHandler(async (req, _res, next) => {
  if (req.loggedInUser?.role !== ROLES.ADMIN) {
    throw new ForbiddenException("Only admin can access this resource.");
  }
  next();
});
