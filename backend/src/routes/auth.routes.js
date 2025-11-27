import { Router } from "express";
import {
  register,
  login,
  forgotPassword,
  resendOtp,
  verifyOtp,
  resetPassword,
  editProfile,
  getProfile,
} from "../controllers/index.js";
import {
  emailValidator,
  requiredFields,
  trimBodyObject,
  loginAuth,
  upload,
} from "../middlewares/index.js";

const authRouter = Router();

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: User authentication and profile management
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fullName, email, password]
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: Email already exists
 */
// REGISTER
authRouter.post(
  "/register",
  trimBodyObject,
  requiredFields(["fullName", "email", "password"]),
  emailValidator,
  register
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login and receive a JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Validation error
 *       401:
 *         description: Invalid credentials
 */
// LOGIN
authRouter.post(
  "/login",
  trimBodyObject,
  requiredFields(["email", "password"]),
  emailValidator,
  login
);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Request password reset OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: OTP sent to email if exists
 */
// FORGOT PASSWORD
authRouter.post(
  "/forgot-password",
  trimBodyObject,
  requiredFields(["email"]),
  emailValidator,
  forgotPassword
);

/**
 * @swagger
 * /auth/resend-otp:
 *   post:
 *     summary: Resend verification OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: OTP resent
 */
// RESEND OTP
authRouter.post(
  "/resend-otp",
  trimBodyObject,
  requiredFields(["email"]),
  emailValidator,
  resendOtp
);

/**
 * @swagger
 * /auth/verify-otp:
 *   post:
 *     summary: Verify email using OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, otp]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP verified
 *       400:
 *         description: Invalid or expired OTP
 */
// VERIFY OTP
authRouter.post(
  "/verify-otp",
  trimBodyObject,
  requiredFields(["email", "otp"]),
  emailValidator,
  verifyOtp
);

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset password using OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, newPassword]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successful
 */
// RESET PASSWORD
authRouter.post(
  "/reset-password",
  trimBodyObject,
  requiredFields(["email", "newPassword"]),
  emailValidator,
  resetPassword
);

/**
 * @swagger
 * /auth/edit-profile:
 *   patch:
 *     summary: Edit current user's profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Profile updated
 *       401:
 *         description: Unauthorized
 */
// EDIT PROFILE
authRouter.patch(
  "/edit-profile",
  loginAuth,
  upload.single("profilePicture"),
  trimBodyObject,
  editProfile
);

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Get current user's profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile data
 *       401:
 *         description: Unauthorized
 */
// GET PROFILE
authRouter.get("/profile", loginAuth, getProfile);

export { authRouter };
