import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import { UnAuthorizedException, ForbiddenException } from "../errors/index.js";

/** _____ Middleware : Login Auth _____ */
export const loginAuth = asyncHandler(async (req, res, next) => {
  const authHeader = req?.headers?.authorization;

  if (!authHeader) {
    throw new UnAuthorizedException("Authorization header is required.");
  }

  if (!authHeader.startsWith("Bearer ")) {
    throw new UnAuthorizedException(
      "Invalid token format. Use 'Bearer <token>'"
    );
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    throw new UnAuthorizedException("Token must be provided");
  }

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (jwtError) {
    if (jwtError.name === "TokenExpiredError") {
      throw new UnAuthorizedException("Token has expired");
    } else if (jwtError.name === "JsonWebTokenError") {
      throw new UnAuthorizedException("Invalid token");
    }
    throw jwtError;
  }

  const user = await User.findOne({
    _id: payload.id,
  });

  if (!user) {
    throw new ForbiddenException(
      "User not found by provided token or account has been deleted"
    );
  }

  if (user.isDeleted) {
    throw new ForbiddenException(
      "Your account has been deleted by admin. Please contact support team."
    );
  }

  if (user.isBlock) {
    throw new ForbiddenException(
      "Your account is blocked. Please contact support team."
    );
  }

  req.userId = user._id;
  req.loggedInUser = user;

  next();
});
