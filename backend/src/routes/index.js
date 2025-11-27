import { Router } from "express";
import { authRouter } from "./auth.routes.js";
import { testimonialRouter } from "./testimonial.routes.js";
import { userRouter } from "./user.routes.js";
import { propertyFeatureRouter } from "./propertyFeature.routes.js";
import { propertyRouter } from "./property.routes.js";
import { tourRouter } from "./tour.routes.js";
import { dashboardRouter } from "./dashboard.routes.js";
import { contactUsRouter } from "./contactUs.routes.js";
import { memberRouter } from "./member.routes.js";
import { investRouter } from "./invest.routes.js";

const router = Router();

// AUTH ROUTES
router.use("/auth", authRouter);

// TESTIMONIAL ROUTES
router.use("/testimonials", testimonialRouter);

// USER ROUTES (ADMIN)
router.use("/users", userRouter);

// PROPERTY FEATURES ROUTES
router.use("/property-features", propertyFeatureRouter);

// PROPERTY ROUTES
router.use("/properties", propertyRouter);

// TOUR ROUTES
router.use("/tours", tourRouter);

// DASHBOARD ROUTES
router.use("/dashboard", dashboardRouter);

// CONTACT US ROUTES
router.use("/contact-us", contactUsRouter);

// MEMBER ROUTES (ADMIN)
router.use("/members", memberRouter);

// INVEST ROUTES
router.use("/invest", investRouter);

export { router };
