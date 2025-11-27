import { Property } from "../models/property.model.js";
import { PropertyFeature } from "../models/propertyFeature.model.js";
import { asyncHandler, ApiResponse } from "../utils/index.js";
import {
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from "../errors/index.js";
import { ROLES } from "../constants/index.js";
import { PROPERTY_FEATURES, LISTING_STATUS } from "../constants/index.js";

const PROPERTY_POPULATE_CONFIG = [
  {
    path: "features.feature",
    select: "name type icon",
  },
];

// ╔══════════════════════╗
// ║     Add Property     ║
// ╚══════════════════════╝
export const addProperty = asyncHandler(async (req, res) => {
  const {
    propertyName,
    aboutDescription,
    price,
    bedRooms,
    bathRooms,
    storeRooms,
    kitchens,
    area,
    available,
    location,
    address,
    furnishingStatus,
    leaseType,
    propertyOverview,
    numberOfFloors,
    floorPlans,
    listingType,
    propertyType,
  } = req.body;

  const baseUrl = process.env.BACKEND_BASE_URL;
  if (!baseUrl) {
    throw new InternalServerErrorException(
      "Backend base URL is not set in the environment variables."
    );
  }

  const files = req.files || {};

  let propertyOverviewArray = [];
  if (propertyOverview) {
    if (Array.isArray(propertyOverview)) {
      propertyOverviewArray = propertyOverview;
    } else if (typeof propertyOverview === "string") {
      try {
        propertyOverviewArray = JSON.parse(propertyOverview);
      } catch (error) {
        propertyOverviewArray = propertyOverview
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item);
      }
    }
  }

  let floorPlansArray = [];
  if (floorPlans) {
    if (Array.isArray(floorPlans)) {
      floorPlansArray = floorPlans;
    } else if (typeof floorPlans === "string") {
      try {
        floorPlansArray = JSON.parse(floorPlans);
      } catch (error) {
        throw new BadRequestException(
          "floorPlans must be a valid JSON array of objects with floorName and floorDescription."
        );
      }
    }
  }

  if (!files.propertyImages || files.propertyImages.length === 0) {
    throw new BadRequestException("Property images are required.");
  }

  if (!files.floorImages || files.floorImages.length === 0) {
    throw new BadRequestException("Floor images are required.");
  }

  if (files.floorImages.length !== floorPlansArray.length) {
    throw new BadRequestException(
      "Number of floor images must match number of floor plans."
    );
  }

  if (
    !floorPlansArray.every(
      (plan) =>
        plan &&
        typeof plan === "object" &&
        plan.floorName &&
        plan.floorDescription
    )
  ) {
    throw new BadRequestException(
      "Each floor plan must be an object with floorName and floorDescription."
    );
  }

  const numberFeatures = [
    { name: PROPERTY_FEATURES.AREA, value: parseFloat(area) },
    { name: PROPERTY_FEATURES.BEDROOMS, value: parseInt(bedRooms) },
    { name: PROPERTY_FEATURES.BATHROOMS, value: parseInt(bathRooms) },
    { name: PROPERTY_FEATURES.KITCHENS, value: parseInt(kitchens) },
    { name: PROPERTY_FEATURES.STORE_ROOMS, value: parseInt(storeRooms) },
  ];

  const featureNames = numberFeatures.map((f) => f.name);
  const propertyFeatures = await PropertyFeature.find({
    name: { $in: featureNames },
  });

  if (propertyFeatures.length !== featureNames.length) {
    const foundNames = propertyFeatures.map((pf) => pf.name);
    const missingNames = featureNames.filter(
      (name) => !foundNames.includes(name)
    );
    throw new NotFoundException(
      `Property features not found in database: ${missingNames.join(
        ", "
      )}. Please run the seed script first: npm run seed:property-features`
    );
  }

  const features = numberFeatures.map((numFeature) => {
    const featureDoc = propertyFeatures.find(
      (pf) => pf.name === numFeature.name
    );
    return {
      feature: featureDoc._id,
      value: numFeature.value,
    };
  });

  if (propertyOverviewArray.length > 0) {
    const booleanFeatureDocs = await PropertyFeature.find({
      name: { $in: propertyOverviewArray },
    });

    if (booleanFeatureDocs.length !== propertyOverviewArray.length) {
      const foundNames = booleanFeatureDocs.map((pf) => pf.name);
      const missingNames = propertyOverviewArray.filter(
        (name) => !foundNames.includes(name)
      );

      throw new NotFoundException(
        `Property overview features not found in database: ${missingNames.join(
          ", "
        )}. Please run the seed script first: npm run seed:property-features`
      );
    }

    booleanFeatureDocs.forEach((featureDoc) => {
      features.push({
        feature: featureDoc._id,
        value: true,
      });
    });
  }

  const floorPlansDetails = files.floorImages.map((file, index) => {
    const filePath = file.path.replace(/\\/g, "/");
    const floorPlan = floorPlansArray[index];
    return {
      floorName: floorPlan.floorName,
      floorDescription: floorPlan.floorDescription,
      floorPlanImage: `${baseUrl}/${filePath}`,
    };
  });

  const hasBasement = propertyOverviewArray.includes(
    PROPERTY_FEATURES.BASEMENT
  );

  const propertyImagesUrls = files.propertyImages.map((file) => {
    const filePath = file.path.replace(/\\/g, "/");
    return `${baseUrl}/${filePath}`;
  });

  let propertyVideoUrl = null;
  if (files.propertyVideo && files.propertyVideo.length > 0) {
    const filePath = files.propertyVideo[0].path.replace(/\\/g, "/");
    propertyVideoUrl = `${baseUrl}/${filePath}`;
  }

  let projectBrochureUrl = null;
  if (files.projectBrochure && files.projectBrochure.length > 0) {
    const filePath = files.projectBrochure[0].path.replace(/\\/g, "/");
    projectBrochureUrl = `${baseUrl}/${filePath}`;
  }

  const propertyData = {
    propertyName,
    aboutDescription,
    price: parseFloat(price),
    features,
    available,
    location,
    address,
    furnishingStatus,
    leaseType,
    propertyType,
    floorPlans: {
      totalFloors: parseInt(numberOfFloors),
      hasBasement,
      details: floorPlansDetails,
    },
    propertyVideo: propertyVideoUrl,
    projectBrochure: projectBrochureUrl,
    propertyImages: propertyImagesUrls,
    listingType,
  };

  const property = await Property.create(propertyData);

  return res.status(201).json(
    new ApiResponse({
      statusCode: 201,
      message: "Property created successfully.",
      data: { property },
    })
  );
});

