import { Schema, model } from "mongoose";

// ╔══════════════════════╗
// ║     Counter Schema   ║
// ╚══════════════════════╝
const CounterSchema = new Schema(
  {
    collectionName: {
      type: String,
      required: [true, "Collection name is required"],
      unique: true,
      index: true,
      trim: true,
    },
    counter: {
      type: Number,
      required: true,
      default: 200,
      min: [200, "Counter cannot be less than 200"],
    },
  },
  { timestamps: true, versionKey: false }
);

// ╔═════════════════════════════════════════════════════════════════════════════════════╗
// ║     Statics: Atomically Increment and Return the Next Sequence for a Collection     ║
// ╚═════════════════════════════════════════════════════════════════════════════════════╝
CounterSchema.statics.getNextSequence = async function (collectionName) {
  const normalized = (collectionName || "").toString().trim();

  if (!normalized) {
    throw new Error("collectionName is required for getNextSequence");
  }

  const updated = await this.findOneAndUpdate(
    { collectionName: normalized },
    [
      {
        $set: {
          counter: {
            $add: [{ $ifNull: ["$counter", 199] }, 1],
          },
        },
      },
    ],
    {
      new: true,
      upsert: true,
    }
  );

  if (!updated) {
    throw new Error("Failed to increment counter");
  }

  return updated.counter;
};

export const Counter = model("Counter", CounterSchema);
