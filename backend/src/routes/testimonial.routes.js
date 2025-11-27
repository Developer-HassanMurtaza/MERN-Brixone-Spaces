import { Router } from "express";
import {
  createTestimonial,
  getAllTestimonialsList,
  getTestimonialById,
  updateTestimonial,
  deleteTestimonial,
} from "../controllers/index.js";
import {
  loginAuth,
  requiredFields,
  trimBodyObject,
  upload,
} from "../middlewares/index.js";

const testimonialRouter = Router();

/**
 * @swagger
 * tags:
 *   - name: Testimonials
 *     description: Client testimonials management
 */

/**
 * @swagger
 * /testimonials:
 *   post:
 *     summary: Create a testimonial
 *     tags: [Testimonials]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [fullName, designation, clientFeedback]
 *             properties:
 *               fullName:
 *                 type: string
 *               designation:
 *                 type: string
 *               clientFeedback:
 *                 type: string
 *               userImage:
 *                 type: string
 *                 format: binary
 *               propertyImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Testimonial created
 *       401:
 *         description: Unauthorized
 */
// CREATE
testimonialRouter.post(
  "/",
  loginAuth,
  upload.fields([
    { name: "userImage", maxCount: 1 },
    { name: "propertyImage", maxCount: 1 },
  ]),
  trimBodyObject,
  requiredFields(["fullName", "designation", "clientFeedback"]),
  createTestimonial
);

/**
 * @swagger
 * /testimonials:
 *   get:
 *     summary: Get all testimonials
 *     tags: [Testimonials]
 *     responses:
 *       200:
 *         description: List of testimonials
 */
// GET ALL
testimonialRouter.get("/", getAllTestimonialsList);

/**
 * @swagger
 * /testimonials/{id}:
 *   get:
 *     summary: Get a testimonial by ID
 *     tags: [Testimonials]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Testimonial found
 *       404:
 *         description: Not found
 */
// GET BY ID
testimonialRouter.get("/:id", getTestimonialById);

/**
 * @swagger
 * /testimonials/{id}:
 *   patch:
 *     summary: Update a testimonial by ID
 *     tags: [Testimonials]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               designation:
 *                 type: string
 *               clientFeedback:
 *                 type: string
 *               userImage:
 *                 type: string
 *                 format: binary
 *               propertyImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Testimonial updated
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 */
// UPDATE BY ID
testimonialRouter.patch(
  "/:id",
  loginAuth,
  upload.fields([
    { name: "userImage", maxCount: 1 },
    { name: "propertyImage", maxCount: 1 },
  ]),
  trimBodyObject,
  updateTestimonial
);

/**
 * @swagger
 * /testimonials/{id}:
 *   delete:
 *     summary: Delete a testimonial
 *     tags: [Testimonials]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Testimonial deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 */
// DELETE
testimonialRouter.delete("/:id", loginAuth, deleteTestimonial);

export { testimonialRouter };
