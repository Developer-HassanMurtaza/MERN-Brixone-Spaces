import { NotFoundException } from "../errors/index.js";

// ╔═════════════════════════════════════════════════╗
// ║      Middleware : Route note found handler      ║
// ╚═════════════════════════════════════════════════╝
export const routeNotFound = (req, res, next) => {
  throw new NotFoundException("Route doesn't found");
};
