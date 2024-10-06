import { Router } from "express";
import { products } from "../utils/constants.mjs";

const router = Router();

// Get Requests for /api/products route (Shows All Products)
router.get("/api/products", (req, res) => {
  res.status(200).send(products);
});

export default router;
