import { Router } from "express";
import { products } from "../utils/constants.mjs";

const router = Router();

// Get Requests for /api/products route (Shows All Products)
router.get("/api/products", (req, res) => {
  console.log(req.headers.cookie);
  console.log(req.cookies);
  console.log(req.signedCookies.Hello);
  if (req.signedCookies.Hello && req.signedCookies.Hello === "WORLD") {
    return res.status(200).send(products);
  } else {
    return res.status(403).send({ msg: "Sorry incorrect cookie" });
  }
});

export default router;
