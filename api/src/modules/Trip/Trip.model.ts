import mongoose from "mongoose";
import validateModel from "../../validation/validateModel";
import { Trip as TripType } from "./Trip.types"; // Renaming to avoid conflicts

const tripSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    location: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    notes: { type: String, required: true },
    expenses: { type: String, required: true },
    activity: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

tripSchema.pre("save", function (next) {
  validateModel(this);
  next();
});

// Exporting the Mongoose model, not the TypeScript type
const TripModel = mongoose.model("Trip", tripSchema);
export default TripModel;
export type { TripType }; // Exporting `TripType` if needed elsewhere
