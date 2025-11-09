const express = require("express");
const router = express.Router();
const {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getAllCart,
} = require("../Controller/cart");
const { authenticateToken, checkPermission } = require("../Middleware/auth");

// ทุก route ต้อง authenticate ก่อน
router.use(authenticateToken);

// จัดการตระกร้าสินค้า - ทุกคนสามารถใช้ได้
router.post("/cart/add", checkPermission("cart", "create"), addToCart);

router.get("/cart/:userId", checkPermission("cart", "read"), getCart);

router.get("/cart", checkPermission("cart", "read"), getAllCart);

router.put("/cart/update", checkPermission("cart", "update"), updateCartItem);

router.delete(
  "/cart/remove",
  checkPermission("cart", "delete"),
  removeFromCart
);

router.delete(
  "/cart/clear/:userId",
  checkPermission("cart", "delete"),
  clearCart
);

module.exports = router;
