import { Router } from "express";
import {
  createContactUs,
  getAllContactUs,
  getContactUsById,
  deleteContactUs,
} from "../controllers/index.js";
import {
  loginAuth,
  adminAuth,
  requiredFields,
  trimBodyObject,
  emailValidator,
} from "../middlewares/index.js";

const contactUsRouter = Router();

/**
 * @swagger
 * tags:
 *   - name: Contact Us
 *     description: Contact form management
 */

/**
 * @swagger
 * /contact-us:
 *   post:
 *     summary: Submit a contact form
 *     tags: [Contact Us]
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
 *               - lookingTo
 *               - propertyType
 *               - category
 *               - message
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *               phoneNo:
 *                 type: string
 *               lookingTo:
 *                 type: string
 *               propertyType:
 *                 type: string
 *               category:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Contact form submitted successfully
 *       400:
 *         description: Bad request
 */
// CREATE (PUBLIC)
contactUsRouter.post(
  "/",
  trimBodyObject,
  requiredFields([
    "fullName",
    "email",
    "phoneNo",
    "lookingTo",
    "propertyType",
    "category",
    "message",
  ]),
  emailValidator,
  createContactUs
);

/**
 * @swagger
 * /contact-us:
 *   get:
 *     summary: Get all contact forms
 *     tags: [Contact Us]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Contact forms fetched successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
// GET ALL (ADMIN)
contactUsRouter.get("/", loginAuth, adminAuth, getAllContactUs);

/**
 * @swagger
 * /contact-us/{id}:
 *   get:
 *     summary: Get contact form by ID
 *     tags: [Contact Us]
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
 *         description: Contact form fetched successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Contact form not found
 */
// GET BY ID (ADMIN)
contactUsRouter.get("/:id", loginAuth, adminAuth, getContactUsById);

/**
 * @swagger
 * /contact-us/{id}:
 *   delete:
 *     summary: Delete a contact form
 *     tags: [Contact Us]
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
 *         description: Contact form deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Contact form not found
 */
// DELETE (ADMIN)
contactUsRouter.delete("/:id", loginAuth, adminAuth, deleteContactUs);

export { contactUsRouter };
