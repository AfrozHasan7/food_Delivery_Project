import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [{
    food: { type: mongoose.Schema.Types.ObjectId, ref: "Food", required: true },
    name: { type: String, required: true },
    image: String,
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 }
  }],
  deliveryAddress: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  subtotal: { type: Number, required: true },
  deliveryFee: { type: Number, default: 35 },
  total: { type: Number, required: true },
  paymentMethod: { type: String, enum: ["COD"], default: "COD" },
  status: { type: String, enum: ["Placed", "Preparing", "Out for delivery", "Delivered", "Cancelled"], default: "Placed" }
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