// ╔══════════════════════════════════╗
// ║     Get All Properties (ADM)     ║
// ╚══════════════════════════════════╝
export const getAllProperties = asyncHandler(async (req, res) => {
  const { listingType } = req.query;

  const filters = {
    listingStatus: { $ne: LISTING_STATUS.SOLD_OUT },
  };

  if (listingType) filters.listingType = listingType;

  const properties = await Property.find(filters)
    .populate(PROPERTY_POPULATE_CONFIG)
    .sort({ createdAt: -1 });

  const propertiesWithNumberFeatures = properties.map((property) => {
    const propertyObj = property.toObject();

    const numberFeatureMap = {
      [PROPERTY_FEATURES.AREA]: "area",
      [PROPERTY_FEATURES.BEDROOMS]: "bedrooms",
      [PROPERTY_FEATURES.BATHROOMS]: "bathrooms",
      [PROPERTY_FEATURES.KITCHENS]: "kitchens",
      [PROPERTY_FEATURES.STORE_ROOMS]: "storeRooms",
    };

    Object.keys(numberFeatureMap).forEach((featureName) => {
      const feature = propertyObj.features?.find(
        (f) => f.feature?.name === featureName && f.feature?.type === "number"
      );
      if (feature) {
        propertyObj[numberFeatureMap[featureName]] = feature.value;
      }
    });

    return propertyObj;
  });

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Properties fetched successfully.",
      data: { properties: propertiesWithNumberFeatures },
    })
  );
});

// ╔════════════════════════════════════╗
// ║     Get Property By ID (Public)    ║
// ╚════════════════════════════════════╝
export const getPropertyById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const property = await Property.findById(id).populate(
    PROPERTY_POPULATE_CONFIG
  );

  if (!property) {
    throw new NotFoundException("Property not found.");
  }

  const propertyObj = property.toObject();

  const numberFeatureMap = {
    [PROPERTY_FEATURES.AREA]: "area",
    [PROPERTY_FEATURES.BEDROOMS]: "bedrooms",
    [PROPERTY_FEATURES.BATHROOMS]: "bathrooms",
    [PROPERTY_FEATURES.KITCHENS]: "kitchens",
    [PROPERTY_FEATURES.STORE_ROOMS]: "storeRooms",
  };

  Object.keys(numberFeatureMap).forEach((featureName) => {
    const feature = propertyObj.features?.find(
      (f) => f.feature?.name === featureName && f.feature?.type === "number"
    );
    if (feature) {
      propertyObj[numberFeatureMap[featureName]] = feature.value;
    }
  });

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Property fetched successfully.",
      data: { property: propertyObj },
    })
  );
});

