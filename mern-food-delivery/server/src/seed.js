import dotenv from "dotenv";
import mongoose from "mongoose";
import Food from "./models/Food.js";
dotenv.config();

const foods = [
  { name: "Classic Cheeseburger", description: "Grilled patty, cheddar, lettuce and house sauce", category: "Burgers", price: 189, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800", vegetarian: false, rating: 4.8 },
  { name: "Crispy Chicken Burger", description: "Crispy chicken, pickles and creamy mayo", category: "Burgers", price: 219, image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=800", vegetarian: false, rating: 4.7 },
  { name: "Margherita Pizza", description: "Tomato, mozzarella and fresh basil", category: "Pizza", price: 249, image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800", vegetarian: true, rating: 4.6 },
  { name: "Farmhouse Pizza", description: "Bell peppers, onion, olives and mozzarella", category: "Pizza", price: 329, image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800", vegetarian: true, rating: 4.8 },
  { name: "Penne Alfredo", description: "Creamy parmesan sauce with herbs", category: "Pasta", price: 229, image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800", vegetarian: true, rating: 4.5 },
  { name: "Veggie Sushi Roll", description: "Avocado, cucumber and sesame", category: "Asian", price: 199, image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800", vegetarian: true, rating: 4.4 },
  { name: "Paneer Tikka Bowl", description: "Smoky paneer, rice, salad and mint chutney", category: "Indian", price: 199, image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800", vegetarian: true, rating: 4.7 },
  { name: "Chocolate Brownie", description: "Warm chocolate brownie, rich and fudgy", category: "Desserts", price: 99, image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800", vegetarian: true, rating: 4.9 },
  { name: "Strawberry Shake", description: "Fresh strawberry blended with chilled milk", category: "Drinks", price: 119, image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=800", vegetarian: true, rating: 4.5 }
];

try {
  await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/quickbite");
  await Food.deleteMany({});
  await Food.insertMany(foods);
  console.log(`Seeded ${foods.length} foods.`);
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
