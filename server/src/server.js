import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import adminRoutes from "./routes/admin.js";
import buyerRoutes from "./routes/buyer.js";
import sellerRoutes from "./routes/seller.js";

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/buyer", buyerRoutes);
app.use("/api/seller", sellerRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API Running",
  });
});

app.listen(process.env.PORT || 4000, () => {
  console.log("Server Started");
});