// ╔═════════════════════════════════╗
// ║     Update Property (Admin)     ║
// ╚═════════════════════════════════╝
export const updateProperty = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    propertyName,
    aboutDescription,
    price,
    bedRooms,
    bathRooms,
    storeRooms,
    kitchens,
    area,
    available,
    location,
    address,
    furnishingStatus,
    leaseType,
    propertyOverview,
    numberOfFloors,
    floorPlans,
    listingType,
    propertyType,
    listingStatus,
  } = req.body;

  const property = await Property.findById(id).populate(
    PROPERTY_POPULATE_CONFIG
  );
  if (!property) {
    throw new NotFoundException("Property not found.");
  }

  const baseUrl = process.env.BACKEND_BASE_URL;
  if (!baseUrl) {
    throw new InternalServerErrorException(
      "Backend base URL is not set in the environment variables."
    );
  }

  const files = req.files || {};

  // Update basic fields if provided
  if (propertyName !== undefined) property.propertyName = propertyName;
  if (aboutDescription !== undefined)
    property.aboutDescription = aboutDescription;
  if (price !== undefined) property.price = parseFloat(price);
  if (available !== undefined) property.available = available;
  if (location !== undefined) property.location = location;
  if (address !== undefined) property.address = address;
  if (furnishingStatus !== undefined)
    property.furnishingStatus = furnishingStatus;
  if (leaseType !== undefined) property.leaseType = leaseType;
  if (listingType !== undefined) property.listingType = listingType;
  if (propertyType !== undefined) property.propertyType = propertyType;
  if (listingStatus !== undefined) property.listingStatus = listingStatus;

  // Handle features update if provided
  if (
    bedRooms !== undefined ||
    bathRooms !== undefined ||
    storeRooms !== undefined ||
    kitchens !== undefined ||
    area !== undefined ||
    propertyOverview !== undefined
  ) {
    let propertyOverviewArray = [];
    if (propertyOverview !== undefined) {
      if (Array.isArray(propertyOverview)) {
        propertyOverviewArray = propertyOverview;
      } else if (typeof propertyOverview === "string") {
        try {
          propertyOverviewArray = JSON.parse(propertyOverview);
        } catch (error) {
          propertyOverviewArray = propertyOverview
            .split(",")
            .map((item) => item.trim())
            .filter((item) => item);
        }
      }
    }

    // Get current feature values or use new ones
    const currentArea = property.features.find(
      (f) => f.feature?.name === PROPERTY_FEATURES.AREA
    )?.value;
    const currentBedRooms = property.features.find(
      (f) => f.feature?.name === PROPERTY_FEATURES.BEDROOMS
    )?.value;
    const currentBathRooms = property.features.find(
      (f) => f.feature?.name === PROPERTY_FEATURES.BATHROOMS
    )?.value;
    const currentKitchens = property.features.find(
      (f) => f.feature?.name === PROPERTY_FEATURES.KITCHENS
    )?.value;
    const currentStoreRooms = property.features.find(
      (f) => f.feature?.name === PROPERTY_FEATURES.STORE_ROOMS
    )?.value;

    const numberFeatures = [
      {
        name: PROPERTY_FEATURES.AREA,
        value: area !== undefined ? parseFloat(area) : currentArea,
      },
      {
        name: PROPERTY_FEATURES.BEDROOMS,
        value: bedRooms !== undefined ? parseInt(bedRooms) : currentBedRooms,
      },
      {
        name: PROPERTY_FEATURES.BATHROOMS,
        value: bathRooms !== undefined ? parseInt(bathRooms) : currentBathRooms,
      },
      {
        name: PROPERTY_FEATURES.KITCHENS,
        value: kitchens !== undefined ? parseInt(kitchens) : currentKitchens,
      },
      {
        name: PROPERTY_FEATURES.STORE_ROOMS,
        value:
          storeRooms !== undefined ? parseInt(storeRooms) : currentStoreRooms,
      },
    ].filter((f) => f.value !== undefined);

    const featureNames = numberFeatures.map((f) => f.name);
    const propertyFeatures = await PropertyFeature.find({
      name: { $in: featureNames },
    });

    if (propertyFeatures.length !== featureNames.length) {
      const foundNames = propertyFeatures.map((pf) => pf.name);
      const missingNames = featureNames.filter(
        (name) => !foundNames.includes(name)
      );
      throw new NotFoundException(
        `Property features not found in database: ${missingNames.join(
          ", "
        )}. Please run the seed script first: npm run seed:property-features`
      );
    }

    const features = numberFeatures.map((numFeature) => {
      const featureDoc = propertyFeatures.find(
        (pf) => pf.name === numFeature.name
      );
      return {
        feature: featureDoc._id,
        value: numFeature.value,
      };
    });

    // Handle boolean features (propertyOverview)
    if (propertyOverviewArray.length > 0) {
      const booleanFeatureDocs = await PropertyFeature.find({
        name: { $in: propertyOverviewArray },
      });

      if (booleanFeatureDocs.length !== propertyOverviewArray.length) {
        const foundNames = booleanFeatureDocs.map((pf) => pf.name);
        const missingNames = propertyOverviewArray.filter(
          (name) => !foundNames.includes(name)
        );
        throw new NotFoundException(
          `Property overview features not found in database: ${missingNames.join(
            ", "
          )}. Please run the seed script first: npm run seed:property-features`
        );
      }

      booleanFeatureDocs.forEach((featureDoc) => {
        features.push({
          feature: featureDoc._id,
          value: true,
        });
      });
    }

    // Keep existing boolean features that are not in propertyOverview
    const existingBooleanFeatures = property.features.filter(
      (f) =>
        f.feature?.type === "boolean" &&
        !propertyOverviewArray.includes(f.feature?.name)
    );
    existingBooleanFeatures.forEach((existingFeature) => {
      const existingFeatureId =
        existingFeature.feature?._id || existingFeature.feature;
      if (
        !features.some((f) => {
          const featureId = f.feature?._id || f.feature;
          return featureId?.toString() === existingFeatureId?.toString();
        })
      ) {
        features.push({
          feature: existingFeature.feature?._id || existingFeature.feature,
          value: existingFeature.value,
        });
      }
    });

    property.features = features;
  }

  // Handle floor plans update if provided
  if (numberOfFloors !== undefined || floorPlans !== undefined) {
    let floorPlansArray = [];
    if (floorPlans !== undefined) {
      if (Array.isArray(floorPlans)) {
        floorPlansArray = floorPlans;
      } else if (typeof floorPlans === "string") {
        try {
          floorPlansArray = JSON.parse(floorPlans);
        } catch (error) {
          throw new BadRequestException(
            "floorPlans must be a valid JSON array of objects with floorName and floorDescription."
          );
        }
      }
    }

    if (floorPlansArray.length > 0) {
      if (
        !floorPlansArray.every(
          (plan) =>
            plan &&
            typeof plan === "object" &&
            plan.floorName &&
            plan.floorDescription
        )
      ) {
        throw new BadRequestException(
          "Each floor plan must be an object with floorName and floorDescription."
        );
      }

      if (files.floorImages && files.floorImages.length > 0) {
        if (files.floorImages.length !== floorPlansArray.length) {
          throw new BadRequestException(
            "Number of floor images must match number of floor plans."
          );
        }

        const floorPlansDetails = files.floorImages.map((file, index) => {
          const filePath = file.path.replace(/\\/g, "/");
          const floorPlan = floorPlansArray[index];
          return {
            floorName: floorPlan.floorName,
            floorDescription: floorPlan.floorDescription,
            floorPlanImage: `${baseUrl}/${filePath}`,
          };
        });

        property.floorPlans.details = floorPlansDetails;
      } else {
        // Update floor plan names/descriptions without changing images
        const existingDetails = property.floorPlans.details || [];
        const updatedDetails = floorPlansArray.map((plan, index) => {
          const existing = existingDetails[index];
          return {
            floorName: plan.floorName,
            floorDescription: plan.floorDescription,
            floorPlanImage: existing?.floorPlanImage || "",
          };
        });
        property.floorPlans.details = updatedDetails;
      }
    }

    if (numberOfFloors !== undefined) {
      property.floorPlans.totalFloors = parseInt(numberOfFloors);
    }

    // Update hasBasement based on propertyOverview if provided
    if (propertyOverview !== undefined) {
      let propertyOverviewArray = [];
      if (Array.isArray(propertyOverview)) {
        propertyOverviewArray = propertyOverview;
      } else if (typeof propertyOverview === "string") {
        try {
          propertyOverviewArray = JSON.parse(propertyOverview);
        } catch (error) {
          propertyOverviewArray = propertyOverview
            .split(",")
            .map((item) => item.trim())
            .filter((item) => item);
        }
      }
      property.floorPlans.hasBasement = propertyOverviewArray.includes(
        PROPERTY_FEATURES.BASEMENT
      );
    }
  }

  // Handle file uploads
  if (files.propertyImages && files.propertyImages.length > 0) {
    const propertyImagesUrls = files.propertyImages.map((file) => {
      const filePath = file.path.replace(/\\/g, "/");
      return `${baseUrl}/${filePath}`;
    });
    property.propertyImages = propertyImagesUrls;
  }

  if (
    Object.prototype.hasOwnProperty.call(files, "propertyVideo") &&
    files.propertyVideo?.[0]?.path
  ) {
    const filePath = files.propertyVideo[0].path.replace(/\\/g, "/");
    property.propertyVideo = `${baseUrl}/${filePath}`;
  }

  if (
    Object.prototype.hasOwnProperty.call(files, "projectBrochure") &&
    files.projectBrochure?.[0]?.path
  ) {
    const filePath = files.projectBrochure[0].path.replace(/\\/g, "/");
    property.projectBrochure = `${baseUrl}/${filePath}`;
  }

  await property.save();

  const updatedProperty = await Property.findById(id).populate(
    PROPERTY_POPULATE_CONFIG
  );

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Property updated successfully.",
      data: { property: updatedProperty },
    })
  );
});

