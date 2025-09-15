const express = require("express");
const router = express.Router();
const {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require("../Controller/cart");

// เพิ่มสินค้าเข้าตระกร้า
router.post("/cart/add", addToCart);

// ดูตระกร้าสินค้า
router.get("/cart/:userId", getCart);

// อัพเดทจำนวนสินค้า
router.put("/cart/update", updateCartItem);

// ลบสินค้าออกจากตระกร้า
router.delete("/cart/remove", removeFromCart);

// ล้างตระกร้า
router.delete("/cart/clear/:userId", clearCart);

module.exports = router;
