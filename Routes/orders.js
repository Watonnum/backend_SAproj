const express = require("express");
const router = express.Router();
const {
  createOrder,
  getAllOrders,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  getOrderStats,
} = require("../Controller/orders");
const { authenticateToken, checkPermission } = require("../Middleware/auth");

// ทุก route ต้อง authenticate ก่อน
router.use(authenticateToken);

// สร้าง Order ใหม่จาก Cart - staff และลูกค้าทำได้
router.post("/orders", checkPermission("orders", "create"), createOrder);

// ดึง Orders ทั้งหมด - เฉพาะ admin/manager
router.get("/orders", checkPermission("orders", "read"), getAllOrders);

// ดึงสถิติ Orders - เฉพาะ admin/manager
router.get("/orders/stats", checkPermission("orders", "read"), getOrderStats);

// ดึง Orders ของ User คนใดคนหนึ่ง - staff ดูได้, ลูกค้าดูของตัวเองได้
router.get(
  "/orders/user/:userId",
  checkPermission("orders", "read"),
  getUserOrders
);

// ดึง Order เดียว - ทุกคนที่มี permission ดูได้
router.get("/orders/:id", checkPermission("orders", "read"), getOrderById);

// อัพเดทสถานะ Order - เฉพาะ admin/manager/staff
router.put(
  "/orders/:id/status",
  checkPermission("orders", "update"),
  updateOrderStatus
);

// ยกเลิก Order - staff และลูกค้าทำได้ (ลูกค้ายกเลิกของตัวเอง)
router.put(
  "/orders/:id/cancel",
  checkPermission("orders", "delete"),
  cancelOrder
);

module.exports = router;
