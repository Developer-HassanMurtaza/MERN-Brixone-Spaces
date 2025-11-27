import { Property } from "../models/property.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler, ApiResponse } from "../utils/index.js";
import {
  LISTING_TYPE,
  LISTING_STATUS,
} from "../constants/property.constants.js";
import { ROLES } from "../constants/index.js";

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const RANGE_TYPE = Object.freeze({
  WEEK: "week",
  MONTH: "month",
  YEAR: "year",
});

const getUtcStartOfDay = (date) =>
  new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );

const getRangeConfig = ({ range, yearParam }) => {
  const today = new Date();
  const nowUtc = getUtcStartOfDay(today);

  switch (range) {
    case RANGE_TYPE.WEEK: {
      const dayOfWeek = nowUtc.getUTCDay();
      const diffToMonday = (dayOfWeek + 6) % 7;
      const start = new Date(nowUtc);
      start.setUTCDate(nowUtc.getUTCDate() - diffToMonday);
      const end = new Date(start);
      end.setUTCDate(start.getUTCDate() + 7);

      return {
        start,
        end,
        bucketFormat: "%Y-%m-%d",
        bucketUnit: "day",
        totalUnits: 7,
        year: start.getUTCFullYear(),
      };
    }
    case RANGE_TYPE.MONTH: {
      const start = new Date(
        Date.UTC(nowUtc.getUTCFullYear(), nowUtc.getUTCMonth(), 1)
      );
      const end = new Date(
        Date.UTC(nowUtc.getUTCFullYear(), nowUtc.getUTCMonth() + 1, 1)
      );
      const daysInMonth = new Date(
        Date.UTC(nowUtc.getUTCFullYear(), nowUtc.getUTCMonth() + 1, 0)
      ).getUTCDate();

      return {
        start,
        end,
        bucketFormat: "%Y-%m-%d",
        bucketUnit: "day",
        totalUnits: daysInMonth,
        year: start.getUTCFullYear(),
        month: start.getUTCMonth(),
      };
    }
    case RANGE_TYPE.YEAR:
    default: {
      const targetYear =
        Number.parseInt(yearParam, 10) || nowUtc.getUTCFullYear();
      const start = new Date(Date.UTC(targetYear, 0, 1));
      const end = new Date(Date.UTC(targetYear + 1, 0, 1));

      return {
        start,
        end,
        bucketFormat: "%Y-%m",
        bucketUnit: "month",
        totalUnits: 12,
        year: targetYear,
      };
    }
  }
};

const buildTimelineSkeleton = (range, config) => {
  const skeleton = [];

  if (config.bucketUnit === "day") {
    for (let i = 0; i < config.totalUnits; i++) {
      const current = new Date(config.start);
      current.setUTCDate(config.start.getUTCDate() + i);
      const bucketKey = current.toISOString().slice(0, 10);

      let label = current.getUTCDate().toString();
      if (range === RANGE_TYPE.WEEK) {
        label = WEEKDAY_LABELS[current.getUTCDay()];
      }

      skeleton.push({
        key: bucketKey,
        label,
        saleRevenue: 0,
        rentRevenue: 0,
        totalRevenue: 0,
      });
    }
  } else if (config.bucketUnit === "month") {
    for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
      const bucketKey = `${config.year}-${String(monthIndex + 1).padStart(
        2,
        "0"
      )}`;
      skeleton.push({
        key: bucketKey,
        label: MONTH_LABELS[monthIndex],
        saleRevenue: 0,
        rentRevenue: 0,
        totalRevenue: 0,
      });
    }
  }

  return skeleton;
};

const formatAggregationResults = (aggregation) =>
  aggregation.reduce((acc, bucket) => {
    acc[bucket.bucket] = {
      saleRevenue: bucket.saleRevenue || 0,
      rentRevenue: bucket.rentRevenue || 0,
    };
    return acc;
  }, {});

// ╔═════════════════════════════╗
// ║     Dashboard: Overview     ║
// ╚═════════════════════════════╝
export const getDashboardOverview = asyncHandler(async (_req, res) => {
  const totalSalePromise = Property.aggregate([
    {
      $match: {
        listingType: LISTING_TYPE.FOR_SALE,
        listingStatus: LISTING_STATUS.SOLD_OUT,
      },
    },
    {
      $group: {
        _id: null,
        totalSale: { $sum: "$price" },
      },
    },
  ]);

  const propertiesForSalePromise = Property.countDocuments({
    listingType: LISTING_TYPE.FOR_SALE,
  });

  const propertiesForRentPromise = Property.countDocuments({
    listingType: LISTING_TYPE.FOR_RENT,
  });

  const totalCustomersPromise = User.countDocuments({
    role: { $ne: ROLES.ADMIN },
  });

  const [
    saleAggregation,
    propertiesForSale,
    propertiesForRent,
    totalCustomers,
  ] = await Promise.all([
    totalSalePromise,
    propertiesForSalePromise,
    propertiesForRentPromise,
    totalCustomersPromise,
  ]);

  const totalSale = saleAggregation?.[0]?.totalSale || 0;

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Dashboard metrics fetched successfully.",
      data: {
        totalSale,
        propertiesForSale,
        propertiesForRent,
        totalCustomers,
      },
    })
  );
});

