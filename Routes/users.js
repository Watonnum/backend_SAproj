const express = require("express");
const router = express.Router();
const {
  getUsers,
  getUsersId,
  createUsers,
  removeUsers,
  updateUsers,
  bulkRemoveUsers,
} = require("../Controller/users");
const {
  authenticateToken,
  checkPermission,
  requireAdmin,
} = require("../Middleware/auth");

// ทุก route ต้อง authenticate ก่อน
router.use(authenticateToken);

// จัดการ users ตาม permission
router.get("/users", checkPermission("users", "read"), getUsers);

router.get("/users/:id", checkPermission("users", "read"), getUsersId);

router.post("/users", checkPermission("users", "create"), createUsers);

router.put("/users/:id", checkPermission("users", "update"), updateUsers);

router.delete("/users/:id", checkPermission("users", "delete"), removeUsers);

// Bulk delete route
router.post(
  "/users/bulk-delete",
  checkPermission("users", "delete"),
  bulkRemoveUsers
);

module.exports = router;
