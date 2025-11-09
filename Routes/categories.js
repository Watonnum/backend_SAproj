const express = require("express");
const router = express.Router();
const {
  getAllCategories,
  getCategories,
  createCategories,
  updateCategories,
  removeCategories,
} = require("../Controller/categories");
const {
  authenticateToken,
  checkPermission,
  requireAdminOrManager,
} = require("../Middleware/auth");

// ทุก route ต้อง authenticate ก่อน
router.use(authenticateToken);

// อ่านข้อมูล categories - ทุกคนสามารถอ่านได้
router.get(
  "/categories/",
  checkPermission("categories", "read"),
  getAllCategories
);

router.get(
  "/categories/:id",
  checkPermission("categories", "read"),
  getCategories
);

// สร้าง อัพเดท ลบ categories - เฉพาะ admin และ manager
router.post(
  "/categories",
  checkPermission("categories", "create"),
  createCategories
);

router.put(
  "/categories/:id",
  checkPermission("categories", "update"),
  updateCategories
);

router.delete(
  "/categories/:id",
  checkPermission("categories", "delete"),
  removeCategories
);

module.exports = router;
