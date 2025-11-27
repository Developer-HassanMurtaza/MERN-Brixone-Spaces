import { Router } from "express";
import {
  createInvest,
  getAllInvest,
  getInvestById,
  deleteInvest,
} from "../controllers/index.js";
import {
  loginAuth,
  adminAuth,
  requiredFields,
  trimBodyObject,
  emailValidator,
} from "../middlewares/index.js";

const investRouter = Router();

/**
 * @swagger
 * tags:
 *   - name: Invest
 *     description: Investment inquiry management
 */

/**
 * @swagger
 * /invest:
 *   post:
 *     summary: Submit an investment inquiry
 *     tags: [Invest]
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
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Investment inquiry submitted successfully
 *       400:
 *         description: Bad request
 */
// CREATE (PUBLIC)
investRouter.post(
  "/",
  trimBodyObject,
  requiredFields(["fullName", "email", "phoneNo", "lookingTo", "message"]),
  emailValidator,
  createInvest
);

/**
 * @swagger
 * /invest:
 *   get:
 *     summary: Get all investment inquiries
 *     tags: [Invest]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Investment inquiries fetched successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
// GET ALL (ADMIN)
investRouter.get("/", loginAuth, adminAuth, getAllInvest);

/**
 * @swagger
 * /invest/{id}:
 *   get:
 *     summary: Get investment inquiry by ID
 *     tags: [Invest]
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
 *         description: Investment inquiry fetched successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Investment inquiry not found
 */
// GET BY ID (ADMIN)
investRouter.get("/:id", loginAuth, adminAuth, getInvestById);

/**
 * @swagger
 * /invest/{id}:
 *   delete:
 *     summary: Delete an investment inquiry
 *     tags: [Invest]
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
 *         description: Investment inquiry deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Investment inquiry not found
 */
// DELETE (ADMIN)
investRouter.delete("/:id", loginAuth, adminAuth, deleteInvest);

export { investRouter };
