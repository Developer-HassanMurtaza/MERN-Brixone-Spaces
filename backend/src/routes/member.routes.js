import { Router } from "express";
import {
  getAllMembers,
  getMemberById,
  blockMember,
  unblockMember,
  deleteMember,
} from "../controllers/index.js";
import { loginAuth, adminAuth } from "../middlewares/index.js";

const memberRouter = Router();
memberRouter.use(loginAuth);
memberRouter.use(adminAuth);

/**
 * @swagger
 * tags:
 *   - name: Members
 *     description: Member management (admin only)
 */

/**
 * @swagger
 * /members:
 *   get:
 *     summary: Get all members (non-admin users)
 *     tags: [Members]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Members fetched successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
// GET ALL MEMBERS (ADMIN)
memberRouter.get("/", getAllMembers);

/**
 * @swagger
 * /members/{id}:
 *   get:
 *     summary: Get member by ID
 *     tags: [Members]
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
 *         description: Member fetched successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Member not found
 */
// GET MEMBER BY ID (ADMIN)
memberRouter.get("/:id", getMemberById);

/**
 * @swagger
 * /members/{id}/block:
 *   patch:
 *     summary: Block a member
 *     tags: [Members]
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
 *         description: Member blocked successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Member not found
 */
// BLOCK MEMBER (ADMIN)
memberRouter.patch("/:id/block", blockMember);

/**
 * @swagger
 * /members/{id}/unblock:
 *   patch:
 *     summary: Unblock a member
 *     tags: [Members]
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
 *         description: Member unblocked successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Member not found
 */
// UNBLOCK MEMBER (ADMIN)
memberRouter.patch("/:id/unblock", unblockMember);

/**
 * @swagger
 * /members/{id}:
 *   delete:
 *     summary: Delete a member (soft delete)
 *     tags: [Members]
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
 *         description: Member deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Member not found
 */
// DELETE MEMBER (ADMIN) - SOFT DELETE
memberRouter.delete("/:id", deleteMember);

export { memberRouter };
