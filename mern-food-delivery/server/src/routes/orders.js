import { Router } from "express";
import mongoose from "mongoose";
import Order from "../models/Order.js";
import Food from "../models/Food.js";
import requireAuth from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

router.post("/", async (req, res, next) => {
  try {
    const { items, deliveryAddress, phone } = req.body;
    if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ message: "Your cart is empty." });
    if (!deliveryAddress?.trim() || !phone?.trim()) return res.status(400).json({ message: "Delivery address and phone are required." });

    const normalized = [];
    let subtotal = 0;
    for (const item of items) {
      if (!mongoose.isValidObjectId(item.foodId) || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 20) {
        return res.status(400).json({ message: "One or more cart items are invalid." });
      }
      const food = await Food.findOne({ _id: item.foodId, available: true });
      if (!food) return res.status(400).json({ message: "A food item is no longer available. Refresh your cart." });
      normalized.push({ food: food._id, name: food.name, image: food.image, price: food.price, quantity: item.quantity });
      subtotal += food.price * item.quantity;
    }
    const deliveryFee = subtotal >= 499 ? 0 : 35;
    const order = await Order.create({
      user: req.userId, items: normalized, deliveryAddress: deliveryAddress.trim(), phone: phone.trim(),
      subtotal, deliveryFee, total: subtotal + deliveryFee, paymentMethod: "COD"
    });
    res.status(201).json({ order });
  } catch (error) { next(error); }
});

router.get("/my", async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json({ orders });
  } catch (error) { next(error); }
});

export default router;
