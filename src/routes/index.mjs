import { Router } from "express";
import usersRouter from "./users.mjs";
import productRouter from "./products.mjs";

const router = Router();

router.use(usersRouter); // Using the user router
router.use(productRouter); // Using the product router

export default router;
