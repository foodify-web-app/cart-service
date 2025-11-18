import express from "express";
import { addToCart, removeFromCart, getCartByUserId, getItemsListByUserId, removeItemFromCart } from "../controllers/cartController.js";
import { authMiddleware } from "common-utils";
const cartRouter = express.Router();

cartRouter.post("/add", authMiddleware, addToCart);
cartRouter.post("/remove/", authMiddleware, removeFromCart);
cartRouter.get("/userid/:id", authMiddleware, getCartByUserId);
cartRouter.post("/remove/item", authMiddleware, removeItemFromCart);
cartRouter.get("/items/userid/:id", authMiddleware, getItemsListByUserId);

export default cartRouter;