// ╔═══════════════════════════════════════╗
// ║     Dashboard: Units Sold Summary     ║
// ╚═══════════════════════════════════════╝
export const getUnitsSoldSummary = asyncHandler(async (_req, res) => {
  const saleUnitsPromise = Property.countDocuments({
    listingType: LISTING_TYPE.FOR_SALE,
    listingStatus: LISTING_STATUS.SOLD_OUT,
  });

  const rentUnitsPromise = Property.countDocuments({
    listingType: LISTING_TYPE.FOR_RENT,
    listingStatus: LISTING_STATUS.SOLD_OUT,
  });

  const [saleUnits, rentUnits] = await Promise.all([
    saleUnitsPromise,
    rentUnitsPromise,
  ]);

  const totalUnits = saleUnits + rentUnits;

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Units sold summary fetched successfully.",
      data: {
        totalUnits,
        saleUnits,
        rentUnits,
      },
    })
  );
});

// ╔════════════════════════════════════╗
// ║     Dashboard: Revenue Summary     ║
// ╚════════════════════════════════════╝
export const getRevenueSummary = asyncHandler(async (_req, res) => {
  const getRevenueByListingType = (listingType, statusFieldValue) =>
    Property.aggregate([
      {
        $match: {
          listingType,
          listingStatus: statusFieldValue,
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$price" },
        },
      },
    ]);

  const saleRevenuePromise = getRevenueByListingType(
    LISTING_TYPE.FOR_SALE,
    LISTING_STATUS.SOLD_OUT
  );

  const rentRevenuePromise = getRevenueByListingType(
    LISTING_TYPE.FOR_RENT,
    LISTING_STATUS.SOLD_OUT
  );

  const [saleRevenueAggregation, rentRevenueAggregation] = await Promise.all([
    saleRevenuePromise,
    rentRevenuePromise,
  ]);

  const saleRevenue = saleRevenueAggregation?.[0]?.totalAmount || 0;
  const rentRevenue = rentRevenueAggregation?.[0]?.totalAmount || 0;
  const totalRevenue = saleRevenue + rentRevenue;

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Revenue summary fetched successfully.",
      data: {
        totalRevenue,
        saleRevenue,
        rentRevenue,
      },
    })
  );
});

// ╔══════════════════════════════════════╗
// ║     Dashboard: Revenue Analytics     ║
// ╚══════════════════════════════════════╝
export const getRevenueAnalytics = asyncHandler(async (req, res) => {
  const rangeParam = (req.query.range || RANGE_TYPE.MONTH).toLowerCase();
  const range =
    rangeParam === RANGE_TYPE.WEEK || rangeParam === RANGE_TYPE.YEAR
      ? rangeParam
      : RANGE_TYPE.MONTH;

  const { start, end, bucketFormat, bucketUnit, totalUnits, year, month } =
    getRangeConfig({ range, yearParam: req.query.year });

  const matchStage = {
    $match: {
      updatedAt: { $gte: start, $lt: end },
      $or: [
        {
          listingType: LISTING_TYPE.FOR_SALE,
          listingStatus: LISTING_STATUS.SOLD_OUT,
        },
        {
          listingType: LISTING_TYPE.FOR_RENT,
          listingStatus: LISTING_STATUS.SOLD_OUT,
        },
      ],
    },
  };

  const aggregation = await Property.aggregate([
    matchStage,
    {
      $project: {
        price: 1,
        listingType: 1,
        bucket: {
          $dateToString: {
            date: "$updatedAt",
            format: bucketFormat,
            timezone: "UTC",
          },
        },
      },
    },
    {
      $group: {
        _id: "$bucket",
        saleRevenue: {
          $sum: {
            $cond: [
              { $eq: ["$listingType", LISTING_TYPE.FOR_SALE] },
              "$price",
              0,
            ],
          },
        },
        rentRevenue: {
          $sum: {
            $cond: [
              { $eq: ["$listingType", LISTING_TYPE.FOR_RENT] },
              "$price",
              0,
            ],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        bucket: "$_id",
        saleRevenue: 1,
        rentRevenue: 1,
        totalRevenue: { $add: ["$saleRevenue", "$rentRevenue"] },
      },
    },
    { $sort: { bucket: 1 } },
  ]);

  const revenueByBucket = formatAggregationResults(aggregation);
  const timeline = buildTimelineSkeleton(range, {
    start,
    totalUnits,
    bucketUnit,
    year,
    month,
  }).map((bucket) => {
    const revenues = revenueByBucket[bucket.key] || {
      saleRevenue: 0,
      rentRevenue: 0,
    };
    const totalRevenue = revenues.saleRevenue + revenues.rentRevenue;

    return {
      ...bucket,
      saleRevenue: revenues.saleRevenue,
      rentRevenue: revenues.rentRevenue,
      totalRevenue,
    };
  });

  const summary = timeline.reduce(
    (acc, point) => {
      acc.saleRevenue += point.saleRevenue;
      acc.rentRevenue += point.rentRevenue;
      acc.totalRevenue += point.totalRevenue;
      return acc;
    },
    { saleRevenue: 0, rentRevenue: 0, totalRevenue: 0 }
  );

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Revenue analytics fetched successfully.",
      data: {
        range,
        year,
        month: typeof month === "number" ? month + 1 : undefined,
        timeline,
        summary,
      },
    })
  );
});

