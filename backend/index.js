import "dotenv/config";
import http from "http";
import { app } from "./src/app.js";
import { connectDb } from "./src/config/db.config.js";
import { createAdmin } from "./src/utils/index.js";

// ╔══════════════════════════════════════════╗
// ║     Server Listening & DB Connection     ║
// ╚══════════════════════════════════════════╝
const server = http.createServer(app);
const PORT = process.env.PORT || 8888;

(async () => {
  try {
    await connectDb();
    await createAdmin();
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("An error occurred while running server", error);
    process.exit(1);
  }
})();
