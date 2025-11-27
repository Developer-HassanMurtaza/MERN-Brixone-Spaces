import { Router } from "express";
import {
  getDashboardOverview,
  getUnitsSoldSummary,
  getRevenueSummary,
  getRevenueAnalytics,
  getRentAnalytics,
  getSalesAnalytics,
} from "../controllers/index.js";
import { loginAuth, adminAuth } from "../middlewares/index.js";

const dashboardRouter = Router();
dashboardRouter.use(loginAuth, adminAuth);

/**
 * @swagger
 * tags:
 *   - name: Dashboard
 *     description: Administrative analytics and KPIs
 */

/**
 * @swagger
 * /dashboard/overview:
 *   get:
 *     summary: Get high-level dashboard metrics
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Metrics fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalSale:
 *                       type: number
 *                       description: Sum of sold property prices (For Sale listing type)
 *                     propertiesForSale:
 *                       type: number
 *                     propertiesForRent:
 *                       type: number
 *                     totalCustomers:
 *                       type: number
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
// OVERVIEW
dashboardRouter.get("/overview", getDashboardOverview);

/**
 * @swagger
 * /dashboard/units-sold:
 *   get:
 *     summary: Get total units sold-out summary
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Units sold summary fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalUnits:
 *                       type: number
 *                     saleUnits:
 *                       type: number
 *                     rentUnits:
 *                       type: number
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
// UNITS SOLD
dashboardRouter.get("/units-sold", getUnitsSoldSummary);

/**
 * @swagger
 * /dashboard/revenue:
 *   get:
 *     summary: Get revenue summary for sale and rent
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Revenue summary fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalRevenue:
 *                       type: number
 *                     saleRevenue:
 *                       type: number
 *                     rentRevenue:
 *                       type: number
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
// REVENUE
dashboardRouter.get("/revenue", getRevenueSummary);

/*
 * @swagger-disabled
 * /dashboard/revenue-analytics:
 *   get:
 *     summary: Get revenue analytics timeline
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: range
 *         schema:
 *           type: string
 *           enum: [week, month, year]
         description: 
           week → current week, month → current month, year → specified year (default current)
       - in: query
         name: year
         schema:
           type: integer
           minimum: 1900
         description: Required when range=year; ignored otherwise
     responses:
       200:
         description: Revenue timeline fetched successfully
         content:
           application/json:
             schema:
               type: object
               properties:
                 data:
                   type: object
                   properties:
                     range:
                       type: string
                     year:
                       type: integer
                     month:
                       type: integer
                       description: Present when range=month (1-12)
                     timeline:
                       type: array
                       items:
                         type: object
                         properties:
                           label:
                             type: string
                           key:
                             type: string
                           saleRevenue:
                             type: number
                           rentRevenue:
                             type: number
                           totalRevenue:
                             type: number
                     summary:
                       type: object
                       properties:
                         saleRevenue:
                           type: number
                         rentRevenue:
                           type: number
                         totalRevenue:
                           type: number
       401:
         description: Unauthorized
       403:
         description: Forbidden
 */
// REVENUE ANALYTICS
dashboardRouter.get("/revenue-analytics", getRevenueAnalytics);

/*
 * @swagger-disabled
 * /dashboard/rent-analytics:
 *   get:
 *     summary: Get rent analytics timeline
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
         name: range
         schema:
           type: string
           enum: [week, month, year]
         description: 
           week → current week, month → current month, year → specified year (default current)
       - in: query
         name: year
         schema:
           type: integer
           minimum: 1900
         description: Required when range=year; ignored otherwise
     responses:
       200:
         description: Rent timeline fetched successfully
         content:
           application/json:
             schema:
               type: object
               properties:
                 data:
                   type: object
                   properties:
                     range:
                       type: string
                     year:
                       type: integer
                     month:
                       type: integer
                       description: Present when range=month (1-12)
                     timeline:
                       type: array
                       items:
                         type: object
                         properties:
                           label:
                             type: string
                           key:
                             type: string
                           rentRevenue:
                             type: number
                     summary:
                       type: object
                       properties:
                         rentRevenue:
                           type: number
       401:
         description: Unauthorized
       403:
         description: Forbidden
 */
// RENT ANALYTICS
dashboardRouter.get("/rent-analytics", getRentAnalytics);

/*
 * @swagger-disabled
 * /dashboard/sales-analytics:
 *   get:
 *     summary: Get sales analytics timeline
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
         name: range
         schema:
           type: string
           enum: [week, month, year]
         description:
           week → current week, month → current month, year → specified year (default current)
       - in: query
         name: year
         schema:
           type: integer
           minimum: 1900
         description: Required when range=year; ignored otherwise
     responses:
       200:
         description: Sales timeline fetched successfully
         content:
           application/json:
             schema:
               type: object
               properties:
                 data:
                   type: object
                   properties:
                     range:
                       type: string
                     year:
                       type: integer
                     month:
                       type: integer
                       description: Present when range=month (1-12)
                     timeline:
                       type: array
                       items:
                         type: object
                         properties:
                           label:
                             type: string
                           key:
                             type: string
                           saleRevenue:
                             type: number
                     summary:
                       type: object
                       properties:
                         saleRevenue:
                           type: number
       401:
         description: Unauthorized
       403:
         description: Forbidden
 */
// SALES ANALYTICS
dashboardRouter.get("/sales-analytics", getSalesAnalytics);

export { dashboardRouter };