// ╔═══════════════════════════════════╗
// ║     Dashboard: Rent Analytics     ║
// ╚═══════════════════════════════════╝
export const getRentAnalytics = asyncHandler(async (req, res) => {
  const rangeParam = (req.query.range || RANGE_TYPE.MONTH).toLowerCase();
  const range =
    rangeParam === RANGE_TYPE.WEEK || rangeParam === RANGE_TYPE.YEAR
      ? rangeParam
      : RANGE_TYPE.MONTH;

  const { start, end, bucketFormat, bucketUnit, totalUnits, year, month } =
    getRangeConfig({ range, yearParam: req.query.year });

  const aggregation = await Property.aggregate([
    {
      $match: {
        updatedAt: { $gte: start, $lt: end },
        listingType: LISTING_TYPE.FOR_RENT,
        listingStatus: LISTING_STATUS.SOLD_OUT,
      },
    },
    {
      $project: {
        price: 1,
        bucket: {
          $dateToString: {
            date: "$updatedAt",
            format: bucketFormat,
            timezone: "UTC",
          },
        },
      },
    },
    {
      $group: {
        _id: "$bucket",
        rentRevenue: { $sum: "$price" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const rentByBucket = aggregation.reduce((acc, bucket) => {
    acc[bucket._id] = bucket.rentRevenue || 0;
    return acc;
  }, {});

  const timeline = buildTimelineSkeleton(range, {
    start,
    totalUnits,
    bucketUnit,
    year,
    month,
  }).map((bucket) => {
    const rentRevenue = rentByBucket[bucket.key] || 0;
    return {
      ...bucket,
      rentRevenue,
    };
  });

  const totalRentRevenue = timeline.reduce(
    (sum, point) => sum + point.rentRevenue,
    0
  );

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Rent analytics fetched successfully.",
      data: {
        range,
        year,
        month: typeof month === "number" ? month + 1 : undefined,
        timeline,
        summary: {
          rentRevenue: totalRentRevenue,
        },
      },
    })
  );
});

// ╔════════════════════════════════════╗
// ║     Dashboard: Sales Analytics     ║
// ╚════════════════════════════════════╝
export const getSalesAnalytics = asyncHandler(async (req, res) => {
  const rangeParam = (req.query.range || RANGE_TYPE.MONTH).toLowerCase();
  const range =
    rangeParam === RANGE_TYPE.WEEK || rangeParam === RANGE_TYPE.YEAR
      ? rangeParam
      : RANGE_TYPE.MONTH;

  const { start, end, bucketFormat, bucketUnit, totalUnits, year, month } =
    getRangeConfig({ range, yearParam: req.query.year });

  const aggregation = await Property.aggregate([
    {
      $match: {
        updatedAt: { $gte: start, $lt: end },
        listingType: LISTING_TYPE.FOR_SALE,
        listingStatus: LISTING_STATUS.SOLD_OUT,
      },
    },
    {
      $project: {
        price: 1,
        bucket: {
          $dateToString: {
            date: "$updatedAt",
            format: bucketFormat,
            timezone: "UTC",
          },
        },
      },
    },
    {
      $group: {
        _id: "$bucket",
        saleRevenue: { $sum: "$price" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const saleByBucket = aggregation.reduce((acc, bucket) => {
    acc[bucket._id] = bucket.saleRevenue || 0;
    return acc;
  }, {});

  const timeline = buildTimelineSkeleton(range, {
    start,
    totalUnits,
    bucketUnit,
    year,
    month,
  }).map((bucket) => {
    const saleRevenue = saleByBucket[bucket.key] || 0;
    return {
      ...bucket,
      saleRevenue,
    };
  });

  const totalSaleRevenue = timeline.reduce(
    (sum, point) => sum + point.saleRevenue,
    0
  );

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Sales analytics fetched successfully.",
      data: {
        range,
        year,
        month: typeof month === "number" ? month + 1 : undefined,
        timeline,
        summary: {
          saleRevenue: totalSaleRevenue,
        },
      },
    })
  );
});
