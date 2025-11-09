const express = require("express");
const router = express.Router();
const {
  getID,
  list,
  create,
  update,
  removeID,
} = require("../Controller/products");
const {
  authenticateToken,
  checkPermission,
  requireAdminOrManager,
} = require("../Middleware/auth");

// ทุก route ต้อง authenticate ก่อน
router.use(authenticateToken);

// อ่านข้อมูลสินค้า - ทุกคนสามารถอ่านได้
router.get("/products", checkPermission("products", "read"), list);

router.get("/products/:id", checkPermission("products", "read"), getID);

// สร้าง อัพเดท ลบสินค้า - เฉพาะ admin และ manager
router.post("/products", checkPermission("products", "create"), create);

router.put("/products/:id", checkPermission("products", "update"), update);

router.delete("/products/:id", checkPermission("products", "delete"), removeID);

module.exports = router;
