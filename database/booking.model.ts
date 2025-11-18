import mongoose, { Schema, Document, Model } from "mongoose";
import Event from "./event.model"; // Import for type reference, but logic uses mongoose.models

// Interface defining the Booking document structure
export interface IBooking extends Document {
  eventId: mongoose.Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true, // Index for faster filtering by event
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },
  },
  { timestamps: true }
);

// Pre-save hook: Referential integrity check
BookingSchema.pre("save", async function (next) {
  if (this.isModified("eventId")) {
    try {
      // Use mongoose.models to fetch the registered Event model dynamically
      const eventExists = await mongoose.models.Event.findById(this.eventId);
      
      if (!eventExists) {
        return next(new Error("Booking failed: Referenced Event does not exist."));
      }
    } catch (error) {
      return next(error as Error);
    }
  }
  next();
});

// Prevent model overwrite in Next.js hot-reloading
const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>("Booking", BookingSchema);

export default Booking;