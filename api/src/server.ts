const dotenv = require("dotenv");
dotenv.config();

import mongoose from "mongoose";
import app from "./app";
import { Server } from "http";

const port: number = parseInt(process.env.PORT ?? "3000");

if (!process.env.MONGO_CONNECTION) {
  console.error("MongoDB connection string is missing!");
  process.exit(1);
}

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_CONNECTION)
  .then(() => {
    console.log("Connected to MongoDB");

    // Start server
    const server = app.listen(port, () => {
      console.log(`Server is running on port http://localhost:${port}`);
    });

    process.on("SIGINT", () => stopServer(server));
    process.on("SIGTERM", () => stopServer(server));
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });

// Stop server
const stopServer = (server: Server) => {
  mongoose.connection.close();
  server.close(() => {
    console.log("Server closed");
    process.exit();
  });
};
