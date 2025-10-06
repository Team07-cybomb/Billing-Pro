// server/seedProducts.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import { products } from "./data/productsSeed.js";
import Product from "./models/Product.js";

dotenv.config(); // ✅ Load .env file first!

const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI is not defined in .env file!");
  process.exit(1);
}

const seedProducts = async () => {
  try {
    console.log("🚀 Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected successfully");

    // Optional: clear old data
    await Product.deleteMany();
    console.log("🗑️ Old product data removed");

    // Insert the new data
    await Product.insertMany(products);
    console.log(`✅ Successfully added ${products.length} products!`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding products:", error);
    process.exit(1);
  }
};

seedProducts();
