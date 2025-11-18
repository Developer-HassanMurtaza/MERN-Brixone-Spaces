import { User } from "../models/user.model.js";
import { ROLES } from "../constants/index.js";

export const createAdmin = async () => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.warn(
      "Admin email or password is not set in environment variables."
    );
    return;
  }

  let admin = await User.findOne({ email: adminEmail }).select("+password");

  if (!admin) {
    try {
      await User.create({
        fullName: "Administrator",
        email: adminEmail,
        password: adminPassword,
        role: ROLES.ADMIN,
      });
      console.log("Admin user created successfully.");
    } catch (err) {
      console.error("Failed to create admin user:", err);
    }
    return;
  } else {
    console.log("Admin user already exists.");
    return;
  }
};
