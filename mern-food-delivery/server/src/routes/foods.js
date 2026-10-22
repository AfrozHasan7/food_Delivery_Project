import { Router } from "express";
import Food from "../models/Food.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const filter = { available: true };
    if (req.query.category && req.query.category !== "All") filter.category = req.query.category;
    if (req.query.search) filter.name = { $regex: req.query.search, $options: "i" };
    const foods = await Food.find(filter).sort({ category: 1, name: 1 });
    res.json({ foods });
  } catch (error) { next(error); }
});

export default router;
