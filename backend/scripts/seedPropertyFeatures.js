import "dotenv/config";
import { connectDb } from "../src/config/db.config.js";
import { PropertyFeature } from "../src/models/propertyFeature.model.js";
import mongoose from "mongoose";

// ╔═════════════════════════════════════╗
// ║     Property Features Seed Data     ║
// ╚═════════════════════════════════════╝
const propertyFeaturesData = [
  {
    name: "Area",
    icon: "https://raw.githubusercontent.com/moshlaycreatives/images/refs/heads/main/Brixone/PropertyFeatures/Area.png",
    type: "number",
  },
  {
    name: "Bedrooms",
    icon: "https://raw.githubusercontent.com/moshlaycreatives/images/refs/heads/main/Brixone/PropertyFeatures/Bedrooms.png",
    type: "number",
  },
  {
    name: "Bathrooms",
    icon: "https://raw.githubusercontent.com/moshlaycreatives/images/refs/heads/main/Brixone/PropertyFeatures/Bathrooms.png",
    type: "number",
  },
  {
    name: "kitchens",
    icon: "https://raw.githubusercontent.com/moshlaycreatives/images/refs/heads/main/Brixone/PropertyFeatures/Kitchen.png",
    type: "number",
  },
  {
    name: "Store Rooms",
    icon: "https://raw.githubusercontent.com/moshlaycreatives/images/refs/heads/main/Brixone/PropertyFeatures/StoreRooms.png",
    type: "number",
  },
  {
    name: "Garage",
    icon: "https://raw.githubusercontent.com/moshlaycreatives/images/refs/heads/main/Brixone/PropertyFeatures/Garage.png",
    type: "boolean",
  },
  {
    name: "Dining Room",
    icon: "https://raw.githubusercontent.com/moshlaycreatives/images/refs/heads/main/Brixone/PropertyFeatures/DiningRoom.png",
    type: "boolean",
  },
  {
    name: "Drawing Room",
    icon: "https://raw.githubusercontent.com/moshlaycreatives/images/refs/heads/main/Brixone/PropertyFeatures/DrawingRoom.png",
    type: "boolean",
  },
  {
    name: "Electricity",
    icon: "https://raw.githubusercontent.com/moshlaycreatives/images/refs/heads/main/Brixone/PropertyFeatures/Electricity.png",
    type: "boolean",
  },
  {
    name: "Water Supply",
    icon: "https://raw.githubusercontent.com/moshlaycreatives/images/refs/heads/main/Brixone/PropertyFeatures/WaterSupply.png",
    type: "boolean",
  },
  {
    name: "Sewerage",
    icon: "https://raw.githubusercontent.com/moshlaycreatives/images/refs/heads/main/Brixone/PropertyFeatures/Sewerage.png",
    type: "boolean",
  },
  {
    name: "Garden",
    icon: "https://raw.githubusercontent.com/moshlaycreatives/images/refs/heads/main/Brixone/PropertyFeatures/Garden.png",
    type: "boolean",
  },
  {
    name: "TV lounge",
    icon: "https://raw.githubusercontent.com/moshlaycreatives/images/refs/heads/main/Brixone/PropertyFeatures/TVLounge.png",
    type: "boolean",
  },
  {
    name: "Gas",
    icon: "https://raw.githubusercontent.com/moshlaycreatives/images/refs/heads/main/Brixone/PropertyFeatures/Gas.png",
    type: "boolean",
  },
  {
    name: "Security",
    icon: "https://raw.githubusercontent.com/moshlaycreatives/images/refs/heads/main/Brixone/PropertyFeatures/Security.png",
    type: "boolean",
  },
  {
    name: "File",
    icon: "https://raw.githubusercontent.com/moshlaycreatives/images/refs/heads/main/Brixone/PropertyFeatures/Default.png",
    type: "boolean",
  },
  {
    name: "Boundary Wall",
    icon: "https://raw.githubusercontent.com/moshlaycreatives/images/refs/heads/main/Brixone/PropertyFeatures/Default.png",
    type: "boolean",
  },
  {
    name: "Park",
    icon: "https://raw.githubusercontent.com/moshlaycreatives/images/refs/heads/main/Brixone/PropertyFeatures/Default.png",
    type: "boolean",
  },
  {
    name: "Masjid",
    icon: "https://raw.githubusercontent.com/moshlaycreatives/images/refs/heads/main/Brixone/PropertyFeatures/Default.png",
    type: "boolean",
  },
  {
    name: "Laundry Room",
    icon: "https://raw.githubusercontent.com/moshlaycreatives/images/refs/heads/main/Brixone/PropertyFeatures/Default.png",
    type: "boolean",
  },
  {
    name: "Powder Room",
    icon: "https://raw.githubusercontent.com/moshlaycreatives/images/refs/heads/main/Brixone/PropertyFeatures/Default.png",
    type: "boolean",
  },
  {
    name: "Terrace",
    icon: "https://raw.githubusercontent.com/moshlaycreatives/images/refs/heads/main/Brixone/PropertyFeatures/Default.png",
    type: "boolean",
  },
  {
    name: "Servant Quarter",
    icon: "https://raw.githubusercontent.com/moshlaycreatives/images/refs/heads/main/Brixone/PropertyFeatures/Default.png",
    type: "boolean",
  },
  {
    name: "Solar System",
    icon: "https://raw.githubusercontent.com/moshlaycreatives/images/refs/heads/main/Brixone/PropertyFeatures/Default.png",
    type: "boolean",
  },
  {
    name: "Balcony",
    icon: "https://raw.githubusercontent.com/moshlaycreatives/images/refs/heads/main/Brixone/PropertyFeatures/Default.png",
    type: "boolean",
  },
  {
    name: "Basement",
    icon: "https://raw.githubusercontent.com/moshlaycreatives/images/refs/heads/main/Brixone/PropertyFeatures/Default.png",
    type: "boolean",
  },
  {
    name: "Swimming Pool",
    icon: "https://raw.githubusercontent.com/moshlaycreatives/images/refs/heads/main/Brixone/PropertyFeatures/Default.png",
    type: "boolean",
  },
  {
    name: "Elevator",
    icon: "https://raw.githubusercontent.com/moshlaycreatives/images/refs/heads/main/Brixone/PropertyFeatures/Default.png",
    type: "boolean",
  },
  {
    name: "CCTV Cameras",
    icon: "https://raw.githubusercontent.com/moshlaycreatives/images/refs/heads/main/Brixone/PropertyFeatures/Default.png",
    type: "boolean",
  },
];

// ╔═════════════════════════════════════════╗
// ║     Seed Property Features Function     ║
// ╚═════════════════════════════════════════╝
const seedPropertyFeatures = async () => {
  try {
    await connectDb();

    const existingCount = await PropertyFeature.countDocuments();
    if (existingCount > 0) {
      console.log(
        `⚠️  Warning: ${existingCount} property features already exist in the database.`
      );
      console.log("Clearing existing data before seeding...");
      await PropertyFeature.deleteMany({});
      console.log("✅ Existing data cleared.");
    }

    const result = await PropertyFeature.insertMany(propertyFeaturesData);

    console.log(
      `\n✅ Successfully seeded ${result.length} property features to the database!`
    );
    console.log("\n📋 Seeded Features:");
    result.forEach((feature, index) => {
      console.log(`   ${index + 1}. ${feature.name} (${feature.type})`);
    });

    await mongoose.connection.close();
    console.log("\n🔌 Database connection closed.");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error seeding property features:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedPropertyFeatures();