// ╔═══════════════════════════════════════╗
// ║     Mark Property as Sold Out (Admin) ║
// ╚═══════════════════════════════════════╝
export const markPropertySoldOut = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const property = await Property.findById(id);
  if (!property) {
    throw new NotFoundException("Property not found.");
  }

  property.listingStatus = LISTING_STATUS.SOLD_OUT;
  await property.save();

  const updatedProperty = await Property.findById(id).populate(
    PROPERTY_POPULATE_CONFIG
  );

  const propertyObj = updatedProperty.toObject();

  const numberFeatureMap = {
    [PROPERTY_FEATURES.AREA]: "area",
    [PROPERTY_FEATURES.BEDROOMS]: "bedrooms",
    [PROPERTY_FEATURES.BATHROOMS]: "bathrooms",
    [PROPERTY_FEATURES.KITCHENS]: "kitchens",
    [PROPERTY_FEATURES.STORE_ROOMS]: "storeRooms",
  };

  Object.keys(numberFeatureMap).forEach((featureName) => {
    const feature = propertyObj.features?.find(
      (f) => f.feature?.name === featureName && f.feature?.type === "number"
    );
    if (feature) {
      propertyObj[numberFeatureMap[featureName]] = feature.value;
    }
  });

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Property marked as sold out successfully.",
      data: { property: propertyObj },
    })
  );
});

