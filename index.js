import express from "express";
import cookieParser from "cookie-parser";
import config from "config";
import prisma from "./prisma.js";
import authRoutes from "./routes/auth.routes.js";
import categoriesRoutes from "./routes/categories.routes.js";
import productsRoutes from "./routes/products.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import ordersRoutes from "./routes/orders.routes.js";

const app = express();

const PORT = config.get("PORT");
const COOKIE_SECRET = config.get("COOKIE_SECRET");

const main = async () => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser(COOKIE_SECRET));
  app.use("/uploads", express.static("uploads"));
  app.use("/api/auth", authRoutes);
  app.use("/api/categories", categoriesRoutes);
  app.use("/api/products", productsRoutes);
  app.use("/api/profile", profileRoutes);
  app.use("/api/cart", cartRoutes);
  app.use("/api/orders", ordersRoutes);

  await app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}/`);
  });
};

main()
  .then(() => {
    prisma.$disconnect();
  })
  .catch((e) => {
    prisma.$disconnect();
    console.log(e);
    process.exit(1);
  });

// user1@mail.ru user
// ct9ao@mail.ru admin
