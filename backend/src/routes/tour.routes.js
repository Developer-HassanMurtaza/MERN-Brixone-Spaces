import { Router } from "express";
import {
  createTour,
  getAllTours,
  getMyTours,
  getTourById,
  deleteTour,
} from "../controllers/index.js";
import {
  loginAuth,
  adminAuth,
  requiredFields,
  trimBodyObject,
  emailValidator,
} from "../middlewares/index.js";

const tourRouter = Router();
tourRouter.use(loginAuth);

/**
 * @swagger
 * tags:
 *   - name: Tours
 *     description: Property tour scheduling and management
 */

/**
 * @swagger
 * /tours:
 *   post:
 *     summary: Schedule a tour for a property
 *     tags: [Tours]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - email
 *               - phoneNo
 *               - tourDate
 *               - propertyId
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phoneNo:
 *                 type: string
 *               tourDate:
 *                 type: string
 *                 format: date-time
 *               propertyId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tour scheduled successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
// SCHEDULE TOUR
tourRouter.post(
  "/",
  trimBodyObject,
  requiredFields(["fullName", "email", "phoneNo", "tourDate", "propertyId"]),
  emailValidator,
  createTour
);

/**
 * @swagger
 * /tours:
 *   get:
 *     summary: Get all tours (admin)
 *     tags: [Tours]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: propertyId
 *         schema:
 *           type: string
 *         description: Filter by propertyId
 *     responses:
 *       200:
 *         description: Tours fetched successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
// GET ALL TOURS (ADMIN)
tourRouter.get("/", adminAuth, getAllTours);

/**
 * @swagger
 * /tours/my:
 *   get:
 *     summary: Get tours created by the logged-in user
 *     tags: [Tours]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tours fetched successfully
 *       401:
 *         description: Unauthorized
 */
// GET MY TOURS
tourRouter.get("/my", getMyTours);

/**
 * @swagger
 * /tours/{id}:
 *   get:
 *     summary: Get a tour by ID
 *     tags: [Tours]
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
 *         description: Tour fetched successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Tour not found
 */
// GET TOUR BY ID
tourRouter.get("/:id", getTourById);

/**
 * @swagger
 * /tours/{id}:
 *   delete:
 *     summary: Delete a tour
 *     tags: [Tours]
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
 *         description: Tour deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Tour not found
 */
// DELETE TOUR
tourRouter.delete("/:id", deleteTour);

export { tourRouter };
