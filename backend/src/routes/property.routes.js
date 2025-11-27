import { Router } from "express";
import {
  addProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  markPropertySoldOut,
  getAllSoldOutProperties,
} from "../controllers/index.js";
import {
  requiredFields,
  trimBodyObject,
  loginAuth,
  adminAuth,
  upload,
} from "../middlewares/index.js";

const propertyRouter = Router();

/**
 * @swagger
 * tags:
 *   - name: Properties
 *     description: Property management
 */

/**
 * @swagger
 * /properties:
 *   get:
 *     summary: Get all properties
 *     tags: [Properties]
 *     parameters:
 *       - in: query
 *         name: listingType
 *         schema:
 *           type: string
 *         description: Filter by listing type
 *     responses:
 *       200:
 *         description: Properties fetched successfully
 */
// GET ALL (PUBLIC)
propertyRouter.get("/", getAllProperties);

/**
 * @swagger
 * /properties/sold-out:
 *   get:
 *     summary: Get all sold out properties
 *     tags: [Properties]
 *     parameters:
 *       - in: query
 *         name: listingType
 *         schema:
 *           type: string
 *         description: Filter by listing type
 *     responses:
 *       200:
 *         description: Sold out properties fetched successfully
 */
// GET ALL SOLD OUT (PUBLIC)
propertyRouter.get("/sold-out", getAllSoldOutProperties);

/**
 * @swagger
 * /properties/{id}:
 *   get:
 *     summary: Get property by ID
 *     tags: [Properties]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Property fetched successfully
 *       404:
 *         description: Property not found
 */
// GET BY ID (PUBLIC)
propertyRouter.get("/:id", getPropertyById);

/**
 * @swagger
 * /properties:
 *   post:
 *     summary: Create a property
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - propertyName
 *               - aboutDescription
 *               - price
 *               - bedRooms
 *               - bathRooms
 *               - storeRooms
 *               - kitchens
 *               - area
 *               - available
 *               - location
 *               - address
 *               - furnishingStatus
 *               - leaseType
 *               - numberOfFloors
 *               - floorPlans
 *               - listingType
 *               - propertyType
 *             properties:
 *               propertyName:
 *                 type: string
 *               aboutDescription:
 *                 type: string
 *               price:
 *                 type: number
 *               bedRooms:
 *                 type: number
 *               bathRooms:
 *                 type: number
 *               storeRooms:
 *                 type: number
 *               kitchens:
 *                 type: number
 *               area:
 *                 type: number
 *               available:
 *                 type: string
 *               location:
 *                 type: string
 *               address:
 *                 type: string
 *               furnishingStatus:
 *                 type: string
 *               leaseType:
 *                 type: string
 *               propertyOverview:
 *                 type: array
 *                 items:
 *                   type: string
 *               numberOfFloors:
 *                 type: number
 *               floorPlans:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - floorName
 *                     - floorDescription
 *                   properties:
 *                     floorName:
 *                       type: string
 *                     floorDescription:
 *                       type: string
 *               listingType:
 *                 type: string
 *               propertyType:
 *                 type: string
 *               propertyImages:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               floorImages:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               propertyVideo:
 *                 type: string
 *                 format: binary
 *               projectBrochure:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Property created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Property feature not found
 */
// CREATE (ADMIN)
propertyRouter.post(
  "/",
  loginAuth,
  adminAuth,
  upload.fields([
    { name: "propertyImages", maxCount: 50 },
    { name: "floorImages", maxCount: 20 },
    { name: "propertyVideo", maxCount: 1 },
    { name: "projectBrochure", maxCount: 1 },
  ]),
  trimBodyObject,
  requiredFields([
    "propertyName",
    "aboutDescription",
    "price",
    "bedRooms",
    "bathRooms",
    "storeRooms",
    "kitchens",
    "area",
    "available",
    "location",
    "address",
    "furnishingStatus",
    "leaseType",
    "floorPlans",
    "numberOfFloors",
    "listingType",
    "propertyType",
  ]),
  addProperty
);

/**
 * @swagger
 * /properties/{id}:
 *   put:
 *     summary: Update a property
 *     tags: [Properties]
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
 *               propertyName:
 *                 type: string
 *               aboutDescription:
 *                 type: string
 *               price:
 *                 type: number
 *               bedRooms:
 *                 type: number
 *               bathRooms:
 *                 type: number
 *               storeRooms:
 *                 type: number
 *               kitchens:
 *                 type: number
 *               area:
 *                 type: number
 *               available:
 *                 type: string
 *               location:
 *                 type: string
 *               address:
 *                 type: string
 *               furnishingStatus:
 *                 type: string
 *               leaseType:
 *                 type: string
 *               propertyOverview:
 *                 type: array
 *                 items:
 *                   type: string
 *               numberOfFloors:
 *                 type: number
 *               floorPlans:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     floorName:
 *                       type: string
 *                     floorDescription:
 *                       type: string
 *               listingType:
 *                 type: string
 *               propertyType:
 *                 type: string
 *               listingStatus:
 *                 type: string
 *               propertyImages:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               floorImages:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               propertyVideo:
 *                 type: string
 *                 format: binary
 *               projectBrochure:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Property updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Property not found
 */
// UPDATE (ADMIN)
propertyRouter.put(
  "/:id",
  loginAuth,
  adminAuth,
  upload.fields([
    { name: "propertyImages", maxCount: 50 },
    { name: "floorImages", maxCount: 20 },
    { name: "propertyVideo", maxCount: 1 },
    { name: "projectBrochure", maxCount: 1 },
  ]),
  trimBodyObject,
  updateProperty
);

/**
 * @swagger
 * /properties/{id}/mark-sold-out:
 *   patch:
 *     summary: Mark property as sold out
 *     tags: [Properties]
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
 *         description: Property marked as sold out successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Property not found
 */
// MARK AS SOLD OUT (ADMIN)
propertyRouter.patch(
  "/:id/mark-sold-out",
  loginAuth,
  adminAuth,
  markPropertySoldOut
);

export { propertyRouter };
