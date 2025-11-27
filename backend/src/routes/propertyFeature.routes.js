import { Router } from "express";
import {
  createPropertyFeature,
  getAllPropertyFeatures,
  getPropertyFeatureById,
  updatePropertyFeature,
  deletePropertyFeature,
} from "../controllers/index.js";
import {
  requiredFields,
  trimBodyObject,
  loginAuth,
  adminAuth,
} from "../middlewares/index.js";

const propertyFeatureRouter = Router();

/**
 * @swagger
 * tags:
 *   - name: Property Features
 *     description: Property features management
 */

/**
 * @swagger
 * /property-features:
 *   get:
 *     summary: Get all property features
 *     tags: [Property Features]
 *     responses:
 *       200:
 *         description: List of property features
 */
// GET ALL (PUBLIC)
propertyFeatureRouter.get("/", getAllPropertyFeatures);

/**
 * @swagger
 * /property-features/{id}:
 *   get:
 *     summary: Get a property feature by ID
 *     tags: [Property Features]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Property feature found
 *       404:
 *         description: Not found
 */
// GET BY ID (PUBLIC)
propertyFeatureRouter.get("/:id", getPropertyFeatureById);

/**
 * @swagger
 * /property-features:
 *   post:
 *     summary: Create a property feature
 *     tags: [Property Features]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *               icon:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [boolean, number]
 *                 default: boolean
 *     responses:
 *       201:
 *         description: Property feature created
 *       403:
 *         description: Forbidden
 *       409:
 *         description: Name already exists
 */
// CREATE (ADMIN)
propertyFeatureRouter.post(
  "/",
  loginAuth,
  adminAuth,
  trimBodyObject,
  requiredFields(["name"]),
  createPropertyFeature
);

/**
 * @swagger
 * /property-features/{id}:
 *   patch:
 *     summary: Update a property feature
 *     tags: [Property Features]
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
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               icon:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [boolean, number]
 *     responses:
 *       200:
 *         description: Property feature updated
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 *       409:
 *         description: Name already exists
 */
// UPDATE (ADMIN)
propertyFeatureRouter.patch(
  "/:id",
  loginAuth,
  adminAuth,
  trimBodyObject,
  updatePropertyFeature
);

/**
 * @swagger
 * /property-features/{id}:
 *   delete:
 *     summary: Delete a property feature
 *     tags: [Property Features]
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
 *         description: Property feature deleted
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 */
// DELETE (ADMIN)
propertyFeatureRouter.delete(
  "/:id",
  loginAuth,
  adminAuth,
  deletePropertyFeature
);

export { propertyFeatureRouter };
