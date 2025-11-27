import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  deleteUser,
  toggleBlockUser,
} from "../controllers/index.js";
import { loginAuth, adminAuth } from "../middlewares/index.js";

const userRouter = Router();
userRouter.use(loginAuth);
userRouter.use(adminAuth);

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: Admin-only user management
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users list
 *       403:
 *         description: Forbidden
 */
// GET ALL USERS (ADMIN)
userRouter.get("/", getAllUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by id (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: Not found
 *       403:
 *         description: Forbidden
 */
// GET USER BY ID (ADMIN)
userRouter.get("/:id", getUserById);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete user by id (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted
 *       404:
 *         description: Not found
 *       403:
 *         description: Forbidden
 */
// DELETE USER (ADMIN)
userRouter.delete("/:id", deleteUser);

/**
 * @swagger
 * /users/{id}/block-toggle:
 *   patch:
 *     summary: Toggle user block/unblock (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User block state toggled
 *       404:
 *         description: Not found
 *       403:
 *         description: Forbidden
 */
// TOGGLE BLOCK/UNBLOCK USER (ADMIN)
userRouter.patch("/:id/block-toggle", toggleBlockUser);

export { userRouter };
