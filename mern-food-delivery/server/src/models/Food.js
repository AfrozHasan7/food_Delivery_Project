import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: "" },
  category: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  image: { type: String, default: "" },
  vegetarian: { type: Boolean, default: true },
  rating: { type: Number, default: 4.5 },
  available: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model("Food", foodSchema);