// ╔══════════════════════════════════════════╗
// ║     Get All Sold Out Properties (Public) ║
// ╚══════════════════════════════════════════╝
export const getAllSoldOutProperties = asyncHandler(async (req, res) => {
  const { listingType } = req.query;

  const filters = {
    listingStatus: LISTING_STATUS.SOLD_OUT,
  };

  if (listingType) filters.listingType = listingType;

  const properties = await Property.find(filters)
    .populate(PROPERTY_POPULATE_CONFIG)
    .sort({ createdAt: -1 });

  const propertiesWithNumberFeatures = properties.map((property) => {
    const propertyObj = property.toObject();

    const numberFeatureMap = {
      [PROPERTY_FEATURES.AREA]: "area",
      [PROPERTY_FEATURES.BEDROOMS]: "bedrooms",
      [PROPERTY_FEATURES.BATHROOMS]: "bathrooms",
      [PROPERTY_FEATURES.KITCHENS]: "kitchens",
      [PROPERTY_FEATURES.STORE_ROOMS]: "storeRooms",
    };

    Object.keys(numberFeatureMap).forEach((featureName) => {
      const feature = propertyObj.features?.find(
        (f) => f.feature?.name === featureName && f.feature?.type === "number"
      );
      if (feature) {
        propertyObj[numberFeatureMap[featureName]] = feature.value;
      }
    });

    return propertyObj;
  });

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Sold out properties fetched successfully.",
      data: { properties: propertiesWithNumberFeatures },
    })
  );
});
